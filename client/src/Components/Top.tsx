import React from "react";

interface College {
  img: string;
  name: string;
}

const Top = () => {
  const colleges: College[] = [
    {
      img: "/every.png",
      name: "Srilanka Aviation College",
    },
    {
      img: "/fly.png",
      name: "ATP Flight School",
    },
    {
      img: "/hey.png",
      name: "Aviation College Nepal",
    },
  ];

  return (
    <>
      <style>
        {`
        .top-section {
          font-family: 'Poppins', sans-serif;
          text-align: center;
          padding: 60px 20px;
          background-color: #f5f7fb;
        }

        .top-section h2 {
          font-size: 2.5rem;
          color: #002b5c;
          margin-bottom: 50px;
          position: relative;
        }

        .top-section h2::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -10px;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(to right, #00509e, #003f7f);
          border-radius: 2px;
        }

        .you {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 35px;
          justify-items: center;
        }

        .Hello {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          padding-bottom: 25px;
        }

        .Hello:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .Hello img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          transition: transform 0.4s ease;
          border-radius: 20px 20px 0 0;
        }

        .Hello:hover img {
          transform: scale(1.05);
        }

        .Hello p {
          font-size: 1.2rem;
          font-weight: 600;
          color: #003f7f;
          margin: 20px 0 10px;
        }

        .Hello a {
          display: inline-block;
          background: linear-gradient(to right, #00509e, #003f7f);
          color: white;
          padding: 10px 25px;
          border-radius: 25px;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,80,158,0.2);
        }

        .Hello a:hover {
          background: linear-gradient(to right, #003f7f, #002b5c);
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0,43,92,0.3);
        }

        @media (max-width: 768px) {
          .top-section h2 {
            font-size: 2rem;
          }
          .Hello p {
            font-size: 1.1rem;
          }
          .Hello img {
            height: 250px;
          }
        }
        `}
      </style>

      <div className="top-section">
        <h2>Top Colleges</h2>

        <div className="you">
          {colleges.map((college: College, index: number) => (
            <div className="Hello" key={index}>
              <img src={college.img} alt={college.name} />
              <p>{college.name}</p>
              
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Top;
