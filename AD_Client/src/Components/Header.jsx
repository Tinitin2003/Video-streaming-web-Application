import {VscPlayCircle} from 'react-icons/vsc';
import { useEffect,useState } from 'react';
import axios from './URL/axios';
import {Link} from 'react-router-dom'
import URLS from './URL/url';
import '../Components/Header.css';
export default function Header(){
            const [movie,setMovie]=useState([]);

            useEffect(()=>{
                async function fetchData() {
                    const request=await axios.get(URLS.fetchTrending);
                    setMovie(
                        request.data.results[
                           Math.floor(Math.random()*request.data.results.length-1) 
                        ]
                    );
                    return request;
                }
                fetchData();
            },[]);
          
    return(
        <div className='header'   
        style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        }}>
            <div className='header_content'>
                <div className='header_board'>
                    <h1>{movie?.original_name || movie?.original_title}</h1>
                    <div className='header_description'>
                        <p >{movie?.overview}</p>
                    </div>
                </div>
                
                <div className='header_buttons'>
                <Link to={`watch`}> <button className='header_button play_button'><VscPlayCircle fontSize={`5rem`}/></button></Link>
                        <button className='header_button more_button'>More Info</button>
                </div>
            </div>
            <div className='header-poster'>
           
            </div>
          
        </div>
    )
}