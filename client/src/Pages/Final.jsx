import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Final = () => {
  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #fafafa;
        }
        .course-hero {
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
          url("https://images.unsplash.com/photo-1506812574058-fc75fa93fead?auto=format&fit=crop&w=1400&q=80")
          center/cover no-repeat;
          color: white;
          text-align: center;
          padding: 120px 30px;
        }
        .course-hero h1 {
          font-size: 42px;
          font-weight: 700;
        }
        .course-hero p {
          font-size: 19px;
          opacity: 0.9;
          margin-top: 12px;
        }
        .course-container {
          max-width: 1100px;
          margin: 60px auto;
          padding: 20px;
        }
        .section {
          margin-bottom: 60px;
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .section h2 {
          font-size: 26px;
          margin-bottom: 15px;
          color: #00305c;
        }
        .section ul li {
          margin-bottom: 10px;
          font-size: 16px;
        }
        .cta-box {
          background: #00305c;
          padding: 40px;
          margin-top: 60px;
          border-radius: 12px;
          text-align: center;
          color: white;
        }
        .cta-box a {
          display: inline-block;
          background: yellow;
          padding: 13px 35px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          color: black;
          margin-top: 18px;
        }
      `}</style>

      <Navbar />

      <div className="course-hero">
        <h1>Cabin Crew Interview Mastery Course</h1>
        <p>Learn everything needed to crack your Dream Airline Interview on the FIRST attempt.</p>
      </div>

      <div className="course-container">
        <div className="section">
          <h2>📌 What You Will Learn</h2>
          <ul>
            <li>Complete introduction to airline recruitment process</li>
            <li>How to behave professionally during recruitment</li>
            <li>How to answer personal & situational questions</li>
            <li>Group discussion training & real examples</li>
            <li>Personality development & confidence building</li>
            <li>Resume/CV & grooming training included</li>
          </ul>
        </div>

        <div className="section">
          <h2>📚 Course Modules</h2>
          <ul>
            <li>Module 1 — Introduction to Cabin Crew Industry</li>
            <li>Module 2 — Communication & Body Language</li>
            <li>Module 3 — Personal HR Questions</li>
            <li>Module 4 — Final Interview Questions</li>
            <li>Module 5 — Safety, First Aid & Aviation Knowledge</li>
            <li>Module 6 — Final Evaluation & Certification</li>
          </ul>
        </div>

        <div className="cta-box">
          <h2>📖 Want to Read Our Cabin Crew Interview Book?</h2>
          <p>Click below to get full access to the book.</p>

         
          <Link to="/finals" style={{ backgroundColor: "yellow", padding: "13px 35px", fontWeight: 700, borderRadius: 8, textDecoration: "none", color: "black", display: "inline-block", marginTop: 18 }}>
            Read the Book
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Final;
