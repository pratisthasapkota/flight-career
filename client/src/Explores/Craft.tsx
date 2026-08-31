import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Craft = (): JSX.Element => {
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
                      url("/save.jpeg") center/cover no-repeat;
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
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
          color: #333;
          font-size: 18px;
          line-height: 1.8;
        }

        .guide-content h2 {
          font-size: 28px;
          color: #003366;
          margin-top: 40px;
          margin-bottom: 20px;
        }

        .guide-content img {
          width: 100%;
          max-width: 800px;
          display: block;
          margin: 30px auto;
          border-radius: 12px;
        }

        .highlight-box {
          background: #f0f8ff;
          padding: 18px;
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
          <h1>Aircraft Maintenance Engineering (AME)</h1>
          <p>The backbone of aviation — ensuring every aircraft is safe, efficient, and ready to fly.</p>
        </header>

        <div className="guide-content">
          <p>
            Aircraft Maintenance Engineers, or AMEs, are responsible for inspecting, repairing, and maintaining aircraft to meet strict safety standards. 
            They play a crucial role in ensuring that every flight is safe, reliable, and compliant with regulatory authorities. Without skilled AMEs, no airline can operate efficiently or safely.
          </p>

          <p>
            The work of an AME involves understanding aircraft structures, systems, engines, and avionics. They troubleshoot problems, replace components, and perform preventive maintenance to avoid potential failures. 
            Roles in this field include Aircraft Maintenance Technician, Avionics Technician, Powerplant Engineer, Airframe Engineer, and Maintenance Control Supervisor. Each role is essential to the smooth functioning of aviation operations.
          </p>

          <p className="highlight-box">
            Important: Every task performed by an AME directly impacts passenger and crew safety. Precision, attention to detail, and adherence to safety protocols are non-negotiable.
          </p>

          <p>
            Skills required include strong analytical thinking, problem-solving abilities, knowledge of aviation safety regulations (EASA, FAA, CAAN), and the ability to work under pressure in shift-based environments. AMEs must also continuously update their knowledge due to evolving technology and safety standards in aviation.
          </p>

          <p>
            Career prospects in aircraft maintenance are promising. Entry-level engineers can earn around $30,000–$60,000 per year, while experienced AMEs may earn $80,000–$150,000+. Supervisory and managerial positions can exceed $160,000 annually. This field not only offers financial rewards but also a sense of responsibility and pride in safeguarding lives.
          </p>

          <p>
            For those looking to study further, some recommended books include "Aircraft Maintenance & Repair" by Michael Kroes, "Aviation Maintenance Technician: General" by Dale Crane, "Aircraft Systems" by David A. Lombardo, and the Jeppesen AMT Series covering General, Airframe, and Powerplant topics.
          </p>

          <p className="highlight-box">
            Aircraft maintenance is not merely a job — it is a duty. Every inspection, repair, and certification performed by you contributes to the safety and efficiency of aviation worldwide. Passion, dedication, and technical expertise define a successful AME.
          </p>

          <Link to="/explore" className="back-link">← Back to Explore</Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Craft;
