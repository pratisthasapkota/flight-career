import React from "react";

const Promos = () => {
  return (
    <>
      <style>{`
        .promo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 50px;
          padding: 80px 20px;
          width: 97%;
          margin: 0 auto;
          flex-wrap: wrap;
          background-color: white;
          margin-top:20px;
          border-radius: 10px;
          accent:#E0F2FE;
          box-shadow:0 14px 20px rgba(0,0,0,0.5)
        }

        .promo-image-container {
          position: relative;
          flex: 1;
          min-width: 300px;
          max-width: 600px;
          
          
        }

        .promo-image-container img {
          width: 100%;
          border-radius: 30px;
          display: block;
        }

        .promo-stat {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: white;
          padding: 20px 25px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-weight: 600;
          text-align: center;
        }

        .promo-content {
          flex: 1;
          min-width: 300px;
        }

        .promo-content h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #002b5c;
        }

        .promo-content p {
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 15px;
          color: #333;
        }

        .promo-btn {
          background-color: #c71f27;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 20px;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .promo-btn:hover {
          background-color: #9e1a1f;
          transform: scale(1.05);
        }

        @media (max-width: 900px) {
          .promo-section {
            flex-direction: column;
            text-align: center;
          }

          .promo-stat {
            position: static;
            margin-top: 20px;
          }
        }
      `}</style>

      <section className="promo-section">
        <div className="promo-image-container">
          <img src="/final.png" alt="Promote Website" />
          <div className="promo-stat">
            93%<br />
            of our users are satisfied with our website
          </div>
        </div>

        <div className="promo-content">
          <h2>Building your professional future</h2>
          <p>
            Our website was designed to provide all the resources you need to explore careers in aviation,
            understand opportunities, and prepare for your dream job — all in one place.
          </p>
          <p>
            From guidance on career paths to personalized resources, we make sure every user
            gets the support they need to succeed.
          </p>

          <button className="promo-btn">Explore Now</button>
        </div>
      </section>
    </>
  );
};

export default Promos;
