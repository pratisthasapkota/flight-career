import React, { useState } from 'react';
import { FaGoogle, FaPlane, FaUser, FaLock, FaUserPlus } from "react-icons/fa";
import axios from 'axios';

interface SignUpResponse {
  success: boolean;
  message?: string;
}

const Sign: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleGoogleLogin = (): void => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleClick = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter your email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<SignUpResponse>(`${backendUrl}/api/sign`, {
        email,
        password
      });

      if (response.data.success) {
        setSuccessMsg(response.data.message || "Sign up successful!");
        setEmail("");
        setPassword("");
      } else {
        setErrorMsg(response.data.message || "Something went wrong");
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setErrorMsg(axiosError.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const seeClick = (): void => {
    handleGoogleLogin();
  };

  return (
    <>
      <style>{`
        .signup-page {
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

        .signup-page::before {
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

        .signup-card {
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

        .signup-logo {
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

        .signup-card h2 {
          margin-bottom: 6px;
          color: var(--color-text-primary);
          font-weight: 700;
          font-size: 1.6rem;
          letter-spacing: -0.01em;
        }

        .signup-subtitle {
          color: var(--color-text-muted);
          font-size: 14px;
          margin-bottom: 30px;
        }

        .signup-alert {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          margin-bottom: 18px;
          font-weight: 500;
        }

        .signup-alert.error {
          color: #b42318;
          background: #fef3f2;
          border: 1px solid #fecdca;
        }

        .signup-alert.success {
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

        .signup-submit {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .signup-submit:hover {
          background: linear-gradient(135deg, var(--color-navy-600), var(--color-navy-800));
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .signup-submit:disabled {
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

        .signup-footer {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin-top: 22px;
        }

        .signup-footer a {
          color: var(--color-navy-400);
          text-decoration: none;
          font-weight: 600;
        }

        .signup-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .signup-page {
            padding: 80px 16px 30px;
          }
          .signup-card {
            padding: 36px 24px;
          }
        }
      `}</style>

      <div className="signup-page">
        <div className="signup-card">
          <div className="signup-logo">
            <FaPlane />
          </div>
          <h2>Create Account</h2>
          <p className="signup-subtitle">Join AeroCareers and start your journey</p>

          {errorMsg && <div className="signup-alert error">{errorMsg}</div>}
          {successMsg && <div className="signup-alert success">{successMsg}</div>}

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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button onClick={handleClick} disabled={isLoading} className="signup-submit">
            {isLoading ? 'Signing up...' : <><FaUserPlus /> Sign Up</>}
          </button>

          <div className="divider">or continue with</div>

          <button onClick={seeClick} className="google-btn" disabled={isLoading}>
            <FaGoogle /> {isLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <p className="signup-footer">
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Sign;
