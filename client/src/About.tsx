import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

interface Stat {
  number: string;
  label: string;
}

interface Value {
  icon: string;
  title: string;
  desc: string;
}

interface Program {
  title: string;
  desc: string;
  icon: string;
}

const stats: Stat[] = [
  { number: "500+", label: "Students Trained" },
  { number: "50+", label: "Partner Airlines" },
  { number: "95%", label: "Placement Rate" },
  { number: "10+", label: "Years Experience" },
];

const values: Value[] = [
  {
    icon: "🎯",
    title: "Excellence",
    desc: "We maintain the highest standards in aviation training, ensuring every student is industry-ready.",
  },
  {
    icon: "🌍",
    title: "Global Reach",
    desc: "Our partnerships span across continents, opening doors to international career opportunities.",
  },
  {
    icon: "🤝",
    title: "Personal Mentorship",
    desc: "Every student receives one-on-one guidance from seasoned aviation professionals.",
  },
  {
    icon: "📈",
    title: "Career Growth",
    desc: "From entry-level to leadership roles, we map out a clear path for your professional ascent.",
  },
];

const programs: Program[] = [
  {
    title: "Pilot Training",
    desc: "Comprehensive ground school and flight hours covering everything from basic aerodynamics to advanced cockpit procedures. Graduate with a CPL or ATPL ready to command the skies.",
    icon: "✈️",
  },
  {
    title: "Cabin Crew Academy",
    desc: "Master grooming standards, safety protocols, passenger service, and in-flight communication. Build the confidence to deliver world-class hospitality at 35,000 feet.",
    icon: "👩‍✈️",
  },
  {
    title: "Aviation Operations",
    desc: "Learn the business side of aviation — airport management, airline logistics, ground handling, and regulatory compliance that keep the industry running smoothly.",
    icon: "🏢",
  },
  {
    title: "Career Counseling",
    desc: "One-on-one sessions with career advisors who understand the aviation industry inside out. Get personalized roadmaps tailored to your goals and aptitude.",
    icon: "🧭",
  },
];

function About() {
  return (
    <div>
      <Navbar />

      {/* Hero Header */}
      <div className="page-header animate-fadeInDown">
        <span style={{
          display: "inline-block",
          background: "rgba(255,215,0,0.12)",
          color: "#ffd700",
          padding: "6px 18px",
          borderRadius: "50px",
          fontSize: "13px",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "18px",
          border: "1px solid rgba(255,215,0,0.2)",
        }}>
          Our Story
        </span>
        <h1>About Us</h1>
        <p>
          Empowering the next generation of aviation professionals with
          world-class training, mentorship, and global career opportunities.
        </p>
      </div>

      <div className="page-container">
        {/* Intro Section */}
        <div className="page-section animate-fadeInUp" style={{ marginBottom: "60px" }}>
          <img
            src="/tuu.jpg"
            alt="aviation career"
            className="page-img"
          />
          <div className="page-content">
            <h2>Who We Are</h2>
            <p>
              We are a leading aviation training institute dedicated to shaping
              careers in the skies. Whether you dream of becoming a pilot,
              cabin crew member, or aviation operations professional, we
              provide the knowledge, skills, and industry connections to turn
              that dream into reality.
            </p>
            <p style={{ marginTop: "14px" }}>
              Founded by aviation veterans with decades of combined experience,
              our institute bridges the gap between ambition and achievement.
              We don't just train — we transform aspiring aviators into
              industry-ready professionals.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            width: "80%",
            maxWidth: "1100px",
            margin: "0 auto 60px",
          }}
        >
          {stats.map((stat: Stat, i: number) => (
            <div
              key={i}
              className={`animate-scaleIn stagger-${i + 1}`}
              style={{
                textAlign: "center",
                background: "linear-gradient(135deg, #002b5c, #00509e)",
                color: "white",
                padding: "30px 15px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,43,92,0.3)",
              }}
            >
              <div style={{ fontSize: "2.2rem", fontWeight: "700" }}>{stat.number}</div>
              <div style={{ fontSize: "0.95rem", marginTop: "6px", opacity: "0.9" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Aviation - reversed layout */}
        <div
          className="page-section animate-fadeInLeft"
          style={{ marginBottom: "60px" }}
        >
          <div className="page-content">
            <h2>Why Choose Aviation?</h2>
            <p>
              A career in aviation is unlike any other. It offers a unique blend
              of adventure, professionalism, and reward that few industries can
              match.
            </p>
            <ul style={{ marginTop: "15px", lineHeight: "2" }}>
              <li><strong>Global Opportunities</strong> — Work with top airlines across every continent.</li>
              <li><strong>Exciting Lifestyle</strong> — Travel the world and experience diverse cultures.</li>
              <li><strong>Career Stability</strong> — The aviation industry offers long-term job security.</li>
              <li><strong>Competitive Pay</strong> — Enjoy attractive salaries, bonuses, and travel perks.</li>
              <li><strong>Professional Growth</strong> — Clear career progression from cadet to captain.</li>
            </ul>
          </div>
          <img
            src="/photo.jpg"
            alt="aviation lifestyle"
            className="page-img"
          />
        </div>

        {/* Programs Section */}
        <div style={{ width: "80%", maxWidth: "1100px", margin: "0 auto 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              className="animate-fadeInUp"
              style={{ color: "#003f7f", fontSize: "2rem" }}
            >
              Our Programs
            </h2>
            <p className="animate-fadeInUp stagger-1" style={{ color: "#666", maxWidth: "600px", margin: "10px auto 0" }}>
              Comprehensive training programs designed to prepare you for every
              aspect of a successful aviation career.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "25px",
            }}
          >
            {programs.map((prog: Program, i: number) => (
              <div
                key={i}
                className={`animate-fadeInUp stagger-${i + 2}`}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "30px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  borderLeft: "4px solid #00509e",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{prog.icon}</div>
                <h3 style={{ color: "#003f7f", marginBottom: "10px" }}>{prog.title}</h3>
                <p style={{ color: "#555", lineHeight: "1.7", margin: 0 }}>{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div
          className="page-section animate-fadeInRight"
          style={{ marginBottom: "60px" }}
        >
          <img
            src="/miss.jpg"
            alt="our mission"
            className="page-img"
          />
          <div className="page-content">
            <h2>Our Mission</h2>
            <p>
              To empower aspiring aviators with world-class education,
              personalized mentorship, and global opportunities that build
              successful and fulfilling aviation careers.
            </p>
            <h2 style={{ marginTop: "30px" }}>Our Vision</h2>
            <p>
              To become the most trusted aviation training institute in the
              region — recognized for producing industry-ready professionals
              who uphold the highest standards of safety, service, and
              excellence in aviation.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div style={{ width: "80%", maxWidth: "1100px", margin: "0 auto 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              className="animate-fadeInUp"
              style={{ color: "#003f7f", fontSize: "2rem" }}
            >
              What We Stand For
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {values.map((val: Value, i: number) => (
              <div
                key={i}
                className={`animate-fadeInUp stagger-${i + 2}`}
                style={{
                  textAlign: "center",
                  padding: "30px 20px",
                  borderRadius: "16px",
                  background: "#f5f7fb",
                  transition: "transform 0.3s",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{val.icon}</div>
                <h4 style={{ color: "#003f7f", marginBottom: "8px" }}>{val.title}</h4>
                <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="animate-scaleIn"
          style={{
            textAlign: "center",
            padding: "60px 30px",
            margin: "0 auto 40px",
            width: "80%",
            maxWidth: "800px",
            background: "linear-gradient(135deg, #002b5c, #00509e)",
            borderRadius: "20px",
            color: "white",
            boxShadow: "0 8px 30px rgba(0,43,92,0.35)",
          }}
        >
          <img
            src="/ss.png"
            alt="logo"
            style={{
              width: "120px",
              borderRadius: "50%",
              marginBottom: "20px",
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          />
          <h2 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>
            Start Your Aviation Journey Today
          </h2>
          <p style={{ maxWidth: "550px", margin: "0 auto 25px", opacity: "0.9", lineHeight: "1.7" }}>
            Your dream career is just one step away. Whether you want to command
            an aircraft or deliver world-class passenger experiences, we are
            here to guide you from the first step to the final destination.
          </p>
          <a
            href="/apply"
            className="back-btn"
            style={{
              background: "white",
              color: "#002b5c",
              fontWeight: "600",
              padding: "14px 35px",
              fontSize: "1rem",
            }}
          >
            Apply Now
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
