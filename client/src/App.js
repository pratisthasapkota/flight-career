
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './Nav/Main';
import Explore from './Nav/Explore';
import Colleges from './Nav/Colleges';
import Contact from './Nav/Contact';
import Sign from './Nav/Sign';
import HomeScreen from './Nav/HomeScreen';
import Student from './Nav/Student';
import Store from './Nav/Store';
import Web from './Web';
import About from './About';
import Top from './Components/Top';
import Jobs from './Pages/Jobs';
import Call from './Pages/Call';



import Apply from './Apply';

import Price from './Pages/Price';
import Final from './Pages/Final';
import Finals from './Pages/Finals';
import Training from './Explores/Training';
import Craft from './Explores/Craft';
import Operation from './Explores/Operation';
import Hostess from './Explores/Hostess';
import Tips from './Pages/Tips';
import Question from './Pages/Question';

import Pilots from './Explores/Pilots';
function App() {
  return (
    
      <Routes>
        <Route path="/login" element={<HomeScreen />} />
        <Route path="/" element={<Main/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/web" element={<Web />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/student" element={<Student />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/store" element={<Store/>} />
        <Route path="/price" element={<Price/>} />
        <Route path="/final" element={<Final/>} />
        <Route path="/finals" element={<Finals/>} />
        <Route path="/question" element={<Question/>} />
        <Route path="/training" element={<Training/>} />
        <Route path="/operation" element={<Operation/>} />
        <Route path="/craft" element={<Craft/>} />
        <Route path="/hostess" element={<Hostess/>} />
        <Route path="/tips" element={<Tips/>} />
        <Route path="/pilots" element={<Pilots/>} />
        <Route path="/question" element={<Question/>} />
        <Route path="/jobs" element={<Jobs/>} />
        <Route path="/call" element={<Call/>} />
         




      </Routes>
   
  );
}

export default App;
