import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const Sign = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: 'openid profile email',
    onSuccess: async (codeResponse) => {
      console.log('Google Login Success:', codeResponse);
      try {
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        console.log('Sending code to backend:', `${backendUrl}/auth/google/callback`);
        const response = await axios.post(`${backendUrl}/auth/google/callback`, {
          code: codeResponse.code,
        }, {
          withCredentials: true
        });
        console.log('Backend response:', response.data);

        if (response.data.success) {
          setSuccessMsg('Successfully signed up');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      } catch (error) {
        console.error('Google login error:', error);
        if (error.response) {
          console.error('Backend error data:', error.response.data);
          const errorMsg = error.response.data.error || 'Unknown error';
          const errorDetails = error.response.data.message || '';

          if (errorMsg === 'user_already_exists') {
            setSuccessMsg('You already have an account! Redirecting...');
            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else if (errorMsg === 'database_error') {
            setErrorMsg(`Database error: ${errorDetails}`);
          } else {
            setErrorMsg(`Login failed: ${errorMsg} ${errorDetails}`);
          }
        } else if (error.message && error.message.includes('invalid_client')) {
          setErrorMsg('OAuth configuration error. Please check your Google Client ID and Secret.');
        } else {
          setErrorMsg('Failed to sign in with Google. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: errorResponse => {
      console.error('Google Login Failed:', errorResponse);
      setErrorMsg('Google Sign-In failed. Check console for details.');
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/sign`, {
        email,
        password
      });

      if (response.data.success) {
        alert('Sign up successful!');
        navigate('/login');
      } else {
        setErrorMsg(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Server error");
    }
  };

  const seeClick = () => {
    googleLogin();
  };

  return (
    <div style={{
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

        {errorMsg && (
          <p style={{ color: 'red', marginBottom: '15px' }}>{errorMsg}</p>
        )}

        {successMsg && (
          <p style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>{successMsg}</p>
        )}

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
          Sign Up
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
          <button onClick={seeClick} className="google-btn" disabled={isLoading}>
            <FaGoogle /> {isLoading ? 'Signing up...' : 'Continue with Google'}
          </button>
        </div>

        <p style={{ fontSize: '14px', color: '#555' }}>
          Already have an account? <a href="/login" style={{ color: '#5867d8', textDecoration: 'none' }}>Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Sign;
