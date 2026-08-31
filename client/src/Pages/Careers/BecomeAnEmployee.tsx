import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
}

const BecomeAnEmployee = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "", email: "", phone: "", role: "", message: "",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      await axios.post(`${backendUrl}/api/employee-interest`, formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit interest", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px", animation: "scaleIn 0.5s ease" }}>✅</div>
        <h2 style={{ color: "#001a3d", marginBottom: "10px" }}>Thank You!</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>We've received your application. We'll review it and get back to you soon.</p>
        <Link to="/careers" style={{ color: "#00509e", fontWeight: 600 }}>← Back to Careers</Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .employee-page {
          font-family: 'Poppins', sans-serif;
        }

        .employee-hero {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          text-align: center;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .employee-hero::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: heroGlow 8s ease-in-out infinite;
        }

        .employee-hero h1 {
          position: relative;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          animation: fadeInUp 0.6s ease forwards;
        }

        .employee-hero p {
          position: relative;
          font-size: 1.1rem;
          opacity: 0;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease 0.2s forwards;
        }

        .employee-content {
          max-width: 800px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .employee-content h2 {
          font-size: 1.6rem;
          color: #001a3d;
          margin-bottom: 20px;
          text-align: center;
          animation: fadeInUp 0.5s ease forwards;
        }

        .apply-form {
          background: white;
          padding: 40px;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          animation: scaleIn 0.5s ease 0.2s forwards;
          opacity: 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #001a3d;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 13px 16px;
          border: 2px solid #e8e8e8;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background: #fafafa;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #00509e;
          background: white;
          box-shadow: 0 0 0 3px rgba(0,80,158,0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #00509e, #003f7f);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #003f7f, #001a3d);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,63,127,0.3);
        }

        .alt-apply {
          text-align: center;
          margin-top: 30px;
          padding: 25px;
          background: #f0f6ff;
          border-radius: 12px;
          animation: fadeInUp 0.5s ease 0.4s forwards;
          opacity: 0;
        }

        .alt-apply p {
          margin-bottom: 15px;
          color: #444;
        }

        .alt-apply a {
          display: inline-block;
          background: #00509e;
          color: white;
          padding: 12px 28px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .alt-apply a:hover {
          background: #003f7f;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .employee-hero h1 { font-size: 1.8rem; }
          .apply-form { padding: 25px; }
        }
      `}</style>

      <div className="employee-page">
        <div className="employee-hero">
          <h1>Become an Employee</h1>
          <p>Join our team and help shape the future of aviation careers worldwide.</p>
        </div>

        <div className="employee-content">
          <h2>Submit Your Interest</h2>
          <form className="apply-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
            </div>
            <div className="form-group">
              <label>Preferred Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select a role</option>
                <option value="pilot">Pilot</option>
                <option value="cabin-crew">Cabin Crew</option>
                <option value="maintenance">Aircraft Maintenance</option>
                <option value="operations">Flight Operations</option>
                <option value="trainer">Aviation Trainer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tell Us About Yourself</label>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Briefly describe your experience and interest..." required />
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
            {error && <p style={{ color: "#e53935", textAlign: "center", marginTop: "10px", fontSize: "14px" }}>{error}</p>}
          </form>

          <div className="alt-apply">
            <p>Looking for active job openings instead?</p>
            <Link to="/careers/vacancies">Browse Current Vacancies</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeAnEmployee;
