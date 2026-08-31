import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Top from "../Components/Top";

import { useNavigate } from "react-router-dom";
import { FaCertificate, FaChalkboardTeacher, FaPlane, FaUsers, FaBookOpen } from "react-icons/fa";

const Colleges: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate("/apply");
  };

  return (
    <div className="colleges-container">
      <Navbar />

      <style>{`
        .colleges-container {
          font-family: 'Poppins', sans-serif;
          background: #f4f6fb;
          color: #001f3f;
        }

       
        .college-section {
          padding: 60px 80px;
          text-align: left;
        }

        .college-section h2 {
          font-size: 32px;
          margin-bottom: 15px;
          color: #001f3f;
          font-weight: 700;
        }

        .college-section p {
          max-width: 850px;
          font-size: 17px;
          line-height: 1.7;
          margin-bottom: 40px;
          color: #333;
        }

        .college-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #001f3f;
          color: white;
          border-radius: 14px;
          padding: 30px;
          margin-top: 25px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .college-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .college-text h3 {
          color: #ffcc00;
          font-size: 21px;
          margin-bottom: 12px;
        }

        .college-text ul {
          margin-left: 20px;
          line-height: 1.8;
          font-size: 15px;
          color: white;
        }

        .college-image img {
          width: 450px;
          height: 300px;
          object-fit: cover;
          border-radius: 10px;
          transition: transform 0.3s ease;
        }

        .college-image img:hover {
          transform: scale(1.05);
        }

        @media (max-width: 900px) {
          .college-card {
            flex-direction: column;
            text-align: center;
          }
          .college-image img {
            width: 100%;
            margin-top: 20px;
          }
          .college-section {
            padding: 40px 20px;
          }
        }

        .why-choose {
          background: linear-gradient(180deg, #e6f0ff 0%, #f7faff 100%);
          padding: 80px 40px;
          text-align: center;
          margin-top: 60px;
        }

        .why-choose h2 {
          font-size: 32px;
          font-weight: 700;
          color: #001f3f;
          margin-bottom: 50px;
          position: relative;
        }

        .why-choose h2::after {
          content: "";
          width: 80px;
          height: 4px;
          background: #ffcc00;
          display: block;
          margin: 10px auto 0;
          border-radius: 2px;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .why-card {
          background: #fff;
          border-radius: 14px;
          padding: 30px 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .why-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
        }

        .why-icon {
          font-size: 36px;
          color: #ffcc00;
          margin-bottom: 15px;
        }

        .why-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: #001f3f;
          margin-bottom: 10px;
        }

        .why-card p {
          font-size: 15px;
          color: #444;
          line-height: 1.6;
        }

        /* === CTA SECTION === */
        .cta-section {
          background: linear-gradient(135deg, #001f3f 0%, #003a70 100%);
          color: white;
          text-align: center;
          padding: 90px 20px;
          margin-top: 80px;
          border-top: 6px solid #ffcc00;
        }

        .cta-section h2 {
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .cta-section p {
          font-size: 17px;
          margin-bottom: 30px;
          color: #e0e0e0;
        }

        .cta-section button {
          background: #ffcc00;
          border: none;
          color: #001f3f;
          font-weight: 600;
          font-size: 16px;
          padding: 12px 32px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .cta-section button:hover {
          background: #ffd633;
          transform: scale(1.05);
        }
      `}</style>

      
      <div className="college-section">
        <h2>Partner Aviation Colleges & Academies</h2>
        <p>
          Explore a network of top-rated aviation institutes where you can begin or
          advance your career as a Pilot or Cabin Crew Member. Each college is vetted
          for global standards, experienced faculty, and world-class facilities.
        </p>

        <div className="college-card">
          <div className="college-text">
            <h3>SkyWings Flight Academy – Kathmandu, Nepal</h3>
            <ul>
              <li>DGCA- and EASA-approved curriculum</li>
              <li>Modern fleet of Cessna and Piper aircraft</li>
              <li>State-of-the-art full-motion flight simulators</li>
              <li>Average CPL completion: 14 months</li>
            </ul>
          </div>
          <div className="college-image">
            <img src="/pil.jpg" alt="Pilot Academy" />
          </div>
        </div>

        <div className="college-card">
          <div className="college-text">
            <h3>Blue Horizon Aviation – Bangalore, India</h3>
            <ul>
              <li>Integrated PPL + CPL program</li>
              <li>200+ international airline alumni</li>
              <li>On-campus accommodation and cafeteria</li>
            </ul>
          </div>
          <div className="college-image">
            <img src="/yuu.jpg" alt="Aviation College" />
          </div>
        </div>
      </div>

      <Top />

      
      <section className="why-choose">
        <h2>Why Choose Our Partner Colleges?</h2>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon"><FaCertificate /></div>
            <h3>Globally Recognized Certifications</h3>
            <p>Train under international aviation standards to gain licenses valid across multiple countries.</p>
          </div>

          <div className="why-card">
            <div className="why-icon"><FaChalkboardTeacher /></div>
            <h3>Experienced Instructors</h3>
            <p>Learn from certified professionals with years of airline and flight training experience.</p>
          </div>

          <div className="why-card">
            <div className="why-icon"><FaPlane /></div>
            <h3>Modern Aircraft & Simulators</h3>
            <p>Practice with advanced simulators and modern fleets to master real-world flying conditions.</p>
          </div>

          <div className="why-card">
            <div className="why-icon"><FaUsers /></div>
            <h3>Strong Alumni Network</h3>
            <p>Connect with graduates now working in top airlines worldwide and build your aviation network.</p>
          </div>

          <div className="why-card">
            <div className="why-icon"><FaBookOpen /></div>
            <h3>Comprehensive Training</h3>
            <p>Balanced programs combining in-depth theory, practical flying, and soft skills for success.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Begin Your Aviation Journey?</h2>
        <p>
          Apply today to join one of our partner academies and take your first step
          toward a rewarding aviation career.
        </p>
        <button onClick={handleClick}>Apply Now</button>
      </section>

      <Footer />
    </div>
  );
};

export default Colleges;
