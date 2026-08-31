import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { fetchCurrentUser, isLoggedIn } from "../auth";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [status, setStatus] = useState<string>("loading");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!isLoggedIn()) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }

      const user = await fetchCurrentUser();
      if (cancelled) return;
      setStatus(user ? "authenticated" : "unauthenticated");
    };

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
