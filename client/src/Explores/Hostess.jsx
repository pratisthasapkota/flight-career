import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Hostess = () => {
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
                      url("/air.png") center/cover no-repeat;
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
          <h1>Air Hostess Careers – Explore the Skies</h1>
          <p>
            Travel the world, meet people from diverse cultures, and create
            exceptional passenger experiences. Air Hostess is an exciting and rewarding career.
          </p>
        </header>

        <div className="guide-content">
          <p>
            Air Hostesses, also known as Flight Attendants, are the face of the airline. 
            They ensure passenger comfort, safety, and provide excellent customer service 
            onboard. Their responsibilities combine hospitality with critical safety management.
          </p>

        

          <p className="highlight-box">
            Important: Passenger safety always comes first. While service and comfort are crucial, 
            all cabin crew members are trained to respond to emergencies, follow protocols, and 
            assist passengers in critical situations.
          </p>

          <h2>Career Opportunities</h2>
          <ul>
            <li>Flight Attendant – Frontline cabin crew responsible for passenger care</li>
            <li>Cabin Crew Trainer – Train new recruits in service and safety procedures</li>
            <li>In-Flight Services Manager – Oversee cabin operations, manage crew, ensure service quality</li>
          </ul>

          <p>
            Air Hostesses must possess strong communication skills, empathy, patience, and problem-solving abilities.
            Professionalism, grooming, and interpersonal skills are highly valued. Every flight brings new challenges 
            and experiences, making this career dynamic and rewarding.
          </p>

          <p>
            Continuous learning is essential. Cabin crew undergo regular training for safety procedures, service excellence, 
            and emergency management. This ensures the highest standards of passenger care and airline reputation.
          </p>

          <Link to="/explore" className="back-link">← Back to Explore</Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Hostess;
