import { writable } from "svelte/store";
import { goto } from "$app/navigation";

export const isLoggedIn = writable(false);
export const user = writable<{ firstName: string; lastName: string; username: string } | null>(null);

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch("https://project2db-b60469abc86b.herokuapp.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const userData = await response.json();
      user.set(userData);
      isLoggedIn.set(true);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(userData));
      goto("/dashboard"); // Redirect after login
      return true;
    } else {
      return false; // Login failed
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

export function logout(): void {
  user.set(null);
  isLoggedIn.set(false);
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("user");
  goto("/"); // Redirect to home page after logout
}

if (typeof window !== "undefined" && sessionStorage.getItem("isLoggedIn") === "true") {
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    user.set(JSON.parse(storedUser));
    isLoggedIn.set(true);
  }
}
