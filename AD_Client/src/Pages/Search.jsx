import React, { useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import '../Pages/Search.css'
export const Search=()=>{
  const [searchquery,setSearchQuery]=useState();
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