import React from "react";
import { Link } from "react-router-dom";

const StudentCorner = () => {
  const trainingResources = [
    { title: "Interview Preparation", desc: "Master common aviation interview questions and presentation techniques.", link: "/question", linkText: "View Q&A →" },
    { title: "Interview Tips", desc: "Expert tips to help you ace your cabin crew or pilot interview.", link: "/tips", linkText: "Read Tips →" },
    { title: "Training Programs", desc: "Explore our comprehensive training courses for various aviation roles.", link: "/training", linkText: "Browse Courses →" },
  ];

  const careerGuides = [
    { title: "Pilot Career Path", desc: "Complete guide to becoming a commercial pilot — from PPL to ATPL.", link: "/pilots", linkText: "Explore →" },
    { title: "Cabin Crew Guide", desc: "Everything you need to know about starting your cabin crew career.", link: "/hostess", linkText: "Learn More →" },
    { title: "Maintenance Careers", desc: "Explore Aircraft Maintenance Engineering opportunities and certifications.", link: "/craft", linkText: "Discover →" },
  ];

  return (
    <>
      <style>{`
        .student-page {
          font-family: 'Poppins', sans-serif;
        }

        .student-hero {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          text-align: center;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .student-hero::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 40% 60%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: heroGlow 8s ease-in-out infinite;
        }

        .student-hero h1 {
          position: relative;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          animation: fadeInUp 0.6s ease forwards;
        }

        .student-hero p {
          position: relative;
          font-size: 1.1rem;
          opacity: 0;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease 0.2s forwards;
        }

        .student-content {
          max-width: 1000px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .resource-section {
          margin-bottom: 50px;
        }

        .resource-section h2 {
          font-size: 1.6rem;
          color: #001a3d;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 3px solid #ffd700;
          display: inline-block;
          animation: fadeInLeft 0.5s ease forwards;
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .resource-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
          border-top: 3px solid transparent;
        }

        .resource-card:nth-child(1) { animation-delay: 0.15s; }
        .resource-card:nth-child(2) { animation-delay: 0.3s; }
        .resource-card:nth-child(3) { animation-delay: 0.45s; }

        .resource-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          border-top-color: #00509e;
        }

        .resource-card h3 {
          font-size: 1.1rem;
          color: #001a3d;
          margin-bottom: 10px;
        }

        .resource-card p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #555;
          margin-bottom: 12px;
        }

        .resource-card a {
          color: #00509e;
          font-weight: 600;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .resource-card:hover a {
          color: #ffd700;
          transform: translateX(4px);
        }

        .tips-box {
          background: #f0f6ff;
          border-left: 4px solid #00509e;
          padding: 25px 30px;
          border-radius: 0 12px 12px 0;
          margin-top: 30px;
          animation: fadeInUp 0.6s ease 0.5s forwards;
          opacity: 0;
        }

        .tips-box h3 {
          color: #001a3d;
          margin-bottom: 10px;
        }

        .tips-box ul {
          padding-left: 20px;
          line-height: 2;
          color: #444;
        }

        .tips-box li {
          transition: color 0.2s;
        }

        .tips-box li:hover {
          color: #00509e;
        }

        @media (max-width: 768px) {
          .student-hero h1 { font-size: 1.8rem; }
          .resource-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="student-page">
        <div className="student-hero">
          <h1>Student Corner</h1>
          <p>Everything you need to prepare for your aviation career — resources, tips, and guidance.</p>
        </div>

        <div className="student-content">
          <div className="resource-section">
            <h2>Training Resources</h2>
            <div className="resource-grid">
              {trainingResources.map((r, i) => (
                <div className="resource-card" key={i}>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                  <Link to={r.link}>{r.linkText}</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="resource-section">
            <h2>Career Guides</h2>
            <div className="resource-grid">
              {careerGuides.map((r, i) => (
                <div className="resource-card" key={i}>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                  <Link to={r.link}>{r.linkText}</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="tips-box">
            <h3>Quick Tips for Students</h3>
            <ul>
              <li>Start building your communication skills early</li>
              <li>Maintain a professional appearance and grooming standard</li>
              <li>Get your medical certificates ready</li>
              <li>Network with aviation professionals on LinkedIn</li>
              <li>Stay updated with aviation news and industry trends</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCorner;
