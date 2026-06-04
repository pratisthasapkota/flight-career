import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import New from "../Components/New";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const navigate=useNavigate();
  const careers = [
    {
      img: "/pilot.png",
      title: "Pilot Careers",
      desc: "Take command of the skies with careers such as:",
      roles:
        "Commercial Pilot, Airline Transport Pilot, Cargo Pilot, and Private Jet Pilot.",
      btn: "Learn More",
      reverse: false,
      link:"pilots"
    },
    {
      img: "/air.png",
      title: "Air Hostess Careers",
      desc: "Experience the world with roles like:",
      roles:
        "Flight Attendant, Cabin Crew Trainer, and In-Flight Services Manager.",
      btn: "Explore",
      reverse: true,
      link:"hostess"
    },
    {
      img: "/trains.png",
      title: "Training & Courses",
      desc: "Begin your journey with training programs including:",
      roles:
        "PPL, CPL, Flight Attendant Training, and Cabin Crew Certification.",
      btn: "Join Now",
      reverse: false,
      link:"training"
    },
    {
      img: "/save.jpeg",
      title: "Aircraft Maintenance",
      desc: "Keep the fleet safe with roles such as:",
      roles:
        "Aircraft Mechanic, Avionics Technician, and Maintenance Supervisor.",
      btn: "Discover",
      reverse: true,
      link:"craft"
    },
    {
      img: "/me.jpeg",
      title: "Operations & Management",
      desc: "Oversee aviation processes with careers in:",
      roles:
        "Flight Operations Manager, Airport Coordinator, and Safety Officer.",
      btn: "Learn More",
      reverse: false,
      link:"operation"
    },
  ];

  return (
    <>
      <Navbar />
      <style>{`
        .explore-page {
          font-family: 'Poppins', sans-serif;
          color: #1e1e1e;
          background-color: #f5f7fb;
          padding-bottom: 80px;
        }

        .explore-header {
          text-align: center;
          background: linear-gradient(to right, #002b5c, #00509e);
          color: white;
          padding: 100px 20px 120px;
          border-radius: 0 0 80px 80px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          margin-bottom: 60px;
        }

        .explore-header h1 {
          font-size: 3.2rem;
          font-weight: 700;
          margin-bottom: 15px;
          text-shadow: 0 3px 6px rgba(0,0,0,0.2);
        }

        .explore-header p {
          font-size: 1.2rem;
          opacity: 0.95;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .career-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 90px;
          margin-top: 60px;
        }

        .career-card {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 85%;
          max-width: 1100px;
          background: white;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 0.8s ease forwards;
        }

        .career-card.reverse {
          flex-direction: row-reverse;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .career-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .career-card img {
          width: 50%;
          height: 360px;
          object-fit: cover;
          transition: transform 0.4s ease;
          border-radius: 0 25px 25px 0;
        }

        .career-card.reverse img {
          border-radius: 25px 0 0 25px;
        }

        .career-card:hover img {
          transform: scale(1.05);
        }

        .career-content {
          padding: 45px;
          width: 50%;
        }

        .career-content h2 {
          font-size: 2rem;
          color: #003f7f;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .career-content p {
          font-size: 1rem;
          line-height: 1.8;
          color: #333;
          max-width: 90%;
        }

        .learn-btn {
          background: linear-gradient(to right, #00509e, #003f7f);
          color: white;
          border: none;
          margin-top: 25px;
          padding: 12px 30px;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,80,158,0.2);
        }

        .learn-btn:hover {
          background: linear-gradient(to right, #003f7f, #002b5c);
          transform: scale(1.07);
          box-shadow: 0 6px 18px rgba(0,43,92,0.3);
        }

        .info-section {
          width: 85%;
          max-width: 1100px;
          margin: 80px auto;
          padding: 45px 40px;
          background: #eef3fa;
          border-radius: 25px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .info-section h2 {
          font-size: 2rem;
          color: #003f7f;
          margin-bottom: 20px;
        }

        .info-section p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #333;
          max-width: 850px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .career-card, .career-card.reverse {
            flex-direction: column;
          }
          .career-card img, .career-content {
            width: 100%;
            border-radius: 0;
          }
          .career-content {
            padding: 30px;
            text-align: center;
          }
          .career-content h2 {
            font-size: 1.6rem;
          }
          .career-content p {
            font-size: 0.95rem;
          }
          .learn-btn {
            width: 100%;
          }
          .info-section {
            width: 90%;
            padding: 30px 20px;
          }
          .explore-header h1 {
            font-size: 2.3rem;
          }
          .explore-header p {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="explore-page">
        
        <header className="explore-header">
          <h1>Explore Opportunities</h1>
          <p>
            Discover your path in aviation — from sky-high pilot careers to elegant cabin crew journeys.
          </p>
        </header>

        
        <section className="career-section">
          {careers.map((career, index) => (
            <div
              className={`career-card ${career.reverse ? "reverse" : ""}`}
              key={index}
            >
              <img src={career.img} alt={career.title} />
              <div className="career-content">
                <h2>{career.title}</h2>
                <p>
                  {career.desc}
                  <strong> {career.roles}</strong>
                </p>
                <button onClick={() => navigate(`/${career.link}`)} className="learn-btn">{career.btn}</button>
              </div>
            </div>
          ))}
        </section>

       
        <section className="info-section">
          <h2>Why Choose Aviation?</h2>
          <p>
            Aviation is a world of endless opportunities — from exciting travel to high-paying technical roles.
            Whether you want to fly planes, serve passengers, or manage operations, the industry offers something
            for everyone. It’s a career path filled with adventure, growth, and global experiences.
          </p>
        </section>
      </div>

      <New />
      <Footer />
    </>
  );
};

export default Explore;
