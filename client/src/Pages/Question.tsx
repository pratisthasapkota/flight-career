import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Question: React.FC = () => {
  return (
    <>
      <style>{`
        body { font-family: Poppins, sans-serif; background: #f3f6ff; margin: 0; }

        .hero {
          background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url("https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=1300&q=80")
          center/cover no-repeat;
          padding: 150px 30px;
          text-align: center;
          color: white;
        }
        .hero h1 { font-size: 46px; margin-bottom: 15px; font-weight: 700; }
        .hero p { font-size: 20px; opacity: 0.9; }

        .box {
          max-width: 1150px;
          margin: 60px auto;
          background: white;
          padding: 45px;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }
        .question { margin-bottom: 45px; }
        .question h3 {
          font-size: 23px;
          color: #003b7a;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .question p {
          font-size: 17px;
          line-height: 1.65;
          margin-bottom: 8px;
        }
        .sample {
          background: #eef4ff;
          padding: 18px;
          border-radius: 10px;
          border-left: 5px solid #0057d8;
          font-size: 17px;
          line-height: 1.7;
          margin-top: 10px;
        }

        .cta {
          max-width: 1150px;
          margin: 70px auto 70px;
          background: linear-gradient(135deg, #00448f, #001e3c);
          padding: 55px;
          border-radius: 20px;
          color: white;
          text-align: center;
        }
        .cta h2 { font-size: 33px; margin-bottom: 15px; }
        .cta p { font-size: 19px; line-height: 1.7; opacity: 0.95; }
        .cta-btn {
          display: inline-block;
          margin-top: 25px;
          background: #ffb300;
          padding: 15px 36px;
          font-size: 19px;
          font-weight: 600;
          border-radius: 40px;
          color: #111;
          text-decoration: none;
          transition: 0.3s;
        }
        .cta-btn:hover { background: #ff9600; transform: scale(1.03); }

        @media (max-width: 880px) {
          .hero h1 { font-size: 36px; }
          .hero p { font-size: 17px; }
        }
      `}</style>

      <Navbar />

      <div className="hero">
        <h1>Cabin Crew Interview Questions & Sample Answers</h1>
        <p>Frequently asked questions in real airline interviews — with expert answers.</p>
      </div>

      <div className="box">
        <div className="question">
          <h3>1. Tell me about yourself.</h3>
          <p>
            Interviewers want confidence, personality and professionalism — not your life story.
            Focus on your background, passion and skills relevant to aviation.
          </p>
          <div className="sample">
            "My name is… I'm a confident communicator with a passion for customer service.
            I enjoy helping people and adapting to new environments. I stay calm under pressure,
            work well in a team, and I am excited to represent the airline professionally while
            ensuring passengers feel valued and safe."
          </div>
        </div>

        <div className="question">
          <h3>2. Why do you want to become a cabin crew?</h3>
          <p>
            The answer must include: passion, service mindset, teamwork and emotional stability.
          </p>
          <div className="sample">
            "I want to become a cabin crew because I enjoy serving people and creating positive
            travel experiences. I work well under pressure, communicate calmly in challenging
            situations and adapt quickly to new environments. I am motivated by teamwork and
            would be proud to represent the airline's values with professionalism and care."
          </div>
        </div>

        <div className="question">
          <h3>3. What is good customer service?</h3>
          <p>
            Airlines observe maturity, empathy and awareness of passenger expectations.
          </p>
          <div className="sample">
            "Good customer service means making every passenger feel respected, safe and cared for.
            It includes listening patiently, communicating clearly, solving issues calmly and maintaining
            professionalism even under stress. Small acts of kindness create memorable flying experiences."
          </div>
        </div>

        <div className="question">
          <h3>4. How do you handle an angry or difficult passenger?</h3>
          <p>
            Interviewers want to see calmness, teamwork and passenger safety awareness.
          </p>
          <div className="sample">
            "I would remain calm and polite, listen without interrupting and acknowledge their concern.
            I would apologize for the inconvenience and offer solutions within safety guidelines.
            If needed, I would involve the senior crew to ensure the situation is handled smoothly
            while staying professional throughout the interaction."
          </div>
        </div>

        <div className="question">
          <h3>5. What does teamwork mean to you?</h3>
          <div className="sample">
            "Teamwork means supporting each other to achieve a smooth and safe flight.
            Onboard situations change quickly, so helping colleagues, communicating clearly
            and remaining positive ensures the best experience for passengers and crew."
          </div>
        </div>

        <div className="question">
          <h3>6. Why should we hire you?</h3>
          <div className="sample">
            "You should hire me because I genuinely care about people, stay calm under pressure,
            communicate clearly and work well in a team. I am committed to representing the airline
            with professionalism, warmth and responsibility toward passengers' safety and comfort."
          </div>
        </div>

        <p style={{ fontSize: "18px", marginTop: "30px", fontWeight: 600 }}>
          🔜 More real airline interview questions are being added soon…
        </p>
      </div>

      <div className="cta">
        <h2>Want Complete Interview Preparation?</h2>
        <p>
          The <strong>Cabin Crew Interview Mastery Guide</strong> includes 100+ real interview
          questions, ideal answers, grooming rules, confidence training and role-play scripts
          used by real airlines.
        </p>

        <a href="/store" className="cta-btn">
          Get the Full Guide →
        </a>
      </div>

      <Footer />
    </>
  );
};

export default Question;
