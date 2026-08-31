import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

const Tips: React.FC = () => {
  return (
    <>
      <style>{`
        body { background: #f3f6ff; font-family: Poppins; }

        .hero {
          background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80")
          center/cover no-repeat;
          text-align: center;
          padding: 150px 25px;
          color: white;
        }
        .hero h1 { font-size: 46px; font-weight: 700; margin-bottom: 15px; }
        .hero p { font-size: 20px; opacity: 0.92; }

        .tips-container {
          max-width: 1150px;
          margin: 60px auto;
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .tip { margin-bottom: 35px; }
        .tip h3 {
          font-size: 23px;
          font-weight: 600;
          color: #003b7a;
          margin-bottom: 12px;
        }
        .tip p { font-size: 17px; line-height: 1.65; }

        .highlight-box {
          background: #eef4ff;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
          font-size: 17px;
          border-left: 5px solid #0057d8;
        }

        .check-section { margin-top: 45px; }
        .check-title { font-size: 25px; color: #002f5d; font-weight: 700; }
        .check-list li {
          font-size: 17px;
          margin-bottom: 9px;
          line-height: 1.6;
        }

        .cta {
          max-width: 1150px;
          margin: 70px auto 70px;
          padding: 50px;
          background: linear-gradient(135deg, #00448f, #001e3c);
          border-radius: 18px;
          color: white;
        }
        .cta h2 { font-size: 30px; margin-bottom: 14px; font-weight: 700; }
        .cta p { font-size: 18px; line-height: 1.65; }

        .cta-btn {
          display: inline-block;
          margin-top: 25px;
          background: #ffb300;
          padding: 15px 34px;
          font-size: 19px;
          font-weight: 600;
          color: #111;
          border-radius: 40px;
          text-decoration: none;
          transition: 0.3s;
        }
        .cta-btn:hover { background: #ff9d00; transform: scale(1.03); }

        @media (max-width: 880px) {
          .hero h1 { font-size: 36px; }
          .hero p { font-size: 18px; }
        }
      `}</style>

      <Navbar />

      <div className="hero">
        <h1>Cabin Crew Interview Tips</h1>
        <p>Professional guidance to help you pass the interview on your first attempt.</p>
      </div>

      <div className="tips-container">
        <div className="tip">
          <h3>1. First Impression Matters</h3>
          <p>
            Your appearance and body language create your reputation before you even speak.
            Maintain a warm smile, walk confidently, greet politely, and stay calm.
          </p>
          <div className="highlight-box">
             Interviewers decide 70% of your impression within the first 10 seconds.
          </div>
        </div>

        <div className="tip">
          <h3>2. Speak Confidently</h3>
          <p>
            Use a clear tone, maintain natural speed, and keep your sentences short.
            Avoid fillers like "umm", "ahh", "like", "you know".
          </p>
          <p style={{ marginTop: "8px" }}>
            Practice your introduction daily in front of a mirror or camera.
          </p>
        </div>

        <div className="tip">
          <h3>3. Maintain Eye Contact</h3>
          <p>
            Eye contact shows confidence and honesty. Do not stare — look natural,
            calm, and friendly while answering.
          </p>
        </div>

        <div className="tip">
          <h3>4. Master Situational Questions</h3>
          <p>
            Cabin crew interviews include real-life situations such as handling a rude
            passenger, medical emergency, crying baby, or seat dispute.
          </p>
          <p>
            Use the <strong>STAR Method:</strong> Situation – Task – Action – Result
            to structure your answers in a professional way.
          </p>
        </div>

        <div className="tip">
          <h3>5. Know About the Airline</h3>
          <p>
            Research the airline before the interview. Learn about its destinations,
            aircraft type, slogan, awards, CEO, and customer service values.
          </p>
        </div>

        <div className="tip">
          <h3>6. Smile and Stay Positive — Even if You Make Mistakes</h3>
          <p>
            Interviewers observe emotional stability — not perfection.
            A calm and positive attitude is more valuable than a perfect answer.
          </p>
        </div>

        <div className="check-section">
          <h2 className="check-title"> Mini Checklist Before Interview</h2>
          <ul className="check-list">
            <li>Neat grooming and fresh appearance</li>
            <li>Formal and well-fitting outfit</li>
            <li>Soft makeup and minimal accessories (if applicable)</li>
            <li>Updated CV in a professional folder</li>
            <li>Comfortable formal shoes</li>
            <li>Printed passport copy (if available)</li>
            <li>Practice introduction & "Why should we hire you?"</li>
          </ul>
        </div>
      </div>

      <div className="cta">
        <h2>Want Complete Interview Preparation?</h2>
        <p>
          Our <strong>Cabin Crew Interview Mastery Guide</strong> includes grooming rules,
          communication techniques, sample interview answers, confidence training,
          and real questions asked by international airlines.
        </p>

        <Link to="/store" className="cta-btn">
          Get the Full Guide →
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default Tips;
