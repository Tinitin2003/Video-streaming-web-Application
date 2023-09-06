const express=require("express");
const mysql=require("mysql");
const cors=require("cors");
const app=express();
const bcrypt=require("bcryptjs");
app.use(express.json());
app.use(cors());
const {MongoClient}=require('mongodb');
const url='mongodb+srv://Nitin:dehradun@cluster0.avvriof.mongodb.net/?retryWrites=true&w=majority'
const client=new MongoClient(url);
const con= mysql.createConnection({
    host: "database-1.cr0drigbvyvh.ap-northeast-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "nitinpanwar",
    database:"AD_Database"
})
app.post('/register',async(req,res)=>{
    const username=req.body.username;
    const email=req.body.email;
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    const password=secPass;
    con.query("select * from User where Email=? ",[email],
        (err,result)=>{
            if(err){
                req.setEncoding({err:err});
            }else{
             if(result.length>0){
                res.send({message: "Email already in use"});
             }
             else{
                con.query("insert into User (Name,Email,Password) values(?,?,?)",[username,email,password],
                (err,result)=>{
                    if(result){
                        res.send(result);
                    }else{
                        res.send({message: "Enter Incorrect"})
                    }
                }
            )
             }
            }
        }
    )
})
app.post('/login',async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    con.query("select * from User where Email=?",[email],
        async (err,result)=>{
            if(err){
                req.setEncoding({err:err});
            }else{
                var data=JSON.parse(JSON.stringify(result))
             if(await bcrypt.compare(password,data[0].Password)){
                res.send(result);
             
                console.log(data[0].Password);
             }
             else{
                res.send({message: "Wrong username or password"});
             }
            
        }
    }
    )
})

async function getData(){
}
getData();
app.get('/getdata',async (req,res)=>{
    let result= await client.connect();
    let db=result.db('movie-api-db')
    let collection=db.collection('movies');
    let response=await collection.find({}).toArray();
     res.send(response)
})


app.listen(3001,()=>{
    console.log("server is running");
})