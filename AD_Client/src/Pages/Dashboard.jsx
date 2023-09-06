import './Dashboard.css';
import Nav from '../Components/Nav';
import Content from '../Components/Content';
import Header from '../Components/Header';
import FOOT from '../Components/Footer';

import {useNavigate} from 'react-router-dom';
import { useEffect,useRef } from 'react';
export const Dashboard  =()=>{
    const navigate=useNavigate();
    const tempnavi=useRef();
    const navigateFun=()=>{
        const token=localStorage.getItem("token");
        if(token==null){
            navigate('/login');
        }
    }
    tempnavi.current=navigateFun;
    useEffect(()=>{
       tempnavi.current();
    },[])
    return (
        <div>
            <Nav/>
            <Header/>
            <Content/>
            <FOOT/>
            </div>
    )
}