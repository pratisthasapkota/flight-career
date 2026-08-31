import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const res = await axios.post<{ success: boolean; token: string }>(
        `${backendUrl}/api/admin/login`,
        formData
      );
      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .admin-login-page {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #001a3d 0%, #00509e 50%, #003f7f 100%);
          position: relative;
          overflow: hidden;
        }

        .admin-login-page::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 40% 60%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: admGlow 10s ease-in-out infinite;
        }

        @keyframes admGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        .admin-login-card {
          position: relative;
          background: white;
          border-radius: 16px;
          padding: 45px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: admSlideIn 0.5s ease;
        }

        @keyframes admSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .admin-login-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #001a3d, #00509e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 4px 15px rgba(0,80,158,0.3);
        }

        .admin-login-icon span {
          color: white;
          font-size: 30px;
        }

        .admin-login-card h2 {
          text-align: center;
          color: #001a3d;
          font-size: 1.5rem;
          margin-bottom: 5px;
        }

        .admin-login-card .subtitle {
          text-align: center;
          color: #888;
          font-size: 13px;
          margin-bottom: 30px;
        }

        .admin-form-group {
          margin-bottom: 18px;
        }

        .admin-form-group label {
          display: block;
          font-weight: 600;
          color: #001a3d;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .admin-form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e5ec;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .admin-form-group input:focus {
          border-color: #00509e;
          box-shadow: 0 0 0 3px rgba(0,80,158,0.1);
        }

        .admin-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 15px;
          border: 1px solid #fecaca;
          text-align: center;
        }

        .admin-login-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #00509e, #001a3d);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 5px;
        }

        .admin-login-btn:hover {
          background: linear-gradient(135deg, #003f7f, #001a3d);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,63,127,0.3);
        }

        .admin-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .admin-back-link {
          text-align: center;
          margin-top: 20px;
        }

        .admin-back-link a {
          color: #00509e;
          font-size: 13px;
          text-decoration: none;
          font-weight: 500;
        }

        .admin-back-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .admin-login-card {
            margin: 20px;
            padding: 35px 25px;
          }
        }
      `}</style>

      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <span>&#128737;</span>
          </div>
          <h2>Admin Panel</h2>
          <p className="subtitle">Sign in to manage applications and vacancies</p>

          {error && <div className="admin-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="admin-back-link">
            <a href="/">&#8592; Back to Home</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
