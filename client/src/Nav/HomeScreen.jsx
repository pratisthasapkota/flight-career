import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

 const backendUrl = process.env.REACT_APP_BACKEND_URL;


const HomeScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ------------------- Email/Password Login -------------------
  const handleClick = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/login`, { email, password });
      // only runs for 2xx
      const { success, message, token, user } = response.data;
      if (success) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email);
        navigate('/student');
      } else {
        setErrorMsg(message);
      }
    } catch (error) {
      if (error.response) {
        // handle backend error messages
        setErrorMsg(error.response.data.message || "Login failed");
      } else {
        setErrorMsg("Server error. Try again later.");
      }
}

  };

  // ------------------- Google Login -------------------
  const googleLogin = useGoogleLogin({
    flow: 'auth-code', // auth code flow
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        // Send auth code to your backend
        const response = await axios.get(
          `http://localhost:5000/auth/google`,
          { code: codeResponse.code },
          { withCredentials: true } // important for cookies if your backend sets them
        );

        if (response.data.success) {
          setSuccessMsg('Successfully logged in! Redirecting...');
          localStorage.setItem("token", response.data.token || "");
          localStorage.setItem("email", response.data.user?.email || "");
          setTimeout(() => navigate('/student'), 1500);
        } else {
          setErrorMsg('Google login failed');
        }
      } catch (error) {
        console.error('Google login error:', error);
        if (error.response) {
          setErrorMsg(error.response.data.error || 'Unknown error');
        } else {
          setErrorMsg('Failed to sign in with Google');
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: errorResponse => {
      console.error('Google Login Failed:', errorResponse);
      setErrorMsg('Google Sign-In failed. Check OAuth configuration.');
    },
  });

  return (
    <div style={{
      height: '300px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '150px',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '60px 40px',
        maxWidth: '450px',
        width: '100%',
        minHeight: '450px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <h2 style={{ marginBottom: '25px', color: '#003366' }}>Welcome to our page</h2>

        {errorMsg && <p style={{ color: 'red', marginBottom: '15px' }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>{successMsg}</p>}

        <div style={{ textAlign: 'left', marginBottom: '18px' }}>
          <label style={{ fontWeight: '500', color: '#333' }}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '6px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ textAlign: 'left', marginBottom: '25px' }}>
          <label style={{ fontWeight: '500', color: '#333' }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '6px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
        </div>

        <button
          onClick={handleClick}
          style={{
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#5867d8',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Sign In
        </button>

        <style>{`
          .google-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #ccc;
            background-color: #e0e0e0;
            color: #333;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s ease, color 0.2s ease;
          }
          .google-btn:hover {
            background-color: #5867d8;
            color: #fff;
          }
        `}</style>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button onClick={googleLogin} className="google-btn">
            <FaGoogle /> Continue with Google
          </button>
        </div>

        <p style={{ fontSize: '14px', color: '#555' }}>
          Don't have an account? <a href="/sign" style={{ color: '#5867d8', textDecoration: 'none' }}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
