import React,{useState} from "react";
import Axios from 'axios';
import './Register.css';
import FOOT from '../Components/Footer';
export const Register =()=>{
        const [name,setName]=useState('');
        const [nameError,setNameError]=useState('');
        const [email,setEmail]=useState('');
        const [emailError,setEmailError]=useState('');
        const [pass,setPass]=useState('');
        const [passwordError,setPasswordError]=useState('');
        const [registerStatus,setRegistrationStatus]=useState("");
        const register=(e)=>{
            e.preventDefault();
            if(name!==''){
                setNameError('');
            }
            else{
                setNameError("Name Required");
            }
            if(email!==''){
                setEmailError('');
        }else{
            setEmailError('Email Required');
        }
        if(pass!==''){
            setPasswordError('');
         
        }else{
            setPasswordError('Password Required');
        }
        if(email!=='' && pass!=='' && name!==''){
            Axios.post("https://ad-server-cjgk.onrender.com/register",{
                username:name,
                email:email,
                password:pass,
            }).then((response)=>{
                if(response.data.message){
                    setRegistrationStatus('');
                    setRegistrationStatus('Email already in use');
                    
                }
                else{
                    window.location.assign('/');
                }
            });
        }
        };
     
        return (
            <div className="register-page">
                 <img src='favicon.ico' className='logo' alt='logo'/>
                <div className="register-container">
                <h1>Create Account</h1>
                {registerStatus&&<div className="error-msg">{registerStatus}</div>}
                 <form className="register-form">
                <label htmlFor="name">Your name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="First and last name" id="name" name="name"/>
                {nameError&&<div className='error-msg'>{nameError}</div>}
                <br></br>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email Address" id="email" name="email" />
                {emailError&&<div className='error-msg'>{emailError}</div>}
                <br></br>
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e)=>setPass(e.target.value)} minLength="5" maxLength="20" type="password" placeholder="At least 5 characters" id="password" name="password" />
                {passwordError&&<div className='error-msg'>{passwordError}</div>}
                <br></br>
                <button type='submit' onClick={register}>Create your AD account</button>
                <br></br>
                <p>Already have an account? <a href="/login" className="signin-route">Sign in</a>.</p>
                </form>
                <br></br>
                <p>By creating an account or logging in, you agree to AnantDarshan’s Conditions of Use and Privacy Policy.</p>
                </div>
                <br></br>
                <FOOT/>
            </div>
        )
}