import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // For routing
import App from './App'; // Import the main App component
import './index.css'; // Import global styles if any

import { GoogleOAuthProvider } from '@react-oauth/google';

// Create the root element for rendering in React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in BrowserRouter
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
