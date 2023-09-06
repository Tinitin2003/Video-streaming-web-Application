import './Footer.css';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
const Footer=()=>{
    return(
       <div className='footer'>
        <div className='sb__footer section__padding'>
            <div className='sb__footer-links'>
            <div className='sb__footer-links-div'>
                <h4>For Business</h4>
                <a href="/employer"><p>Employer</p></a>
                <a href="/healthplan"><p>Stock</p></a>
                <a href="/individual"><p>Individual</p></a>
                </div>
                <div className='sb__footer-links-div'>
                <h4>Resources</h4>
                <a href="/resource"><p>Resource center</p></a>
                <a href="/healthplan"><p>Testimonials</p></a>
                <a href="/individual"><p>STV</p></a>
                </div>
                <div className='sb__footer-links-div'>
                <h4>Company</h4>
                <a href="/aboutus">About Us</a>
                <a href="/career"><p> Careers</p></a>
                <a href="/individual"><p>Contact Us</p></a>
                </div>
                <div className='sb__footer-links-div'>
                <h4>Legal</h4>
                <a href="/employer"><p>Privacy Policy</p></a>
                <a href="/healthplan"><p>Terms of Services</p></a>
                <a href="/individual"><p>Content Complaints</p></a>
                </div>
                <div className='sb__footer-links-div'>
                <h4>Follow us for update</h4>
                <div className='socialmedia'>
                <a href="/employer"><FaInstagram/></a>
                <a href="/employer"><FaTwitter/></a>
                <a href="/healthplan"><FaLinkedin/></a>
                <a href="/individual"><FaFacebook/></a>
                </div>
                </div>
                <hr></hr>
                <div className='sb__footer-below'>
                    <p>
                        @{new Date().getFullYear()} AnandDarshan. All right reserved.
                    </p>
                </div>
            </div>
        </div>
       </div>
    )
}
export default Footer;