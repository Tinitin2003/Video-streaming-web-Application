import {useState,useEffect} from 'react'
import './Watch.css'
import {Link,useParams} from 'react-router-dom'
import {BiArrowBack} from 'react-icons/bi'
import FOOT from '../Components/Footer'
import ReactPlayer from 'react-player'
import Nav from '../Components/Nav'
export const Watch=()=>{
    const params=useParams();
    const key=params.TrailerId;
    const [background,setBackground]=useState(false);
    useEffect(() => {
        window.addEventListener('scroll', transitionNavBar);
        return () => {
          window.removeEventListener('scroll', transitionNavBar);
        };
      }, []);
      const transitionNavBar=()=>{
        if(window.scrollY>1){
            setBackground(true);
        }
        else{
            setBackground(false);
        }
    }
  return (
            <div className='watch-page'>
            <div className={`${background ? 'nav_visible' : 'nav_hide'}`}>
            <Nav/>
            </div>
            <div className='player-page-container'>
            <Link to={`/`}><BiArrowBack size={`50px`} color={`white`}/> </Link>

            {(key!=null)?<ReactPlayer controls="true" playing={true} url={`https://www.youtube.com/watch?v=${key}`}
            width={`100%`} height={`100vh`} />:null}
            <FOOT/>
            </div>
            </div>
  )
}

