import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import FOOT from '../Components/Footer';
import Axios from 'axios';
export const Login =(props)=>{
    const navigate=useNavigate();
    const [email,setEmail]=useState('');
    const [emailError,setEmailError]=useState('');
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const [passwordError,setPasswordError]=useState('');
    const [successStatus,setSuccessStatus]=useState("");
    const [passwordStatus,setPasswordStatus]=useState('HIDE');
    
    const handlePasswordChange =(evnt)=>{
        setPasswordInput(evnt.target.value);
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
    }
    const togglePassword =()=>{
      if(passwordType==="password")
      {
       setPasswordType("text")
       setPasswordStatus('SHOW');
       return;
      }
      setPasswordType("password")
      setPasswordStatus('HIDE');
    }
    const login=(e)=>{
        e.preventDefault();
        if(email!==''){
                setEmailError('');
        }else{
            setEmailError('Email Required');
        }
        if(passwordInput!==''){
            setPasswordError('');
        }else{
            setPasswordError('Password Required');
        }
        if(email!=='' && passwordInput!==''){
        Axios.post("https://ad-server-cjgk.onrender.com/login",{
            email:email,
            password:passwordInput,
        }).then((response)=>{
            if(response.data.message){
                console.log(response.data.message)
                setSuccessStatus("Sorry, we can't find an account with this email address. Please try again or create a new account.");
            }
            else{
                    setSuccessStatus('');
                    localStorage.setItem('token',response.data[0].Id);
                      navigate('/');
            }
        });}
       
    };
    const token=localStorage.getItem("token");
    useEffect(()=>{
        if(token!=null){
            navigate('/');
        }})
    return (
        <div>
        <div className='login-page'>
            <img src='favicon.ico' className='logo' alt='logo'/>
            <div className='login-container'>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit} className="login-form">
            {successStatus&&<div className='success-status'>{successStatus}</div>}
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} className='form-input form-input-email' type="email" id="email" name="email" />
            {emailError&&<div className='error-msg'>{emailError}</div>}
            <br></br>
            <label htmlFor="password">Password</label>
            <div className='input-box'>
            <input value={passwordInput} onChange={handlePasswordChange} className='form-input form-input-pass' minLength="5" maxLength="20" type={passwordType} id="password" name="password" />
            <button onClick={togglePassword}  className='toggle-button'>{passwordStatus}</button>
            </div>
            {passwordError&&<div className='error-msg'>{passwordError}</div>}
            <br></br>
            <button type='submit' className="button" onClick={login} >Sign in</button>
            <p>New to AD ? <a className="signup-route" href="register">Sign up now</a>.</p>
        </form>
            </div>        
        </div>
        <FOOT/>
        </div>
    )
}