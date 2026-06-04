import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <style>{`
        .contact-page {
          font-family: 'Poppins', sans-serif;
          color: #1e1e1e;
          background-color: #f5f7fb;
          padding-bottom: 60px;
        }

        
        .contact-hero {
          text-align: center;
          background: linear-gradient(to right, #002b5c, #00509e);
          color: white;
          padding: 80px 20px;
          border-radius: 0 0 60px 60px;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
        .contact-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .contact-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 700px;
          margin: 0 auto;
        }

        .contact-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 60px;
          margin-top: 60px;
          width: 90%;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }
        .contact-form {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }
        .contact-form input,
        .contact-form textarea,
        .contact-form select {
          width: 100%;
          padding: 12px 15px;
          margin: 10px 0;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }
        .contact-form textarea {
          resize: vertical;
          min-height: 120px;
        }
        .contact-form button {
          background-color: #00509e;
          color: white;
          border: none;
          padding: 12px 25px;
          font-size: 1rem;
          border-radius: 30px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .contact-form button:hover {
          background-color: #002b5c;
          transform: scale(1.05);
        }

        
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: center;
        }
        .contact-info div {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1.1rem;
        }

       
        .contact-map {
          width: 100%;
          height: 350px;
          border-radius: 20px;
          overflow: hidden;
        }

        

       
        .contact-footer {
          text-align: center;
          margin-top: 60px;
          padding: 50px 20px;
          background: linear-gradient(to right, #00509e, #002b5c);
          color: white;
          border-radius: 30px;
        }
       .contact-footer h2,.contact-footer p {
          color:white;
        }
        
        @media (max-width: 900px) {
          .contact-section {
            width: 95%;
          }
        }
      `}</style>

      <div className="contact-page">
        
        <header className="contact-hero">
          <h1>Get in Touch with Us</h1>
          <p>
            Have questions, feedback, or suggestions? Our team is ready to assist you. Reach out through any of the channels below.
          </p>
        </header>

        
        <section className="contact-section">
          <div className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="tel" placeholder="Your Phone (optional)" />
            <select>
              <option value="">Select Department</option>
              <option value="support">Support</option>
              <option value="training">Training</option>
              <option value="careers">Careers</option>
              <option value="feedback">Feedback</option>
            </select>
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </div>

          
          <div className="contact-info">
            <div>📧 Email: info@aviationworld.com</div>
            <div>📞 Phone: +977-9812345678</div>
            <div>📍 Address: Aviation Academy, Kathmandu, Nepal</div>
            <div>🕒 Hours: Mon – Fri, 9:00 AM – 6:00 PM</div>
          </div>

         \
          <div className="contact-map">
            <iframe
              title="Office Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0!2d85.0!3d27.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199daecb6a17%3A0x2b16f4b8d6e5f5a3!2sKathmandu!5e0!3m2!1sen!2snp!4v1600000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          
          
        </section>

        
        <section className="contact-footer">
          <h2>Ready to Take Off?</h2>
          <p>Contact us today and let’s guide you on your aviation journey!</p>
          
        </section>
        <Footer/>
      </div>
    </>
  );
};

export default Contact;
