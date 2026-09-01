import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
}

interface FormStatus {
  ok: boolean;
  text: string;
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    role: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<FormStatus | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ ok: false, text: "Please fill in your name, email, and message." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({ ok: false, text: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      await axios.post(`${backendUrl}/api/employee-interest`, form);
      setStatus({ ok: true, text: "Message sent successfully! We will get back to you soon." });
      setForm({ name: "", email: "", phone: "", role: "", message: "" });
    } catch (error) {
      console.log(error);
      setStatus({ ok: false, text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    { icon: <FiMail />, label: "Email", value: "info@cabincrew.edu.np", href: "mailto:info@cabincrew.edu.np" },
    { icon: <FiPhone />, label: "Phone", value: "+977 9744341824", href: "tel:+9779744341824" },
    { icon: <FiMapPin />, label: "Address", value: "AeroCareers Academy, Kathmandu, Nepal" },
    { icon: <FiClock />, label: "Hours", value: "Mon – Fri, 9:00 AM – 6:00 PM" },
  ];

  return (
    <>
      <Navbar />
      <style>{`
        .contact-page {
          font-family: var(--font-sans);
          color: var(--color-text-primary);
          background-color: var(--color-surface-dim);
          padding-bottom: 0;
        }

        .contact-hero {
          text-align: center;
          background: linear-gradient(160deg, #000d1f 0%, #002b5c 60%, #00509e 100%);
          color: white;
          padding: 90px 20px;
          border-radius: 0 0 40px 40px;
          position: relative;
          overflow: hidden;
        }

        .contact-hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
        }

        .contact-hero h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
          position: relative;
        }

        .contact-hero p {
          font-size: 1.15rem;
          opacity: 0.85;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.7;
          position: relative;
        }

        .contact-body {
          max-width: 1150px;
          margin: -30px auto 60px;
          padding: 0 24px;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 30px;
          align-items: stretch;
        }

        .contact-form {
          background: white;
          padding: 40px;
          border-radius: var(--radius-xl);
          width: 100%;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--color-border);
        }

        .contact-form h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .contact-form .form-subtitle {
          color: var(--color-text-muted);
          font-size: 14px;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .contact-form input,
        .contact-form textarea,
        .contact-form select {
          width: 100%;
          padding: 13px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: 0.95rem;
          font-family: var(--font-sans);
          color: var(--color-text-primary);
          background: var(--color-surface-dim);
          transition: all var(--transition-fast);
          outline: none;
        }

        .contact-form input:focus,
        .contact-form textarea:focus,
        .contact-form select:focus {
          border-color: var(--color-navy-300);
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 80, 158, 0.08);
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 130px;
        }

        .contact-form select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238896a6' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }

        .contact-form button {
          background: linear-gradient(135deg, var(--color-navy-400), var(--color-navy-600));
          color: white;
          border: none;
          padding: 14px 30px;
          font-size: 15px;
          font-weight: 600;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans);
          margin-top: 8px;
          box-shadow: var(--shadow-md);
        }

        .contact-form button:hover {
          background: linear-gradient(135deg, var(--color-navy-600), var(--color-navy-800));
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .contact-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 22px 24px;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 18px;
          transition: all var(--transition-base);
        }

        .info-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: rgba(0, 80, 158, 0.15);
        }

        .info-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          background: linear-gradient(135deg, var(--color-navy-400), var(--color-navy-600));
          color: white;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .info-label {
          font-size: 12px;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
          margin-bottom: 3px;
        }

        .info-value {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-primary);
        }

        .contact-map {
          width: 100%;
          height: 300px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
        }

        .map-wrapper {
          grid-column: 1 / -1;
          margin-top: 10px;
        }

        .contact-footer {
          text-align: center;
          padding: 60px 24px;
          background: linear-gradient(160deg, #000d1f 0%, #002b5c 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .contact-footer::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.06) 0%, transparent 50%);
        }

        .contact-footer h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
          position: relative;
        }

        .contact-footer p {
          color: rgba(200, 214, 229, 0.85);
          font-size: 16px;
          position: relative;
        }

        @media (max-width: 900px) {
          .contact-body {
            grid-template-columns: 1fr;
            margin-top: -20px;
            padding: 0 16px;
          }

          .contact-form {
            padding: 28px 24px;
          }

          .contact-hero h1 {
            font-size: 2.2rem;
          }

          .map-wrapper {
            grid-column: auto;
          }
        }
      `}</style>

      <div className="contact-page">
        <header className="contact-hero">
          <h1>Get in Touch</h1>
          <p>
            Have questions, feedback, or suggestions? Our team is ready to assist you. Reach out through any of the channels below.
          </p>
        </header>

        <div className="contact-body">
          <form className="contact-form" onSubmit={handleSubmit} style={{ animation: "fadeInUp 0.6s ease forwards" }}>
            <h3>Send us a message</h3>
            <p className="form-subtitle">We usually respond within 24 hours</p>

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone (optional)"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="">Select Department</option>
                <option value="Support">Support</option>
                <option value="Training">Training</option>
                <option value="Careers">Careers</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
              <FiSend />
            </button>

            {status && (
              <p
                style={{
                  marginTop: "14px",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: status.ok ? "#1a7f37" : "#b42318",
                }}
              >
                {status.text}
              </p>
            )}
          </form>

          <div className="contact-info">
            {infoItems.map((item, i) => (
              <div className="info-card" key={i} style={{ animation: `fadeInUp 0.6s ease ${0.1 * i + 0.1}s forwards` }}>
                <div className="info-icon">{item.icon}</div>
                <div>
                  <div className="info-label">{item.label}</div>
                  {item.href ? (
                    <a className="info-value" href={item.href} style={{ textDecoration: "none" }}>{item.value}</a>
                  ) : (
                    <div className="info-value">{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="map-wrapper">
              <div className="contact-map">
                <iframe
                  title="Office Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0!2d85.0!3d27.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199daecb6a17%3A0x2b16f4b8d6e5f5a3!2sKathmandu!5e0!3m2!1sen!2snp!4v1600000000000!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <section className="contact-footer">
          <h2>Ready to Take Off?</h2>
          <p>Contact us today and let's guide you on your aviation journey!</p>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
