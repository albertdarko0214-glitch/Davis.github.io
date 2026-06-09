import { API_BASE_URL } from "./todosApi";

export interface User {
  id: string;
  name: string;
  email: string;
  auth_provider: "email" | "google";
  avatar_url: string | null;
  created_at: string;
}

type AuthResponse = {
  user: User;
  message: string;
};

const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

async function parseResponse(res: Response): Promise<AuthResponse> {
  const data = (await res.json().catch(() => null)) as { error?: string } | AuthResponse | null;

  if (!res.ok) {
    throw new Error(
      data && "error" in data && typeof data.error === "string"
        ? data.error
        : "Authentication request failed."
    );
  }

  return data as AuthResponse;
}

export async function signupWithEmail(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function signupWithGoogle(credential: string): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });

  return parseResponse(res);
}

// --- THIS IS THE NEWLY FIXED LOGIN FUNCTION ---
export async function loginWithEmail(credentials: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return parseResponse(res);
}