import React, { useState, useEffect } from "react";
import axios from "axios";

interface FaqItem {
  id: number | string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    axios
      .get<{ success: boolean; data: FaqItem[] }>(`${backendUrl}/api/faq`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setFaqs(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load FAQs", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayFaqs = loading ? [] : faqs;

  return (
    <>
      <style>{`
        .faq-page {
          font-family: 'Poppins', sans-serif;
        }

        .faq-hero {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          text-align: center;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .faq-hero::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 60% 40%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: heroGlow 8s ease-in-out infinite;
        }

        .faq-hero h1 {
          position: relative;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          animation: fadeInUp 0.6s ease forwards;
        }

        .faq-hero p {
          position: relative;
          font-size: 1.1rem;
          opacity: 0;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease 0.2s forwards;
        }

        .faq-content {
          max-width: 800px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .faq-item {
          background: white;
          border-radius: 10px;
          margin-bottom: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          overflow: hidden;
          transition: all 0.3s ease;
          opacity: 0;
          animation: fadeInUp 0.4s ease forwards;
          border-left: 3px solid transparent;
        }

        .faq-item:nth-child(1) { animation-delay: 0.1s; }
        .faq-item:nth-child(2) { animation-delay: 0.15s; }
        .faq-item:nth-child(3) { animation-delay: 0.2s; }
        .faq-item:nth-child(4) { animation-delay: 0.25s; }
        .faq-item:nth-child(5) { animation-delay: 0.3s; }
        .faq-item:nth-child(6) { animation-delay: 0.35s; }
        .faq-item:nth-child(7) { animation-delay: 0.4s; }
        .faq-item:nth-child(8) { animation-delay: 0.45s; }

        .faq-item:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .faq-item.open {
          border-left-color: #00509e;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          color: #001a3d;
          transition: all 0.3s ease;
          user-select: none;
        }

        .faq-question:hover {
          background: #f8f9fa;
        }

        .faq-toggle {
          font-size: 1.4rem;
          color: #00509e;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          min-width: 24px;
          text-align: center;
          font-weight: 300;
        }

        .faq-toggle.open {
          transform: rotate(45deg);
          color: #ffd700;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease;
        }

        .faq-answer.open {
          max-height: 300px;
          padding: 0 25px 20px;
        }

        .faq-answer p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #555;
        }

        .faq-contact {
          text-align: center;
          margin-top: 40px;
          padding: 30px;
          background: #f0f6ff;
          border-radius: 12px;
          animation: fadeInUp 0.5s ease 0.5s forwards;
          opacity: 0;
        }

        .faq-contact h3 {
          color: #001a3d;
          margin-bottom: 10px;
        }

        .faq-contact p {
          color: #555;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .faq-hero h1 { font-size: 1.8rem; }
          .faq-question { padding: 16px 20px; font-size: 0.95rem; }
          .faq-answer.open { padding: 0 20px 16px; }
        }
      `}</style>

      <div className="faq-page">
        <div className="faq-hero">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about aviation careers and our training programs.</p>
        </div>

        <div className="faq-content">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#555" }}>Loading FAQs...</div>
          ) : displayFaqs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#555" }}>
              No FAQs available at the moment.
            </div>
          ) : (
            displayFaqs.map((faq: FaqItem, index: number) => (
              <div className={`faq-item ${openIndex === index ? "open" : ""}`} key={faq.id}>
                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                  <span>{faq.question}</span>
                  <span className={`faq-toggle ${openIndex === index ? "open" : ""}`}>+</span>
                </div>
                <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))
          )}

          <div className="faq-contact">
            <h3>Still have questions?</h3>
            <p>Contact us at info@cabincrew.edu.np or call +977 9744341824</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
