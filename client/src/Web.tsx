import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function Web() {
  return (
    <>
      <Navbar />
      <style>{`
        .web-page {
          font-family: 'Poppins', sans-serif;
          background: #f5f7fb;
          min-height: 80vh;
          color: #1e1e1e;
        }
        .web-hero {
          text-align: center;
          background: linear-gradient(to right, #002b5c, #00509e);
          color: white;
          padding: 80px 20px;
          border-radius: 0 0 60px 60px;
        }
        .web-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .web-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 700px;
          margin: 0 auto;
        }
        .web-section {
          width: 90%;
          max-width: 1100px;
          margin: 60px auto;
          background: white;
          padding: 45px;
          border-radius: 20px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
          line-height: 1.8;
        }
        .web-section h2 {
          color: #003f7f;
          font-size: 1.6rem;
          margin-bottom: 15px;
        }
        .web-section ul {
          padding-left: 20px;
        }
        .web-cta {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 28px;
          background: linear-gradient(to right, #00509e, #003f7f);
          color: white;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 500;
          transition: transform 0.3s ease;
        }
        .web-cta:hover {
          transform: scale(1.05);
        }
      `}</style>

      <div className="web-page">
        <header className="web-hero">
          <h1>About This Platform</h1>
          <p>
            AeroCareers brings aviation career guidance, training resources,
            job vacancies, and professional aviation gear together in one place.
          </p>
        </header>

        <section className="web-section">
          <h2>What you can do here</h2>
          <ul>
            <li>Explore training pathways for cabin crew, pilots, and ground staff.</li>
            <li>Browse and apply to real aviation vacancies from around the world.</li>
            <li>Prepare for interviews with our question bank and tips guides.</li>
            <li>Shop professional aviation uniforms and accessories in our store.</li>
            <li>Connect with us through the contact form or newsletter.</li>
          </ul>
          <Link to="/explore" className="web-cta">Start Exploring →</Link>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Web;
