import React from "react";

const Content = () => {
  const testimonials = [
    {
      img: "/girl.png",
      text: `This website made exploring aviation careers so easy and fun. Everything I needed was right here!`,
    },
    {
      img: "/boy.png",
      text: `Thanks to this site, I finally understood the different career paths in aviation clearly. Love the design too!`,
    },
    {
      img: "/girl.png",
      text: `This website made exploring aviation careers so easy and fun. Everything I needed was right here!`,
    },
  ];

  return (
    <>
      <style>
        {`
        .section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          grid-
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
          margin: 60px;
          border-radius: 10px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
        }

        .first {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
          width: 400px;
          height: 250px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .first:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
        }

        .first img {
          width: 45%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px 0 0 10px;
        }

        .first p {
          padding: 20px;
          font-size: 18px;
          line-height: 1.4;
          color: #333;
        }

        p.title {
          text-align: center;
          font-size: 30px;
          font-weight: bold;
          color: #002b5c;
          margin-top: 40px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .section {
            margin: 30px;
          }

          .first {
            flex-direction: column;
            width: 90%;
            height: auto;
          }

          .first img {
            width: 100%;
            height: 200px;
          }

          .first p {
            font-size: 16px;
          }
        }
        `}
      </style>

      <p className="title">What our students are saying</p>

      <div className="section">
        {testimonials.map((item, index) => (
          <div className="first" key={index}>
            <img src={item.img} alt="student" />
            <div>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Content;
