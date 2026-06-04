import React from "react";
import { useNavigate } from "react-router-dom";


const New = () => {
  const navigate=useNavigate();
  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 0;
        }

        .hero {
          background: linear-gradient(135deg, #003366, #0078ff);
          color: white;
          text-align: center;
          padding: 80px 20px;
        }
        .hero h1 {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .hero p {
          font-size: 18px;
          color: #e0e0e0;
        }

        .section {
          max-width: 1200px;
          margin: 60px auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
          padding: 50px;
          display:flex;
          flex-direction:column;
        }

        .section h2 {
          color: #002b5b;
          margin-bottom: 25px;
          text-align:center;         
          font-size: 28px;

        }

        

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .card {
          background: #f0f4ff;
          border-radius: 12px;
          padding: 20px;
          transition: 0.3s;
          text-align: center;
          overflow: hidden;
        }
        .card:hover {
          background: #e1ebff;
          transform: translateY(-5px);
        }
        .card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 15px;
        }
          transition: 0.3s;
          text-align: center;
          overflow: hidden;
        }
        .card:hover {
          background: #e1ebff;
          transform: translateY(-5px);
        }
        .card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 15px;
        }
        .card h3 {
          color: #003366;
          font-size: 20px;
          margin-bottom: 10px;
        }
        .card p {
          font-size: 15px;
          color: #333;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }
        ul li {
          padding: 8px 0;
          font-size: 16px;
          color: #333;
        }

        .cta {
          text-align: center;
          background: #003366;
          color: white;
          padding: 60px 20px;
          margin-top: 60px;
          border-radius: 15px;
        }
        .cta h3 {
          font-size: 28px;
          margin-bottom: 15px;
        }
        .cta button {
          background: #ff5252;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
        }
        .cta button:hover {
          background: #ff3333;
        }
      `}</style>
      
     

   
      <div className="section">
        <h2>Scholarships & Financial Aid</h2>
        <div className="grid">
          <div className="card">
            <img src="https://images.unsplash.com/photo-1558021211-6d1403321394" alt="Scholarship" />
            <h3>AeroAchievers Grant</h3>
            <p>Up to 30% tuition assistance for top-performing aviation students across partner institutions.</p>
          </div>
          <div className="card">
            <img src="/women.jpg" alt="Women in Aviation" />
            <h3>Women in Aviation</h3>
            <p>Empowering aspiring female pilots and crew members with dedicated scholarships and mentorship.</p>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b" alt="Merit Based Aid" />
            <h3>Merit-Based Assistance</h3>
            <p>Financial aid for students showing exceptional academic and practical performance.</p>
          </div>
        </div>
      </div>

     
      <div className="section">
        <h2>Study Materials & E-Library</h2>
        <div className="grid">
          <div className="card">
            <img src="https://images.unsplash.com/photo-1581090700227-1e37b190418e" alt="Pilot Study" />
            <h3>Pilot Theory Notes</h3>
            <p>Access comprehensive notes on Aerodynamics, Meteorology, and Navigation with mock tests.</p>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d" alt="Cabin Crew" />
            <h3>Cabin Crew Handbooks</h3>
            <p>Professional service manuals, safety protocols, and etiquette guides.</p>
          </div>
          <div className="card">
            <img src="/ama.jpeg" alt="AME Notes" />
            <h3>AME Technical Booklets</h3>
            <p>DGCA-approved practice questions and aircraft system maintenance notes.</p>
          </div>
        </div>
      </div>

      {/* CERTIFICATION SECTION */}
      <div className="section">
        <h2>Exams & Certifications</h2>
        <div className="grid">
          <div className="card">
            <img src="/you.jpg" alt="DGCA" />
            <h3>DGCA License Prep</h3>
            <p>Get ready for DGCA CPL/PPL exams with syllabus outlines and question banks.</p>
          </div>
          <div className="card">
            <img src="/cate.jpg" alt="IATA" />
            <h3>IATA Certification</h3>
            <p>Enhance your travel and tourism career with globally recognized IATA training.</p>
          </div>
          <div className="card">
            <img src="/civil.jpeg" alt="ICAO" />
            <h3>ICAO Safety Standards</h3>
            <p>Learn aviation safety, communication, and compliance for international operations.</p>
          </div>
        </div>
      </div>

      
      <div className="section">
        <h2>Career Mentorship & Guidance</h2>
        <div className="grid">
          <div className="card">
            <img src="/mentor.jpeg" alt="Mentorship" />
            <h3>1:1 Mentorship</h3>
            <p>Book private sessions with industry experts, pilots, and airline professionals.</p>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d" alt="Interview Prep" />
            <h3>Interview Preparation</h3>
            <p>Guided mock interviews and CV reviews to boost your confidence and clarity.</p>
          </div>
          <div className="card">
            <img src="/road.jpeg" alt="Career Path" />
            <h3>Career Roadmaps</h3>
            <p>Step-by-step charts showing pilot, crew, and AME growth trajectories.</p>
          </div>
        </div>
      </div>

     

    
      <div className="cta">
        <h3>Need Help Getting Started?</h3>
        <p>Connect with our student advisors for personalized aviation guidance.</p>
        <button onClick={() => navigate(`/contact`)}>Contact Career Support</button>
      </div>
     
    </>
  );
};

export default New;
