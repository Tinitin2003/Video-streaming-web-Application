import './Content.css';
import Row from './Row/Row';
import { Link } from 'react-router-dom';
import URLS from './URL/url'; 
import api from './URL/axiodConfig';
import { useState,useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import {Paper} from '@mui/material'
export default function Content(){
    const [movies,setMovies]=useState();
    const getMovies=async()=>{
      try{
        const response=await api.get("/getdata");
        setMovies(response.data);
    
      }catch(err){
        console.log(err);
      }
    }
    useEffect(()=>{
      getMovies();
    },[])
 console.log(movies)
    return(
        <div className='content_container'>
            
             <Row title='Trending Movies' fetchUrl={URLS.fetchTrending}/>
             <Row title='Top Rated' fetchUrl={URLS.fetchTvShows}/>
             <Row title='Upcoming' fetchUrl={URLS.fetchLatest}/>
             <Carousel>
             {
                movies?.map((movie)=>{
                    return(
                        <Paper>
                            <div className='movie-card-container'>
                            <Link to={`watch/${movie.trailerLink.substring(movie.trailerLink.length-11)}`}>
                                <div className='movie-card'>
                                    <div className='movie-poster'>
                                        <img src ={movie.poster} alt="hello"/>
                                    </div>
                                    <div className='movie-title'>
                                        <h4>{movie.title}</h4>
                                    </div>
                                </div>
                                </Link>

                            </div>
                        </Paper>
                    )
                })
            } 
        </Carousel>
        </div>
    )
}