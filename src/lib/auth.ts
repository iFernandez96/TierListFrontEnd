import { writable } from "svelte/store";
import { goto } from "$app/navigation";

export const isLoggedIn = writable(false);
export const user = writable<{ username: string } | null>(null);

// hardcoded for demo purposes
const HARDCODED_USER = {
  username: "TestUser",
  password: "TestPassword"
};

export function login(username: string, password: string): boolean {
  if (username === HARDCODED_USER.username && password === HARDCODED_USER.password) {
    user.set({ username });
    isLoggedIn.set(true);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("username", username);
    return true;
  }
  return false;
}

export function logout(): void {
  user.set(null);
  isLoggedIn.set(false);
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("username");
  goto("/"); // redirect to home page after logout
}

// restoring session
if (typeof window !== "undefined" && sessionStorage.getItem("isLoggedIn") === "true") {
  user.set({ username: sessionStorage.getItem("username") || "" });
  isLoggedIn.set(true);
}
