import React, { useState } from "react";
import axios from "axios";

function Apply() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    college: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setSubmitted(true);
    const result= await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/apply`, 
        formData
      );
  };

  return (
    <div className="apply-container">
      <style>{`
        .apply-container {
          font-family: 'Poppins', sans-serif;
          background: #f4f6fb;
          color: #001f3f;
          min-height: 100vh;
        }

        /* Hero Section */
        .apply-hero {
          background: url('/flight-bg.jpg') center/cover no-repeat;
          color: black;
          text-align: center;
          padding: 120px 20px;
          background-attachment: fixed;
        }

        .apply-hero h1 {
          font-size: 42px;
          margin-bottom: 15px;
          text-shadow: 0 2px 6px rgba(0,0,0,0.5);
        }

        .apply-hero p {
          font-size: 18px;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Form Section */
        .apply-form-section {
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .form-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          padding: 40px 50px;
          max-width: 700px;
          width: 100%;
          animation: fadeIn 0.8s ease;
        }

        .form-card h2 {
          color: #001f3f;
          margin-bottom: 10px;
        }

        .form-card p {
          margin-bottom: 30px;
          color: #444;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .form-group label {
          font-weight: 600;
          color: #001f3f;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1.5px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          transition: 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #001f3f;
        }

        .apply-btn {
          background: #ffcc00;
          border: none;
          color: #001f3f;
          font-weight: 600;
          padding: 14px 0;
          border-radius: 8px;
          width: 100%;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .apply-btn:hover {
          background: #ffdb4d;
        }

        /* Thank You Section */
        .thank-you {
          text-align: center;
          padding: 100px 20px;
        }

        .thank-you h2 {
          font-size: 30px;
          margin-bottom: 15px;
          color: #001f3f;
        }

        .thank-you p {
          font-size: 17px;
          color: #444;
          margin-bottom: 30px;
        }

        .thank-you button {
          background: #001f3f;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .thank-you button:hover {
          background: #002b66;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .form-card {
            padding: 30px 25px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="apply-hero">
        <h1>Take Off to Your Aviation Career</h1>
        <p>
          Join world-class flight and cabin crew programs with our partner academies.
          Your journey to the skies starts here.
        </p>
      </section>

      {/* Conditional Rendering */}
      {!submitted ? (
        <section className="apply-form-section">
          <div className="form-card">
            <h2>Application Form</h2>
            <p>Fill in your details to apply for your preferred aviation program.</p>

            <form onSubmit={handleSubmit} className="apply-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 98xxxxxxx"
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Program</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Program --</option>
                  <option>Pilot Training (CPL)</option>
                  <option>Cabin Crew Course</option>
                  <option>Aircraft Maintenance Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred College</label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select College --</option>
                  <option>SkyWings Flight Academy – Kathmandu</option>
                  <option>Blue Horizon Aviation – Bangalore</option>
                  <option>AirLink Academy – Dubai</option>
                </select>
              </div>

              <div className="form-group">
                <label>Why do you want to join this program?</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a brief motivation statement..."
                ></textarea>
              </div>

              <button type="submit" className="apply-btn">
                Submit Application
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="thank-you">
          <h2>🎉 Application Submitted Successfully!</h2>
          <p>
            Thank you for applying! Our team will contact you soon with the next
            steps of your aviation journey.
          </p>
          <button onClick={() => setSubmitted(false)}>Submit Another Application</button>
        </section>
      )}
    </div>
  );
}

export default Apply;
