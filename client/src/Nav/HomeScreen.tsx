import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaPlane, FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';

const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    email: string;
  };
}

interface LocationState {
  from?: string;
  checkoutState?: unknown;
}

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<LoginResponse>(`${backendUrl}/api/login`, { email, password }, { withCredentials: true });
      const { success, message } = response.data;
      if (success) {
        const state = location.state as LocationState | null;
        navigate(state?.from || "/", {
          state: state?.checkoutState || undefined,
        });
      } else {
        setErrorMsg(message);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response) {
        setErrorMsg(axiosError.response.data.message || "Login failed");
      } else {
        setErrorMsg("Server error. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (): void => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 100px 20px 40px;
          background: linear-gradient(160deg, #000d1f 0%, #001a3d 40%, #002752 100%);
          position: relative;
          overflow: hidden;
          font-family: var(--font-sans);
        }

        .login-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(255, 215, 0, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(58, 123, 213, 0.08) 0%, transparent 50%);
        }

        .login-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: var(--radius-xl);
          padding: 48px 44px;
          max-width: 460px;
          width: 100%;
          min-height: 480px;
          box-shadow: var(--shadow-xl);
          text-align: center;
          position: relative;
          animation: fadeInUp 0.7s ease forwards;
        }

        .login-logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, var(--color-navy-400), var(--color-navy-600));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gold-500);
          font-size: 24px;
          box-shadow: var(--shadow-md);
        }

        .login-card h2 {
          margin-bottom: 6px;
          color: var(--color-text-primary);
          font-weight: 700;
          font-size: 1.6rem;
          letter-spacing: -0.01em;
        }

        .login-subtitle {
          color: var(--color-text-muted);
          font-size: 14px;
          margin-bottom: 30px;
        }

        .login-alert {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          margin-bottom: 18px;
          font-weight: 500;
        }

        .login-alert.error {
          color: #b42318;
          background: #fef3f2;
          border: 1px solid #fecdca;
        }

        .login-alert.success {
          color: #1a7f37;
          background: #ecfdf3;
          border: 1px solid #abefc6;
        }

        .form-field {
          text-align: left;
          margin-bottom: 18px;
        }

        .form-field label {
          font-weight: 500;
          color: var(--color-text-primary);
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          font-size: 14px;
          pointer-events: none;
        }

        .form-field input {
          width: 100%;
          padding: 13px 16px 13px 42px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-surface-dim);
          outline: none;
          font-size: 15px;
          font-family: var(--font-sans);
          color: var(--color-text-primary);
          transition: all var(--transition-fast);
        }

        .form-field input:focus {
          border-color: var(--color-navy-300);
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 80, 158, 0.08);
        }

        .login-submit {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-navy-400), var(--color-navy-600));
          color: white;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all var(--transition-base);
          margin-bottom: 20px;
          font-family: var(--font-sans);
          box-shadow: var(--shadow-md);
        }

        .login-submit:hover {
          background: linear-gradient(135deg, var(--color-navy-600), var(--color-navy-800));
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 20px;
          color: var(--color-text-muted);
          font-size: 12px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 13px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: white;
          color: var(--color-text-primary);
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          transition: all var(--transition-base);
          font-family: var(--font-sans);
          box-shadow: var(--shadow-sm);
        }

        .google-btn:hover {
          background: var(--color-surface-hover);
          border-color: rgba(0, 80, 158, 0.2);
          transform: translateY(-2px);
        }

        .google-btn svg {
          color: #4285f4;
        }

        .login-footer {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin-top: 22px;
        }

        .login-footer a {
          color: var(--color-navy-400);
          text-decoration: none;
          font-weight: 600;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 80px 16px 30px;
          }
          .login-card {
            padding: 36px 24px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <FaPlane />
          </div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue your aviation journey</p>

          {errorMsg && <div className="login-alert error">{errorMsg}</div>}
          {successMsg && <div className="login-alert success">{successMsg}</div>}

          <div className="form-field">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><FaUser /></span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><FaLock /></span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button onClick={handleClick} disabled={isLoading} className="login-submit">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="divider">or continue with</div>

          <button onClick={handleGoogleLogin} className="google-btn">
            <FaGoogle /> Continue with Google
          </button>

          <p className="login-footer">
            Don't have an account? <a href="/sign">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
