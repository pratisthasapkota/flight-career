const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("token");
}

export function setAuth({ token, email }) {
  if (token) localStorage.setItem("token", token);
  if (email) localStorage.setItem("email", email);
}

export function getEmail() {
  return localStorage.getItem("email");
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
}

export function isLoggedIn() {
  return !!(localStorage.getItem("token") || localStorage.getItem("email"));
}

export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${backendUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    clearAuth();
    return null;
  }

  const data = await res.json();
  if (data.success) {
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user?.email) localStorage.setItem("email", data.user.email);
    return data.user;
  }
  clearAuth();
  return null;
}
