export interface AdminUser {
  id: number;
  email: string;
  isAdmin: true;
}

export interface AdminSession {
  user: AdminUser;
  csrfToken: string;
}

export class AdminAuthError extends Error {
  status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}

export const adminBackendUrl = (): string =>
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const getAdminCsrfToken = (): string => {
  const match = document.cookie.match(/(?:^|;\s*)admin_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

export async function fetchAdminSession(): Promise<AdminSession> {
  let response: Response;

  try {
    response = await fetch(`${adminBackendUrl()}/api/admin/session`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new AdminAuthError(
      "Could not reach the server. Check your connection and try again."
    );
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401 || response.status === 403) {
    throw new AdminAuthError(
      data?.message || "Your admin session has expired.",
      response.status
    );
  }

  if (!response.ok || !data?.success || !data?.user) {
    throw new AdminAuthError(
      data?.message || "Could not verify your admin session.",
      response.status
    );
  }

  return { user: data.user as AdminUser, csrfToken: data.csrfToken || "" };
}

/**
 * Fetch wrapper for admin endpoints. Reads the double-submit CSRF token from
 * the cookie and always sends credentials. Callers should treat a 401/403 as
 * an expired session, and all other failures as retryable.
 */
export async function adminFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers.set("X-CSRF-Token", getAdminCsrfToken());
  }

  let response: Response;
  try {
    response = await fetch(`${adminBackendUrl()}${path}`, {
      ...init,
      method,
      credentials: "include",
      headers,
      cache: "no-store",
    });
  } catch {
    throw new AdminAuthError(
      "Could not reach the server. Check your connection and try again."
    );
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401 || response.status === 403) {
    throw new AdminAuthError(
      data?.message || "Your admin session has expired.",
      response.status
    );
  }

  if (!response.ok || !data?.success) {
    throw new AdminAuthError(
      data?.message || "The request could not be completed.",
      response.status
    );
  }

  return data as T;
}
