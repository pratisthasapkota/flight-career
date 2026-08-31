import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  { question: "What qualifications do I need to become a cabin crew member?", answer: "Most airlines require a minimum age of 18-21, a high school diploma, proficiency in English, and excellent physical fitness. Additional certifications like a cabin crew training certificate are often preferred." },
  { question: "How long does pilot training take?", answer: "Pilot training duration varies. A Private Pilot License (PPL) takes about 2-3 months, while a Commercial Pilot License (CPL) can take 6-18 months. An Airline Transport Pilot License (ATPL) requires additional flight hours and can take 2-3 years total." },
  { question: "Does AeroCareers provide job placement assistance?", answer: "Yes! We partner with multiple airlines and aviation companies to provide job placement assistance to our trained students. Our career services team helps with resume preparation, interview coaching, and connecting you with hiring partners." },
  { question: "What training programs do you offer?", answer: "We offer comprehensive training programs including Pilot Training (PPL, CPL, ATPL), Cabin Crew Certification, Aircraft Maintenance Engineering, Flight Operations, and various short courses for aviation professionals." },
  { question: "Are there scholarships available?", answer: "Yes, we offer merit-based scholarships and flexible payment plans for qualifying students. Contact our admissions team to learn more about available financial aid options." },
  { question: "Can I work internationally after training?", answer: "Absolutely! Aviation is a global industry. Our certifications are recognized internationally, and many of our graduates work with airlines across Asia, the Middle East, Europe, and the Americas." },
  { question: "What is the career growth path for cabin crew?", answer: "A typical cabin crew career path includes: Cabin Crew → Senior Cabin Crew → Cabin Crew Trainer → In-Flight Services Manager → Head of In-Flight Services. With additional qualifications, some transition to ground-based roles." },
  { question: "How do I apply for job vacancies?", answer: "Visit our Vacancies page to see current openings. You can apply directly through the application links provided for each airline. We recommend setting up email alerts to stay updated on new opportunities." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          {faqData.map((faq: FaqItem, index: number) => (
            <div className={`faq-item ${openIndex === index ? "open" : ""}`} key={index}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <span className={`faq-toggle ${openIndex === index ? "open" : ""}`}>+</span>
              </div>
              <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}

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
