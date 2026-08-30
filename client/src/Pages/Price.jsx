import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Price() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cart || [];
  const singleProduct = location.state?.product;

  const items = singleProduct
    ? [{ ...singleProduct, quantity: singleProduct.quantity || 1, size: singleProduct.size || "M" }]
    : cartItems;
  const orderTotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const [formData, setFormData] = useState(
    location.state?.formData || {
      name: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
    }
  );
  const [step, setStep] = useState(location.state?.step || 1);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedIn = !!(localStorage.getItem("email") || localStorage.getItem("token"));
    if (!loggedIn) {
      navigate("/login", {
        state: {
          from: "/price",
          checkoutState: { ...location.state, formData, step },
        },
      });
      return;
    }

    setSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        items: items.map((item) => ({
          productId: item.productId || null,
          productname: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
      };
      await axios.post(`${backendUrl}/product`, payload);
      if (!singleProduct) {
        localStorage.removeItem("aeroCart");
      }
      setOrderComplete(true);
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = (fields) => fields.every((f) => formData[f]?.trim());

  if (orderComplete) {
    return (
      <>
        <Navbar />
        <div style={styles.completeContainer}>
          <div style={styles.completeCard}>
            <div style={styles.checkmark}>✓</div>
            <h2 style={styles.completeTitle}>Order Placed Successfully!</h2>
            <p style={styles.completeText}>
              Thank you, <strong>{formData.name}</strong>! Your order has been confirmed.
              <br />A confirmation email has been sent to <strong>{formData.email}</strong>.
            </p>
            <div style={styles.completeItems}>
              {items.map((item, i) => (
                <div key={i} style={styles.completeItem}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={styles.completeTotal}>
              <span>Total Paid</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
            <button style={styles.continueBtn} onClick={() => navigate("/store")}>
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <style>{`
        .checkout-page {
          font-family: 'Poppins', sans-serif;
          background: #f5f7fb;
          min-height: 80vh;
        }

        .checkout-header {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          text-align: center;
          padding: 50px 20px;
        }

        .checkout-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .checkout-header p {
          opacity: 0.85;
          font-size: 0.95rem;
        }

        .progress-bar {
          display: flex;
          justify-content: center;
          gap: 0;
          margin: 30px auto;
          max-width: 500px;
          animation: fadeInUp 0.5s ease;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          color: #bbb;
          position: relative;
        }

        .progress-step.active {
          color: #00509e;
        }

        .progress-step.completed {
          color: #00c853;
        }

        .progress-step .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-num {
          border-color: #00509e;
          background: #00509e;
          color: white;
        }

        .progress-step.completed .step-num {
          border-color: #00c853;
          background: #00c853;
          color: white;
        }

        .checkout-body {
          max-width: 1000px;
          margin: 30px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 30px;
        }

        .checkout-form-card {
          background: white;
          border-radius: 16px;
          padding: 35px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          animation: fadeInLeft 0.5s ease;
        }

        .checkout-form-card h2 {
          font-size: 1.3rem;
          color: #001a3d;
          margin-bottom: 25px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #444;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input {
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

        .form-group input:focus {
          outline: none;
          border-color: #00509e;
          background: white;
          box-shadow: 0 0 0 3px rgba(0,80,158,0.1);
        }

        .place-order-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #00509e, #003f7f);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .place-order-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #003f7f, #001a3d);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,63,127,0.3);
        }

        .place-order-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .order-summary {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          height: fit-content;
          position: sticky;
          top: 100px;
          animation: fadeInRight 0.5s ease;
        }

        .order-summary h2 {
          font-size: 1.2rem;
          color: #001a3d;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .summary-item {
          display: flex;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .summary-item-img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
          background: #f0f4ff;
        }

        .summary-item-info {
          flex: 1;
        }

        .summary-item-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .summary-item-meta {
          font-size: 0.75rem;
          color: #888;
        }

        .summary-item-price {
          font-weight: 700;
          color: #001a3d;
          font-size: 0.9rem;
        }

        .summary-totals {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 2px solid #eee;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: #666;
        }

        .summary-row.total {
          font-size: 1.1rem;
          font-weight: 700;
          color: #001a3d;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #eee;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding: 10px;
          background: #f0f9ff;
          border-radius: 8px;
          font-size: 0.78rem;
          color: #00509e;
          font-weight: 500;
        }

        .back-to-store {
          display: block;
          text-align: center;
          margin-top: 20px;
          color: #00509e;
          font-size: 0.9rem;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .back-to-store:hover {
          color: #001a3d;
        }

        @media (max-width: 768px) {
          .checkout-body {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .order-summary {
            position: static;
          }
        }
      `}</style>

      <div className="checkout-page">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order in just a few steps</p>
        </div>

        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? (step > 1 ? "completed" : "active") : ""}`}>
            <span className="step-num">{step > 1 ? "✓" : "1"}</span>
            <span>Shipping</span>
          </div>
          <div className={`progress-step ${step >= 2 ? (step > 2 ? "completed" : "active") : ""}`}>
            <span className="step-num">{step > 2 ? "✓" : "2"}</span>
            <span>Review</span>
          </div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <span className="step-num">3</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="checkout-body">
          <div className="checkout-form-card">
            <h2>{step === 1 ? "Shipping Details" : step === 2 ? "Review Order" : "Confirm & Pay"}</h2>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Aviation Street" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Kathmandu" required />
                    </div>
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="44600" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+977 9744341824" required />
                  </div>
                  <button
                    type="button"
                    className="place-order-btn"
                    onClick={() => {
                      if (isStepValid(["name", "email", "address", "city", "postalCode", "phone"])) {
                        setStep(2);
                      }
                    }}
                  >
                    Continue to Review →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>Shipping to:</p>
                    <p style={{ fontWeight: 600 }}>{formData.name}</p>
                    <p style={{ color: "#555" }}>{formData.address}, {formData.city} {formData.postalCode}</p>
                    <p style={{ color: "#555" }}>{formData.email} · {formData.phone}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" className="place-order-btn" style={{ background: "#e0e0e0", color: "#333" }} onClick={() => setStep(1)}>
                      ← Back
                    </button>
                    <button type="button" className="place-order-btn" onClick={() => setStep(3)}>
                      Review Complete →
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🔒</div>
                    <p style={{ color: "#666", marginBottom: "15px" }}>
                      Click below to confirm your order. A confirmation email will be sent to <strong>{formData.email}</strong>.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" className="place-order-btn" style={{ background: "#e0e0e0", color: "#333" }} onClick={() => setStep(2)}>
                      ← Back
                    </button>
                    <button type="submit" className="place-order-btn" disabled={submitting}>
                      {submitting ? "Processing..." : `Place Order — $${orderTotal.toFixed(2)}`}
                    </button>
                  </div>
                </>
              )}
            </form>
            <span className="back-to-store" onClick={() => navigate("/store")}>← Back to Store</span>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            {items.map((item, i) => (
              <div className="summary-item" key={i}>
                <img className="summary-item-img" src={item.image} alt={item.name} />
                <div className="summary-item-info">
                  <div className="summary-item-name">{item.name}</div>
                  <div className="summary-item-meta">Size: {item.size} · Qty: {item.quantity}</div>
                </div>
                <div className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: orderTotal >= 150 ? "#00c853" : "#333" }}>
                  {orderTotal >= 150 ? "Free" : "$9.99"}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${(orderTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(orderTotal + (orderTotal >= 150 ? 0 : 9.99) + orderTotal * 0.1).toFixed(2)}</span>
              </div>
            </div>
            <div className="secure-badge">🔒 Secure checkout · SSL encrypted</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  completeContainer: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
    background: "#f5f7fb",
  },
  completeCard: {
    background: "white",
    borderRadius: "20px",
    padding: "50px 40px",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    animation: "scaleIn 0.5s ease forwards",
  },
  checkmark: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00c853, #009624)",
    color: "white",
    fontSize: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    animation: "scaleIn 0.6s ease 0.2s forwards",
    opacity: 0,
  },
  completeTitle: {
    color: "#001a3d",
    marginBottom: "12px",
  },
  completeText: {
    color: "#666",
    lineHeight: 1.7,
    fontSize: "0.95rem",
    marginBottom: "20px",
  },
  completeItems: {
    background: "#f9f9f9",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
  },
  completeItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "0.9rem",
    color: "#555",
  },
  completeTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#001a3d",
    padding: "12px 0",
    borderTop: "2px solid #eee",
    marginBottom: "24px",
  },
  continueBtn: {
    padding: "14px 40px",
    background: "linear-gradient(135deg, #00509e, #003f7f)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.3s ease",
  },
};

export default Price;
