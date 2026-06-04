
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../Components/Navbar';
 const Main = () => {

  const navigate = useNavigate();
  
  const  directClick=()=>{
    navigate('/explore'); 
  }
  

  
return(
  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
  <Navbar/>
  
  <button
    style={{
      position: 'absolute',
      top: '55%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      height: '50px',
      borderRadius: '50px',
      border: 'none',
      backgroundColor: 'blue',
      color: 'white',
      cursor: 'pointer'

    }}
    onClick={directClick}
  >
    Explore Opportunities
  </button>

  <img
    style={{ width: '100%', height: '100%', display: 'block' }}
    src="/hehe.png"
    alt="haha"
  />
  <i style={{top:'65%'}}className="tagline">
  Soar High. Achieve Your Dream Career in Aviation.
</i>

</div>
)
 }

export default Main;