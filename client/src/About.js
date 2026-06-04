import React from "react";
import Navbar from "./Components/Navbar";

function About() {
  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <p className="memo">✈️ Welcome to Your Aviation Career Journey</p>
        <p>
          Dreaming of a career in the skies? Whether you aspire to become a
          Cabin Crew member or a Pilot, we provide you with the knowledge,
          guidance, and opportunities to help you take off.
        </p>

        <h3 style={{ fontWeight: "bold" }}>Why Choose Aviation?</h3>

       
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "darkblue",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <div style={{ flex: 1 }}>
            <ul>
              <li>Global Career Opportunities – Work with top airlines worldwide.</li>
              <li>Prestigious Lifestyle – Travel and explore cultures.</li>
              <li>High Career Growth & Job Stability.</li>
              <li>High Salary & Allowances.</li>
            </ul>
          </div>

          <div style={{ flex: "0 0 40%" }}>
            <img
              src="/tuu.jpg"
              alt="aviation career"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "darkblue",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "30px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3>Our Programs</h3>
            <ul>
              <li>Pilot Training – Ground school to advanced flying hours.</li>
              <li>Cabin Crew Training – Grooming & communication skills.</li>
              <li>Career Counseling – One-on-one aviation guidance.</li>
              <li>College Referral Partnerships – Connect with top aviation academies.</li>
            </ul>
          </div>

          <div style={{ flex: "0 0 40%" }}>
            <img
              src="/photo.jpg"
              alt="programs"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
        </div>

       
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "darkblue",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "30px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3>Our Mission</h3>
            <p>
              To empower aspiring aviators with world-class education,
              personalized mentorship, and global opportunities to build
              successful aviation careers.
            </p>
          </div>

          <div style={{ flex: "0 0 40%" }}>
            <img
              src="/miss.jpg"
              alt="mission"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
        </div>

       
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            marginTop: "40px",
          }}
        >
          <img
            src="/ss.png"
            alt="logo"
            style={{
              width: "180px",
              borderRadius: "50%",
              marginBottom: "20px",
            }}
          />
          <h2>Start Your Journey Today</h2>
          <p style={{ maxWidth: "650px", margin: "auto", marginTop: "10px" }}>
            Your dream career is just one step away. Whether you want to soar as
            a pilot or welcome passengers as cabin crew, we are here to guide
            you from the first step to the final destination.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
