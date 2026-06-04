import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Price() {
  const location = useLocation();
  const product = location.state?.product || {
    name: "Default Product",
    price: "$0.00",
    image: "/r.png",
    description: "No product selected.",
    id: 1,
  };

  const [formData, setFormData] = useState({
    name: "",
    email:"",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((p) => p.id === product.id);
    if (exists) setInCart(true);
  }, [product.id]);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); 

  try {
    const payload = { ...formData, quantity, productname: product.name };
    const response = await axios.post('http://localhost:5000/product', payload);
    if(response.data.success){

    alert(`Order placed for ${quantity} × ${product.name}!`);
    }
    
  } catch (error) {
    console.error(error);
    alert("Failed to place order.");
  }
};


 
  const styles = {
    container: {
      display: "flex",
      gap: "40px",
      justifyContent: "space-between",
      maxWidth: "1000px",
      margin: "40px auto",
      fontFamily: "Poppins, sans-serif",
    },
    formCard: {
      flex: 1,
      background: "#fff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    },
    formTitle: { marginBottom: "20px", color: "#333" },
    form: { display: "flex", flexDirection: "column", gap: "12px" },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    qtyBox: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    qtyBtn: {
      padding: "6px 12px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    submitBtn: {
      marginTop: "20px",
      padding: "12px",
      backgroundColor: "#0077cc",
      color: "white",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
    productCard: {
      flex: 1,
      background: "#f9f9f9",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
      textAlign: "center",
    },
    productImage: { width: "80%", borderRadius: "10px" },
    productTitle: { marginTop: "15px", color: "#333" },
    price: { color: "#0077cc", fontSize: "1.3em", fontWeight: "bold" },
    desc: { color: "#555", marginTop: "10px", lineHeight: "1.5" },
    addToCartBtn: {
      marginTop: "20px",
      padding: "12px 20px",
      backgroundColor: inCart ? "green" : "#ff9900",
      color: "white",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "0.3s",
    },
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>Shipping Details</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input style={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} required />
           
          <label>Email</label>
          <input style={styles.input} type="text" name="email" value={formData.email} onChange={handleChange} required />
          <label>Address</label>
          <input style={styles.input} type="text" name="address" value={formData.address} onChange={handleChange} required />

          <label>City</label>
          <input style={styles.input} type="text" name="city" value={formData.city} onChange={handleChange} required />

          <label>Postal Code</label>
          <input style={styles.input} type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />

          <label>Phone Number</label>
          <input style={styles.input} type="text" name="phone" value={formData.phone} onChange={handleChange} required />

         
          <label>Quantity</label>
          <div style={styles.qtyBox}>
            <button type="button" onClick={decreaseQty} style={styles.qtyBtn}>−</button>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>{quantity}</span>
            <button type="button" onClick={increaseQty} style={styles.qtyBtn}>+</button>
          </div>

          <button style={styles.submitBtn} type="submit">
            Confirm Order
          </button>
        </form>
      </div>

    
      <div style={styles.productCard}>
        <img src={product.image} alt={product.name} style={styles.productImage} />
        <h2 style={styles.productTitle}>{product.name}</h2>
        <p style={styles.price}>{product.price}</p>
        <p style={styles.desc}>{product.description}</p>

        
      </div>
    </div>
  );
}

export default Price;
