import React from "react";
import { Link } from "react-router-dom";

interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

const WhyWorkWithUs = () => {
  const benefits: Benefit[] = [
    { icon: "🌍", title: "Global Opportunities", desc: "Work with top airlines across the globe. Aviation opens doors to international careers and diverse cultures." },
    { icon: "💰", title: "Competitive Salaries", desc: "Aviation professionals enjoy some of the most competitive salary packages, benefits, and allowances in any industry." },
    { icon: "📈", title: "Career Growth", desc: "Fast-track your career with clear promotion paths, continuous training, and professional development programs." },
    { icon: "✈️", title: "Travel the World", desc: "See the world while you work. Aviation careers offer incredible travel opportunities and unique experiences." },
    { icon: "🤝", title: "Team Environment", desc: "Work alongside passionate professionals in a collaborative, dynamic, and supportive team environment." },
  ];

  return (
    <>
      <style>{`
        .why-page {
          font-family: 'Poppins', sans-serif;
          padding: 0;
        }

        .why-hero {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          text-align: center;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .why-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: heroGlow 8s ease-in-out infinite;
        }

        .why-hero h1 {
          position: relative;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          animation: fadeInUp 0.6s ease forwards;
        }

        .why-hero p {
          position: relative;
          font-size: 1.1rem;
          opacity: 0;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease 0.2s forwards;
        }

        .why-content {
          max-width: 1000px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 25px;
          padding: 30px;
          margin-bottom: 25px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          animation: fadeInLeft 0.6s ease forwards;
          border-left: 4px solid transparent;
        }

        .benefit-item:nth-child(1) { animation-delay: 0.1s; }
        .benefit-item:nth-child(2) { animation-delay: 0.2s; }
        .benefit-item:nth-child(3) { animation-delay: 0.3s; }
        .benefit-item:nth-child(4) { animation-delay: 0.4s; }
        .benefit-item:nth-child(5) { animation-delay: 0.5s; }

        .benefit-item:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
          border-left-color: #ffd700;
        }

        .benefit-icon {
          font-size: 2rem;
          min-width: 50px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .benefit-item:hover .benefit-icon {
          transform: scale(1.2);
        }

        .benefit-text h3 {
          font-size: 1.2rem;
          color: #001a3d;
          margin-bottom: 8px;
        }

        .benefit-text p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
        }

        .why-cta {
          text-align: center;
          margin: 40px auto 60px;
          opacity: 0;
          animation: fadeInUp 0.6s ease 0.6s forwards;
        }

        .why-cta a {
          display: inline-block;
          background: #00509e;
          color: white;
          padding: 14px 32px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .why-cta a:hover {
          background: #003f7f;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,80,158,0.3);
        }

        @media (max-width: 768px) {
          .why-hero h1 { font-size: 1.8rem; }
          .benefit-item { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="why-page">
        <div className="why-hero">
          <h1>Why Work With Us</h1>
          <p>Discover the unmatched benefits of building your career in aviation with AeroCareers.</p>
        </div>

        <div className="why-content">
          {benefits.map((b: Benefit, i: number) => (
            <div className="benefit-item" key={i}>
              <div className="benefit-icon">{b.icon}</div>
              <div className="benefit-text">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="why-cta">
          <Link to="/careers/vacancies">View Open Positions</Link>
        </div>
      </div>
    </>
  );
};

export default WhyWorkWithUs;
