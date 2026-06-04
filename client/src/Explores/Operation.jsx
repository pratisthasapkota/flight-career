import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Operation = () => {
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
                      url("/me.jpeg") center/cover no-repeat;
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
          <h1>Operations & Management Careers</h1>
          <p>
            Behind every safe and smooth flight are skilled professionals managing airline operations,
            ensuring efficiency, safety, and passenger satisfaction.
          </p>
        </header>

        <div className="guide-content">
          <p>
            Operations & Management professionals play a vital role in the aviation industry. They coordinate
            between different departments, monitor airline procedures, and ensure every flight runs efficiently.
            From airport logistics to onboard services, operations managers are the backbone of airline success.
          </p>

       

          <p className="highlight-box">
            Key responsibility: Maintaining operational safety and efficiency. Professionals in this field 
            continuously monitor processes, implement safety protocols, and coordinate with staff to 
            ensure smooth airline functioning.
          </p>

          <h2>Career Opportunities</h2>
          <ul>
            <li>Flight Operations Manager – oversee daily flight planning and execution</li>
            <li>Airport Coordinator – manage ground operations, logistics, and passenger services</li>
            <li>Safety Officer – ensure compliance with safety regulations and emergency preparedness</li>
          </ul>

          <p>
            Strong organizational skills, leadership, and problem-solving abilities are essential for 
            a career in aviation operations. Professionals must be calm under pressure, adaptable, 
            and proactive in managing complex aviation processes.
          </p>

          <p>
            Operations & Management roles offer opportunities for career growth, international exposure, 
            and being part of an exciting and dynamic industry that never sleeps.
          </p>

          <Link to="/explore" className="back-link">← Back to Explore</Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Operation;
