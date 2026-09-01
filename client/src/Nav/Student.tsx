import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Content from "../Pages/Content";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import "./Student.css";
import axios from "axios";

interface Stat {
  number: string;
  label: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const Student: React.FC = () => {
  const navigate = useNavigate();

  const [notifyEmail, setNotifyEmail] = useState<string>("");
  const [notifyMessage, setNotifyMessage] = useState<string>("");

  const handleNotify = async (): Promise<void> => {
    if (!notifyEmail) {
      setNotifyMessage("Please enter your email first.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/notify`, {
        email: notifyEmail,
      });

      setNotifyMessage("You will be notified soon!");
      setNotifyEmail("");

    } catch (error) {
      console.log(error);
      setNotifyMessage("Something went wrong. Try again.");
    }
  };

  const stats: Stat[] = [
    { number: "2,500+", label: "Students Placed" },
    { number: "50+", label: "Airlines Hiring" },
    { number: "95%", label: "Success Rate" },
    { number: "10+", label: "Years Experience" },
  ];

  const whyChooseUs: Feature[] = [
    {
      icon: "✈️",
      title: "Industry Expert Trainers",
      description: "Learn from professionals who have worked with top international airlines and know exactly what recruiters look for.",
    },
    {
      icon: "📋",
      title: "Proven Interview Framework",
      description: "Our structured approach has helped thousands of candidates pass their cabin crew interviews on the first attempt.",
    },
    {
      icon: "🎯",
      title: "Personalized Coaching",
      description: "Get tailored feedback and guidance based on your strengths and areas for improvement.",
    },
    {
      icon: "🌍",
      title: "Global Airline Network",
      description: "Access opportunities with over 50 airlines worldwide, from budget carriers to premium luxury brands.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="hero">
        <div className="hero-content">
          <span className="hero-badge">Aviation Career Platform</span>
          <h1>Your Gateway to a <span className="highlight">Sky-High</span> Aviation Career</h1>
          <p>Access expert interview tips, career resources, and complete preparation tools to land your dream job in aviation.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/explore")}>Explore Opportunities</button>
            <button className="btn-secondary" onClick={() => navigate("/jobs")}>Browse Jobs</button>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          {stats.map((stat: Stat, index: number) => (
            <div className="stat-item" key={index}>
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="why-choose-section">
        <div className="why-choose-container">
          <span className="section-badge">Why AeroCareers</span>
          <h2 className="section-title">Why Students Choose Us</h2>
          <p className="section-subtitle">We provide everything you need to succeed in your aviation career journey</p>
          <div className="features-grid">
            {whyChooseUs.map((feature: Feature, index: number) => (
              <div className="feature-card" key={index}>
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <h2 className="help-section-title">Here's how I can help you:</h2>

      <div className="help-section">
        <div className="email-section">
          <h3>Never Miss an Airline Opportunity</h3>
          <p>Stay updated with the latest airline job openings and exclusive preparation resources.</p>

          <div className="email-signup">
            <input
              type="email"
              className="email-input"
              placeholder="Enter your email"
              value={notifyEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifyEmail(e.target.value)}
            />
            <button className="notify-btn" onClick={handleNotify}>
              Notify Me
            </button>
          </div>

          {notifyMessage && (
            <p style={{ color: "green", marginTop: "10px", fontWeight: "500" }}>
              {notifyMessage}
            </p>
          )}
        </div>
      </div>

      <div className="help-card">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" alt="Book" />
        <div className="help-content">
          <span className="card-badge">Featured</span>
          <h3>Stand Out From The Crowd</h3>
          <p>Learn what recruiters look for and discover the secrets to making a lasting impression in your cabin crew interview.</p>
          <button onClick={() => navigate("/finals")}>See More</button>
        </div>
      </div>

      <div className="help-card reverse">
        <img src="/ship.jpg" alt="Questions" />
        <div className="help-content">
          <span className="card-badge">Premium</span>
          <h3>How to Pass the Cabin Crew Interview 100%</h3>
          <p>Get access to the most comprehensive course with real interview questions and expert-approved answers.</p>
          <button onClick={() => navigate("/final")}>Get Course</button>
        </div>
      </div>

      <div className="help-card">
        <img src="/int.jpg" alt="Questions" />
        <div className="help-content">
          <span className="card-badge">Popular</span>
          <h3>Interview Questions & Answers</h3>
          <p>Access the latest and most frequently asked questions with detailed, expert-crafted answers.</p>
          <button onClick={() => navigate("/question")}>See More</button>
        </div>
      </div>

      <div className="help-card reverse">
        <img src="/tips.jpeg" alt="Book" />
        <div className="help-content">
          <span className="card-badge">Essential</span>
          <h3>Cabin Crew Interview Tips</h3>
          <p>Learn how to present yourself confidently and ace every stage of the selection process.</p>
          <button onClick={() => navigate("/tips")}>Get Tips</button>
        </div>
      </div>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Start Your Aviation Journey?</h2>
          <p>Join thousands of successful cabin crew members who started their journey right here.</p>
          <div className="cta-buttons">
            <button className="cta-btn-primary" onClick={() => navigate("/login")}>Get Started Free</button>
            <button className="cta-btn-secondary" onClick={() => navigate("/about")}>Learn More</button>
          </div>
        </div>
      </section>

      <Content />
      <Footer />
    </>
  );
};

export default Student;
