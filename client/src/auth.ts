const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const API_URL: string = `${backendUrl}/api`;
export const OAUTH_URL: string = `${backendUrl}/auth/google`;

interface AuthData {
  token?: string;
  email?: string;
  name?: string;
}

interface UserData {
  email?: string;
  [key: string]: unknown;
}

interface MeResponse {
  success: boolean;
  token?: string;
  user?: UserData;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setAuth({ token, email, name }: AuthData): void {
  if (token) localStorage.setItem("token", token);
  if (email) localStorage.setItem("email", email);
  if (name) localStorage.setItem("name", name);
}

export function getEmail(): string | null {
  return localStorage.getItem("email");
}

export function clearAuth(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

export async function fetchCurrentUser(): Promise<UserData | null> {
  const token = getToken();
  if (!token) return null;

  let res: Response;
  try {
    res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    clearAuth();
    return null;
  }

  if (!res.ok) {
    clearAuth();
    return null;
  }

  const data: MeResponse = await res.json();
  if (data.success) {
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user?.email) localStorage.setItem("email", data.user.email);
    return data.user ?? null;
  }
  clearAuth();
  return null;
}
