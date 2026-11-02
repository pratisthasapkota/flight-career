import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminAuthError, fetchAdminSession } from "../adminAuth";

type Status = "checking" | "authorized" | "error";

const wrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  fontFamily: "'Poppins', sans-serif",
  background: "#f1f5f9",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  padding: "28px 32px",
  maxWidth: 460,
  width: "100%",
  textAlign: "center",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 16,
  border: "none",
  borderRadius: 8,
  padding: "10px 18px",
  background: "#00509e",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState("");

  const checkSession = useCallback(async () => {
    setStatus("checking");

    try {
      const session = await fetchAdminSession();
      setStatus("authorized");
    } catch (err) {
      const authError = err as AdminAuthError;

      if (authError.status === 401 || authError.status === 403) {
        navigate("/admin/login", {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      setMessage(
        authError.message ||
          "We could not verify your admin session. Please try again."
      );
      setStatus("error");
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (status === "authorized") {
    return <>{children}</>;
  }

  if (status === "error") {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle} role="alert">
          <h2 style={{ marginTop: 0, color: "#0f172a" }}>
            Admin session unavailable
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.5 }}>{message}</p>
          <button type="button" style={buttonStyle} onClick={checkSession}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle} aria-live="polite">
        <p style={{ margin: 0, color: "#475569" }}>Checking admin session...</p>
      </div>
    </div>
  );
};

export default RequireAdmin;
