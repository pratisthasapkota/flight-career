import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Content from "../Pages/Content";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import "./Student.css";
import axios from "axios";

const Student = () => {
  const navigate = useNavigate();

  const decodePayload = (token) => {
    try {
      const p = token.split('.')[1] || '';
      let s = p.replace(/-/g, '+').replace(/_/g, '/');
      const pad = s.length % 4; if (pad) s += '='.repeat(4 - pad);
      return JSON.parse(atob(s));
    } catch {
      return null;
    }
  };

  const isTokenValid = (token) => {
    const payload = decodePayload(token);
    if (!payload || !payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  };

  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");



  const onClick = async () => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      navigate('/final');
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refresh`,);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/final');
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  };

  const handleClick = () => {
    navigate('/jobs');
  };

  const doClick = () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (email && password) navigate("/Question");
    else navigate("/login");
  };

  const checkClick = () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (email && password) navigate("/tips");
    else navigate("/login");
  };

  const handleNotify = async () => {
    if (!notifyEmail) {
      setNotifyMessage("Please enter your email first.");
      return;
    }

    try {
      await axios.post(`${process.env.BACKEND_URL}/api/notify`, {
        email: notifyEmail,
      });

      setNotifyMessage("You will be notified soon!");
      setNotifyEmail("");

    } catch (error) {
      console.log(error);
      setNotifyMessage("Something went wrong. Try again.");
    }
  };


  return (
    <>
      <Navbar />

      <div className="hero">
        <div className="hero-content">
          <h1>PASS THE CABIN CREW INTERVIEW ON YOUR FIRST TRY</h1>
          <p>Access expert interview tips, questions, and complete preparation resources.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/jobs")}>Interview Advice</button>
            <button>Cabin Crew Jobs</button>
          </div>
        </div>
      </div>

      <h2 className="section-title">Here’s how I can help you:</h2>

      <div className="help-section">
        <div className="email-section">
          <h3>Never Miss an Airline Opportunity</h3>
          <p>Stay updated with the latest airline job openings.</p>

          <div className="email-signup">
            <input
              type="email"
              className="email-input"
              placeholder="Enter your email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
            />
            <button className="notify-btn" onClick={handleNotify}>
              Notify Me
            </button>
          </div>

          {notifyMessage && (
            <p style={{ color: "green", marginTop: "10px", fontWeight: "500" }}>
              {notifyMessage}
            </p>
          )}
        </div>
      </div>

      <div className="help-card">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" alt="Book" />
        <div className="help-content">
          <h3>Stand Out From The Crowd</h3>
          <p>Learn what recruiters look for...</p>
          <button onClick={() => navigate("/finals")}>See More</button>
        </div>
      </div>

      <div className="help-card reverse">
        <img src="/ship.jpg" alt="Questions" />
        <div className="help-content">
          <h3>How to pass the cabin crew interview 100%</h3>
          <p>Get access to the best questions.</p>
          <button onClick={() => navigate("/final")}>Get Course</button>
        </div>
      </div>

      <div className="help-card">
        <img src="/int.jpg" alt="Questions" />
        <div className="help-content">
          <h3>Interview Questions & Answers</h3>
          <p>Access the latest questions.</p>
          <button onClick={() => navigate("/Question")}>See More</button>
        </div>
      </div>

      <div className="help-card reverse">
        <img src="/tips.jpeg" alt="Book" />
        <div className="help-content">
          <h3>Cabin Crew Interview Tips</h3>
          <p>Learn how to pass confidently.</p>
          <button onClick={() => navigate("/tips")}>Login</button>
        </div>
      </div>

      <Content />
      <Footer />
    </>
  );
};

export default Student;
