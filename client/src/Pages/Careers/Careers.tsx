import React from "react";
import { Link } from "react-router-dom";

const Careers = () => {
  return (
    <>
      <style>{`
        .careers-page {
          font-family: 'Poppins', sans-serif;
          color: #1e1e1e;
        }

        .careers-hero {
          background: linear-gradient(135deg, #001a3d 0%, #003f7f 50%, #00509e 100%);
          text-align: center;
          padding: 100px 20px 120px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .careers-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 60%);
          animation: heroGlow 8s ease-in-out infinite;
        }

        @keyframes heroGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5%, 5%); }
        }

        .careers-hero h1 {
          position: relative;
          z-index: 2;
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 15px;
          animation: fadeInUp 0.7s ease forwards;
        }

        .careers-hero p {
          position: relative;
          z-index: 2;
          font-size: 1.15rem;
          max-width: 650px;
          margin: 0 auto 30px;
          line-height: 1.7;
          opacity: 0;
          animation: fadeInUp 0.7s ease 0.2s forwards;
        }

        .careers-hero .hero-btn {
          position: relative;
          z-index: 2;
          display: inline-block;
          background: #ffd700;
          color: #001a3d;
          padding: 14px 36px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255,215,0,0.3);
          opacity: 0;
          animation: fadeInUp 0.7s ease 0.4s forwards;
        }

        .careers-hero .hero-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 25px rgba(255,215,0,0.5);
        }

        .careers-intro {
          max-width: 1100px;
          margin: -40px auto 60px;
          padding: 50px 40px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          text-align: center;
          position: relative;
          z-index: 3;
          animation: scaleIn 0.6s ease 0.3s forwards;
          opacity: 0;
        }

        .careers-intro h2 {
          font-size: 1.8rem;
          color: #001a3d;
          margin-bottom: 15px;
        }

        .careers-intro p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #444;
          max-width: 800px;
          margin: 0 auto;
        }

        .careers-highlights {
          max-width: 1100px;
          margin: 0 auto 60px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .highlight-card {
          background: white;
          border-radius: 16px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-top: 4px solid #00509e;
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }

        .highlight-card:nth-child(1) { animation-delay: 0.2s; }
        .highlight-card:nth-child(2) { animation-delay: 0.35s; }
        .highlight-card:nth-child(3) { animation-delay: 0.5s; }

        .highlight-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          border-top-color: #ffd700;
        }

        .highlight-card .card-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
          transition: transform 0.3s ease;
        }

        .highlight-card:hover .card-icon {
          transform: scale(1.2) rotate(-5deg);
        }

        .highlight-card h3 {
          font-size: 1.3rem;
          color: #001a3d;
          margin-bottom: 12px;
        }

        .highlight-card p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
        }

        .careers-cta {
          background: linear-gradient(135deg, #002b5c, #00509e);
          text-align: center;
          padding: 80px 20px;
          color: white;
          margin-top: 40px;
          position: relative;
          overflow: hidden;
        }

        .careers-cta::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 60% 40%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: heroGlow 6s ease-in-out infinite reverse;
        }

        .careers-cta h2 {
          position: relative;
          font-size: 2rem;
          margin-bottom: 15px;
          animation: fadeInUp 0.6s ease forwards;
        }

        .careers-cta p {
          position: relative;
          font-size: 1.05rem;
          max-width: 600px;
          margin: 0 auto 30px;
          opacity: 0.9;
          line-height: 1.7;
          animation: fadeInUp 0.6s ease 0.15s forwards;
          opacity: 0;
        }

        .careers-cta .cta-btn {
          position: relative;
          display: inline-block;
          background: #ffd700;
          color: #001a3d;
          padding: 14px 36px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease 0.3s forwards;
          opacity: 0;
        }

        .careers-cta .cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 25px rgba(255,215,0,0.5);
        }

        @media (max-width: 768px) {
          .careers-hero { padding: 70px 20px 90px; }
          .careers-hero h1 { font-size: 2rem; }
          .careers-intro { padding: 30px 20px; margin: -30px 15px 40px; }
          .careers-highlights { padding: 0 15px; }
        }
      `}</style>

      <div className="careers-page">
        <div className="careers-hero">
          <h1>Build Your Aviation Career</h1>
          <p>
            Join the exciting world of aviation. Explore career opportunities, 
            connect with top airlines, and take the first step toward your dream job in the skies.
          </p>
          <Link to="/careers/vacancies" className="hero-btn">
            View Open Vacancies
          </Link>
        </div>

        <div className="careers-intro">
          <h2>Your Gateway to Aviation Excellence</h2>
          <p>
            Whether you dream of soaring through the clouds as a pilot, welcoming passengers 
            as cabin crew, or managing ground operations, our careers section provides all the 
            resources, guidance, and opportunities you need to succeed in the aviation industry.
          </p>
        </div>

        <div className="careers-highlights">
          <div className="highlight-card">
            <div className="card-icon">✈️</div>
            <h3>Why Work With Us</h3>
            <p>
              Discover the benefits of a career in aviation — from competitive salaries 
              to traveling the world.
            </p>
          </div>
          <div className="highlight-card">
            <div className="card-icon">🎯</div>
            <h3>What Can You Do</h3>
            <p>
              Explore the diverse range of roles available in the aviation industry 
              and find your perfect fit.
            </p>
          </div>
          <div className="highlight-card">
            <div className="card-icon">🎓</div>
            <h3>Student Corner</h3>
            <p>
              Access training resources, study materials, and tips to prepare for 
              your aviation career.
            </p>
          </div>
        </div>

        <div className="careers-cta">
          <h2>Ready to Take Off?</h2>
          <p>
            Browse our latest job vacancies and apply to top airlines worldwide. 
            Your dream career is just one click away.
          </p>
          <Link to="/careers/vacancies" className="cta-btn">
            Browse Vacancies
          </Link>
        </div>
      </div>
    </>
  );
};

export default Careers;
