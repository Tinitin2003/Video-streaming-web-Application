import React, { useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import api from '../Components/URL/axiodConfig';
import '../Pages/Search.css'
export const Search=()=>{
  const [searchquery,setSearchQuery]=useState();
  const [movies,setMovies]=useState();
  const getMovies=async()=>{
    try{
      const response=await api.get("/getdata");
      setMovies(response.data);
  
    }catch(err){
      console.log(err);
    
  }
  }
  const handleSearch=(event)=>{
    event.preventDefault();
  }
  return(
    <div className='search'>
      <div className='search-panal'>
    <form className='search-bar' onSubmit={handleSearch}>
      <button><FiSearch size={`2rem`} color={`white`}/></button>
      <input type="text" value={searchquery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search Movie,Web Shows & Documentry etc"/>
    </form>
    </div>

    </div>
  )
}