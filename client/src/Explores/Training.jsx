import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Training = () => {
  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          background: #f5f7fa;
        }

        .fullpage-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .guide-header {
          width: 100%;
          text-align: center;
          padding: 100px 20px 50px;
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
                      url("/trains.png") center/cover no-repeat;
          color: white;
        }

        .guide-header h1 {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .guide-header p {
          font-size: 20px;
          max-width: 700px;
          margin: auto;
          line-height: 1.6;
        }

        .guide-content {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          color: #333;
        }

        .guide-content p {
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .guide-content h2 {
          font-size: 28px;
          margin: 30px 0 15px;
          color: #003366;
        }

        .guide-content img {
          width: 100%;
          max-width: 800px;
          display: block;
          margin: 30px auto;
          border-radius: 12px;
        }

        .guide-content ul {
          padding-left: 25px;
          margin-bottom: 20px;
        }

        .guide-content li {
          margin-bottom: 10px;
          font-size: 17px;
        }

        .highlight-box {
          background: #f0f8ff;
          padding: 20px;
          border-left: 5px solid #003366;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 17px;
        }

        .back-link {
          display: inline-block;
          margin-top: 30px;
          text-decoration: none;
          color: #003366;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .guide-header h1 {
            font-size: 36px;
          }
          .guide-header p {
            font-size: 16px;
          }
        }
      `}</style>

      <Navbar />

      <div className="fullpage-wrapper">
        <header className="guide-header">
          <h1>Training & Courses in Aviation</h1>
          <p>
            Your journey to a professional aviation career begins with the right training. 
            From pilots to cabin crew, proper certification and guidance is key to success.
          </p>
        </header>

        <div className="guide-content">
          <p>
            Aviation training prepares candidates for the challenges and responsibilities of the airline industry.
            Courses range from flight operations and safety training to customer service and hospitality skills
            for cabin crew. Completing professional programs significantly increases employability and confidence.
          </p>

         

          <p className="highlight-box">
            Highlight: Choose courses approved by aviation authorities and experienced instructors to ensure
            quality training and real-world readiness.
          </p>

          <h2>Popular Courses</h2>
          <ul>
            <li>PPL – Private Pilot License: Basic flight skills and aircraft handling.</li>
            <li>CPL – Commercial Pilot License: Prepare for professional pilot roles in airlines.</li>
            <li>Flight Attendant Training: Grooming, communication, safety procedures, and customer service.</li>
            <li>Cabin Crew Certification: Comprehensive programs covering in-flight operations and hospitality.</li>
          </ul>

          <p>
            Practical exposure, simulator training, and soft skills development are integral to aviation courses.
            Networking with instructors and peers can also open doors to internships and job placements in top airlines.
          </p>

          <Link to="/explore" className="back-link">← Back to Explore</Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Training;
