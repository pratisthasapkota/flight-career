import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Explore from './Nav/Explore';
import Colleges from './Nav/Colleges';
import Contact from './Nav/Contact';
import Sign from './Nav/Sign';
import HomeScreen from './Nav/HomeScreen';
import Student from './Nav/Student';
import Store from './Nav/Store';
import Web from './Web';
import About from './About';
import { Navigate } from 'react-router-dom';
import Call from './Pages/Call';

import Apply from './Apply';

import Price from './Pages/Price';
import PaymentPage from './Pages/PaymentPage';
import Final from './Pages/Final';
import Finals from './Pages/Finals';
import Training from './Explores/Training';
import Craft from './Explores/Craft';
import Operation from './Explores/Operation';
import Hostess from './Explores/Hostess';
import Tips from './Pages/Tips';
import Question from './Pages/Question';
import Guide from './Pages/Guide';

import Pilots from './Explores/Pilots';

import CareerLayout from './Components/CareerLayout';
import Careers from './Pages/Careers/Careers';
import WhyWorkWithUs from './Pages/Careers/WhyWorkWithUs';
import WhatCanYouDo from './Pages/Careers/WhatCanYouDo';
import StudentCorner from './Pages/Careers/StudentCorner';
import BecomeAnEmployee from './Pages/Careers/BecomeAnEmployee';
import Vacancies from './Pages/Careers/Vacancies';
import FAQ from './Pages/Careers/FAQ';

import AdminLogin from './Pages/Admin/AdminLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import RequireAuth from './Components/RequireAuth';
import RequireAdmin from './Components/RequireAdmin';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Student/>} />
        <Route path="/login" element={<HomeScreen />} />
        <Route path="/about" element={<About/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/web" element={<Web />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/store" element={<Store />} />
        <Route path="/price" element={<Price />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/final" element={<RequireAuth><Final /></RequireAuth>} />
        <Route path="/finals" element={<RequireAuth><Finals /></RequireAuth>} />
        <Route path="/question" element={<RequireAuth><Question /></RequireAuth>} />
        <Route path="/training" element={<Training />} />
        <Route path="/operation" element={<Operation />} />
        <Route path="/craft" element={<Craft />} />
        <Route path="/hostess" element={<Hostess />} />
        <Route path="/tips" element={<RequireAuth><Tips /></RequireAuth>} />
        <Route path="/guide" element={<RequireAuth><Guide /></RequireAuth>} />
        <Route path="/pilots" element={<Pilots />} />
        <Route path="/jobs" element={<Navigate to="/careers/vacancies" replace />} />
        <Route path="/call" element={<Call/>} />

        <Route path="/careers" element={<CareerLayout />}>
          <Route index element={<Careers />} />
          <Route path="why-work-with-us" element={<WhyWorkWithUs />} />
          <Route path="what-can-you-do" element={<WhatCanYouDo />} />
          <Route path="student-corner" element={<StudentCorner />} />
          <Route path="become-an-employee" element={<BecomeAnEmployee />} />
          <Route path="vacancies" element={<Vacancies />} />
          <Route path="faq" element={<FAQ />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
      </Routes>
   
  );
}

export default App;
