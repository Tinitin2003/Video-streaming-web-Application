import {BrowserRouter, Route, Routes} from "react-router-dom";
//import React,{useState} from 'react';
import './App.css';
import { Login} from './Pages/Login';
import { Register } from './Pages/Register';
import { Dashboard } from './Pages/Dashboard';
import { Watch } from "./Pages/Watch";
import { Search } from "./Pages/Search";
import Aboutus from "./Pages/Aboutus";
import {NotFound} from "./Pages/Notfound"
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
function App() {
  const override = {
    display: "block",
    margin: "0 auto",

  };
  const[loading,setLoading]=useState(false)
  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
        setLoading(false)
    },5000)
  },[])
  return (
   <div className="App">
    {
      loading? <ClipLoader
      color={`rgb(1, 74, 172)`}
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />:<BrowserRouter>
    <Routes>
      <Route path="login" element={<Login/>} />
      <Route path="/" element={<Dashboard/>} />
      <Route path="register" element={<Register/>} />
      <Route path="watch/:TrailerId" element={<Watch/>} />
      <Route path="search" element={<Search/>} />
      <Route path="about" element={<Aboutus/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  </BrowserRouter>
    }
   
    </div>        
  );
}
export default App;
