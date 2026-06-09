export {
  signupWithEmail,
  signupWithGoogle,
  type User,
} from "./authApi";

export async function loginWithEmail(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}