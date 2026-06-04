import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Store = () => {
  const navigate = useNavigate();

  const products = [
    { name: "Pilot Uniform", image: "/r.png", price: "$129.99" },
    { name: "Cabin Crew Dress", image: "/p.png", price: "$109.99" },
    { name: "Ground Staff Uniform", image: "/q.png", price: "$99.99" },
    { name: "Flight Attendant Outfit", image: "/u.png", price: "$119.99" },
    { name: "Blue Crew Set", image: "/v.png", price: "$89.99" },
    { name: "Formal Aviation Dress", image: "/dress.png", price: "$139.99" },
    { name: "Pilot Uniform", image: "/r.png", price: "$129.99" },
    { name: "Cabin Crew Dress", image: "/p.png", price: "$109.99" },
    { name: "Ground Staff Uniform", image: "/q.png", price: "$99.99" },
    { name: "Flight Attendant Outfit", image: "/u.png", price: "$119.99" },
    { name: "Blue Crew Set", image: "/v.png", price: "$89.99" },
    { name: "Formal Aviation Dress", image: "/dress.png", price: "$139.99" },
  ];

  const handleBuy = (product) => {
    navigate("/price", { state: { product } }); 
  };

  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 0;
        }
        .section {
          max-width: 1200px;
          margin: 60px auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
          padding: 50px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }
        .card {
          background: #f0f4ff;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: 0.3s;
        }
        .card:hover {
          background: #e1ebff;
          transform: translateY(-5px);
        }
        .card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 10px;
        }
        .card h3 {
          color: #003366;
        }
        .card button {
          background: #5280ff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
        }
        .card button:hover {
          background: #ff3333;
        }
      `}</style>
      <Navbar/>
      <div className="section">
        <h2 style={{ textAlign: "center", color: "#002b5b" }}>
          CrewStyle: The Official Store for Aviation Professionals
        </h2>
        <div className="grid">
          {products.map((product, index) => (
            <div key={index} className="card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button onClick={() => handleBuy(product)}>Buy Now</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Store;
