const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const API_URL: string = `${backendUrl}/api`;
export const OAUTH_URL: string = `${backendUrl}/auth/google`;

interface UserData {
  email?: string;
  [key: string]: unknown;
}

interface MeResponse {
  success: boolean;
  user?: UserData;
}

export async function fetchCurrentUser(): Promise<UserData | null> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/me`, {
      credentials: "include",
    });
  } catch {
    return null;
  }

  if (!res.ok) {
    return null;
  }

  const data: MeResponse = await res.json();
  if (data.success) {
    return data.user ?? null;
  }
  return null;
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore errors on logout
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await fetchCurrentUser();
  return user !== null;
}
