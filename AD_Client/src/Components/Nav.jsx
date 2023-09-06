import './Nav.css';
import { VscAccount } from 'react-icons/vsc';
import { BsFillHouseFill } from 'react-icons/bs';
import { SlOptions } from 'react-icons/sl';
import {AiOutlineNotification, AiOutlineEdit} from 'react-icons/ai'
import {HiOutlineLogout} from 'react-icons/hi'
import {FiHelpCircle,FiSearch} from 'react-icons/fi'
import {GoSettings} from 'react-icons/go'
import {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
export default function Nav(){
    const [background,setBackground]=useState(false);
    const [open,setOpen]=useState(false);
    const Name="Nitin";
    const Navigate=useNavigate();
    const transitionNavBar=()=>{
        if(window.scrollY>1){
            setBackground(true);
        }
        else{
            setBackground(false);
        }
    }
    const search=()=>{
        Navigate('search')
    }
    const logout=()=>{
        localStorage.removeItem("token");
    }
    useEffect(() => {
        window.addEventListener('scroll', transitionNavBar);
        return () => {
          window.removeEventListener('scroll', transitionNavBar);
        };
      }, []);
    return(
        <div className='nav'>
        <div className={`${background ? 'nav_black' : 'nav_transparent'}`}>
            <div className='nav_container'>
            <div className='nav_left'>
            <img src='/favicon.ico' className='nav_logo' alt='nav_logo'/>
                <div className='nav_links'>
                    <a href="/"><BsFillHouseFill/></a>
                    <a href="/">Shows</a>
                    <a href="/">Movies</a>
                    <a href="/">Channel</a>
                    <a href="/">Your Choice</a>
                </div>
            </div>
            <div className='nav_right'>
              <FiSearch fontSize={`3rem`} onClick={search}/>
                <div className='nav_notification'>
                <AiOutlineNotification/>
                </div>
                <VscAccount fontSize={`3rem`}/>
                <p> Hi {Name}</p>
                <div className='menu-container'>
                    <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
                    <button><SlOptions fontSize={`1.2rem`}/></button>
                    </div>
                    <div className={`dropdown-menu ${open? 'active' : 'inactive'}`}>
                        <ul>
                            <DropdownItem img={ AiOutlineEdit} text={'Edit Profile'} onClick={search}/>
                            <DropdownItem img={ GoSettings} text={'Settings'} onClick={search}/>
                            <DropdownItem img={ FiHelpCircle} text={'Helps'} onClick={search}/>
                            <DropdownItem img={ HiOutlineLogout} func={logout} text={'Logout'} onClick={search}/>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}
function DropdownItem(props){
    return(
        <li className='dropdownItem' onClick={props.func}>
           <div className='img'><props.img /></div>
                <a href='/'>{props.text}</a>
        </li>
    )
}