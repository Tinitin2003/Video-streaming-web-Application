import React from 'react'
import './Notfound.css';
import { useNavigate } from 'react-router-dom';
import { BsFillHouseFill } from 'react-icons/bs';
export const NotFound=()=>{
    const Navigate=useNavigate('');
    const home=()=>{
        Navigate('/')
    }
  return(
    <div className='notf-page'>
     <img src="\Images\Error404.jpg" alt="Error 404"/>
     <p>This page isn't available. Please try for something else.</p>
     <button onClick={home}><BsFillHouseFill/>Go to Home.</button>
    </div>
  )
}