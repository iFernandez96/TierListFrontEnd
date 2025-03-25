import { writable } from "svelte/store";
import { goto } from "$app/navigation";

export const isLoggedIn = writable(false);
export const user = writable<{
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
} | null>(null);

const API = "https://project2db-b60469abc86b.herokuapp.com/api/auth";

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      console.log("Login failed (bad response)", res.status);
      return false;
    }

    const userData = await res.json();

    sessionStorage.setItem("username", userData.username);
    user.set(userData);
    isLoggedIn.set(true);

    goto("/dashboard");
    return true;
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
}

export function logout() {
  user.set(null);
  isLoggedIn.set(false);
  sessionStorage.removeItem("username");
  goto("/");
}

export async function fetchAndSetUser(username: string) {
  try {
    const res = await fetch(`${API}/user?username=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error("User not found");

    const userData = await res.json();
    user.set(userData);
    isLoggedIn.set(true);
  } catch (err) {
    console.error("Auto-login failed:", err);
    logout();
  }
}

// Auto-run on app startup (e.g. page reloads)
if (typeof window !== "undefined") {
  const saved = sessionStorage.getItem("username");
  if (saved) {
    fetchAndSetUser(saved); // <-- pulls user data from backend and updates stores
  }
}
