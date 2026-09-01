import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

interface Testimonial {
  img: string;
  text: string;
  name: string;
  role: string;
}

const Content: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      img: "/girl.png",
      text: `This website made exploring aviation careers so easy and fun. Everything I needed was right here!`,
      name: "Aarati Sharma",
      role: "Cabin Crew Trainee",
    },
    {
      img: "/boy.png",
      text: `Thanks to this site, I finally understood the different career paths in aviation clearly. Love the design too!`,
      name: "Bikash Thapa",
      role: "Pilot Trainee",
    },
    {
      img: "/girl.png",
      text: `The training programs and resources here gave me the confidence to ace my interview. Highly recommend!`,
      name: "Sunita Gurung",
      role: "Flight Operations",
    },
  ];

  return (
    <>
      <style>
        {`
        .testimonial-wrap {
          background: var(--color-surface-dim);
          padding: 80px 20px;
        }

        .testimonial-title {
          text-align: center;
          font-size: 32px;
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .testimonial-sub {
          text-align: center;
          color: var(--color-text-muted);
          font-size: 15px;
          margin-bottom: 45px;
        }

        .section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 0 auto;
          max-width: 1100px;
        }

        .first {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
          padding: 32px 24px;
          transition: all var(--transition-base);
          position: relative;
          text-align: center;
        }

        .first:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
        }

        .quote-icon {
          color: rgba(0, 80, 158, 0.12);
          font-size: 40px;
          margin-bottom: 8px;
        }

        .first .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 16px;
          border: 3px solid var(--color-gold-500);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
        }

        .stars {
          display: flex;
          gap: 4px;
          color: var(--color-gold-500);
          font-size: 13px;
          margin-bottom: 14px;
        }

        .first .quote-text {
          padding: 0;
          font-size: 15px;
          line-height: 1.7;
          color: var(--color-text-secondary);
          font-style: italic;
          margin-bottom: 20px;
        }

        .first .name {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .first .role {
          font-size: 12px;
          color: var(--color-text-muted);
          margin-top: 3px;
        }

        .gradient-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--color-navy-300), var(--color-gold-500));
          border-radius: 0 0 4px 4px;
        }

        @media (max-width: 768px) {
          .testimonial-wrap {
            padding: 60px 16px;
          }

          .testimonial-title {
            font-size: 24px;
          }

          .section {
            grid-template-columns: 1fr;
          }
        }
        `}
      </style>

      <div className="testimonial-wrap">
        <div className="testimonial-title">What Our Students Are Saying</div>
        <div className="testimonial-sub">Trusted by aspiring aviation professionals</div>

        <div className="section">
          {testimonials.map((item, index) => (
            <div className="first" key={index} style={{ animation: `fadeInUp 0.6s ease ${0.1 * index}s forwards` }}>
              <div className="gradient-bar"></div>
              <div className="quote-icon"><FaQuoteLeft /></div>
              <img src={item.img} alt={item.name} className="avatar" />
              <div className="stars">
                {[0, 1, 2, 3, 4].map((s) => <FaStar key={s} />)}
              </div>
              <p className="quote-text">{item.text}</p>
              <div className="name">{item.name}</div>
              <div className="role">{item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Content;
