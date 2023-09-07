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
function App() {

  return (
   <div className="App">
    {
      <BrowserRouter>
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
