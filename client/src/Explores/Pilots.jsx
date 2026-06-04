import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Pilots = () => {
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
                      url("/pilot.png") center/cover no-repeat;
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
          <h1>Pilot Career – Your Complete Guide</h1>
          <p>
            Everything you need to know to pursue a career as a professional pilot:
            skills, responsibilities, training, and industry insights.
          </p>
        </header>

        <div className="guide-content">
          <p>
            A pilot’s role goes beyond flying an aircraft. They are responsible for the safety of passengers,
            crew, and cargo. Discipline, focus, and decision-making are crucial, along with excellent
            communication and leadership skills.
          </p>

        

          <p>
            Training includes flight school, simulator practice, and obtaining licenses such as the
            Commercial Pilot License (CPL) and Airline Transport Pilot License (ATP). Physical fitness,
            mental alertness, and understanding of aviation regulations are mandatory.
          </p>

          <p className="highlight-box">
            Safety is always the top priority. While hospitality and service matter, ensuring passengers’ safety
            is the fundamental responsibility of every pilot.
          </p>

          <h2>Career Opportunities</h2>
          <ul>
            <li>Commercial Airline Pilot – fly passengers for airlines</li>
            <li>Cargo & Logistics Pilot – transport goods efficiently and safely</li>
            <li>Private Jet / Charter Pilot – specialized flights for VIPs</li>
            <li>Airline Transport Pilot (ATP) – highest certification for professional pilots</li>
          </ul>

          <p>
            Effective communication is essential. Pilots must coordinate with air traffic control, work with
            cabin crew, and manage passengers calmly during emergencies. Leadership, teamwork, and
            situational awareness are key skills that separate good pilots from great pilots.
          </p>

          <p>
            Continuous learning is part of the job. Every flight provides new experiences, challenges, and
            opportunities to improve skills, ensuring that pilots maintain the highest standards of safety
            and service throughout their careers.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Pilots;
