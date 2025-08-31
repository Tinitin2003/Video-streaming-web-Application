require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

// CORS: adjust origin in production
app.use(cors({
  origin: ['http://localhost:3000'], // your front-end origin
  credentials: true
}));

// Load env
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // preserve extension and create unique name
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// MySQL pool (promise)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'nitin',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ad_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// --- Auth middleware ---
function verifyToken(req, res, next) {
  // Expect header "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verify error:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    // Attach user info (use consistent keys)
    req.user = { id: decoded.id, email: decoded.email };
    next();
  });
}

// --- Register ---
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query('SELECT Id FROM users WHERE Email = ?', [email]);
    if (rows.length > 0) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (Name, Email, Password) VALUES (?, ?, ?)', [username, email, hashed]);

    res.status(201).json({ message: 'Registered successfully', userId: result.insertId });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Login ---
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const [rows] = await pool.query('SELECT Id, Name, Email, Password FROM users WHERE Email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    // Sign JWT - use key names you expect on frontend
    const token = jwt.sign({ id: user.Id, email: user.Email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: { id: user.Id, name: user.Name, email: user.Email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve uploads directory
app.use(`/${UPLOAD_DIR}`, express.static(path.join(__dirname, UPLOAD_DIR)));

// --- Get videos (paginated) ---
// If you want this public remove verifyToken
app.get('/videos', verifyToken, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  try {
    const [videos] = await pool.query(
      `SELECT video_id, user_id, title, description, url, thumbnail, views_count, upload_date, category
       FROM videos ORDER BY upload_date DESC LIMIT ? OFFSET ?`, [limit, offset]
    );

    res.json({ page, videos });
  } catch (err) {
    console.error('Videos fetch error:', err);
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

const viewCache = new Map(); // Simple in-memory cache, not persistent

app.get('/videos/:id', verifyToken, async (req, res) => {
  const videoId = req.params.id;
  const clientIp = req.ip; // or req.headers['x-forwarded-for'] || req.connection.remoteAddress

  const cacheKey = `${clientIp}-${videoId}`;
  const now = Date.now();

  try {
    if (!viewCache.has(cacheKey) || now - viewCache.get(cacheKey) > 60000) { // 60 seconds cooldown
      await pool.query(
        `UPDATE videos SET views_count = views_count + 1 WHERE video_id = ?`,
        [videoId]
      );
      viewCache.set(cacheKey, now);
    }

    const [[video]] = await pool.query(
      `SELECT video_id, user_id, title, description, url, thumbnail, views_count, upload_date, category
       FROM videos WHERE video_id = ?`, [videoId]
    );

    if (!video) return res.status(404).json({ message: 'Video not found' });

    const [[stats]] = await pool.query(
      `SELECT
         SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
         SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
       FROM video_reactions WHERE video_id = ?`, [videoId]
    );

    res.json({ video, stats });
  } catch (err) {
    console.error('Video fetch error:', err);
    res.status(500).json({ message: 'Error fetching video data' });
  }
});


// --- Upload a video ---
app.post(
  "/videos",
  verifyToken,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // Validate required video
      if (!req.files || !req.files.videoFile) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const userId = req.user.id;
      const { title = "", description = "", category = "" } = req.body;

      // Save video URL
      const videoUrl = `/${UPLOAD_DIR}/${req.files.videoFile[0].filename}`;

      // Save thumbnail URL if provided
      let thumbnailUrl = null;
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnailUrl = `/${UPLOAD_DIR}/${req.files.thumbnail[0].filename}`;
      }

      // Insert into database including thumbnail
      const [result] = await pool.query(
        `INSERT INTO videos (user_id, title, description, url, thumbnail, category, upload_date)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [userId, title, description, videoUrl, thumbnailUrl, category]
      );

      res.status(201).json({
        videoId: result.insertId,
        message: "Video uploaded successfully"
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Error uploading video" });
    }
  }
);


// --- Reaction endpoints ---
app.post('/videos/:id/reaction', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.id;
    const { is_like } = req.body; // expect true/false or 1/0

    if (typeof is_like === 'undefined') return res.status(400).json({ message: 'Missing is_like value' });

    // Use ON DUPLICATE KEY UPDATE; make sure you have unique key (user_id + video_id)
    await pool.query(
      `INSERT INTO video_reactions (user_id, video_id, is_like, reacted_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE is_like = VALUES(is_like), reacted_at = VALUES(reacted_at)`,
      [userId, videoId, is_like ? 1 : 0]
    );

    res.json({ message: 'Reaction saved' });
  } catch (err) {
    console.error('Reaction save error:', err);
    res.status(500).json({ message: 'Error saving reaction' });
  }
});

app.delete('/videos/:id/reaction', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.id;

    await pool.query('DELETE FROM video_reactions WHERE user_id = ? AND video_id = ?', [userId, videoId]);

    res.json({ message: 'Reaction removed' });
  } catch (err) {
    console.error('Reaction delete error:', err);
    res.status(500).json({ message: 'Error removing reaction' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
