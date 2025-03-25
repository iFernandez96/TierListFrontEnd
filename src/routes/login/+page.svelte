<script lang="ts">
  import { login } from "../../lib/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let username = "";
  let password = "";
  let errorMessage = "";

  async function handleLogin(event: Event) {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://project2db-b60469abc86b.herokuapp.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensures cookies/session handling
          body: JSON.stringify({ username, password }),
        },
      );

      if (response.ok) {
        goto("/dashboard"); // Redirect only if login is successful
      } else {
        const errorText = await response.text();
        errorMessage =
          errorText || "Login failed. Please check your credentials.";
      }
    } catch (error) {
      errorMessage = "Server error. Please try again later.";
    }
  }

  // Ensure theme is applied correctly on page load
  onMount(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  });
</script>

<div class="flex justify-center items-center h-screen bg-base-200">
  <div
    class="w-full p-8 m-auto bg-base-100 rounded-lg shadow-lg lg:max-w-md lg:w-full"
  >
    <h1 class="text-4xl font-extrabold text-center text-green-500">Login</h1>
    <p class="text-center text-base-content mt-1">
      Welcome back! Please enter your details.
    </p>

    <form class="space-y-6 mt-4" on:submit={handleLogin}>
      <div>
        <label for="username" class="block text-base-content font-medium"
          >Username</label
        >
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="Enter Username"
          class="w-full mt-1 px-4 py-2 border border-base-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none bg-base-100 text-base-content"
        />
      </div>

      <div>
        <label for="password" class="block text-base-content font-medium"
          >Password</label
        >
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter Password"
          class="w-full mt-1 px-4 py-2 border border-base-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none bg-base-100 text-base-content"
        />
        <a
          href="/forgot-password"
          class="text-sm text-green-500 hover:underline block mt-2 text-right"
          >Forgot Password?</a
        >
      </div>

      {#if errorMessage}
        <p class="text-red-500 text-center font-semibold">{errorMessage}</p>
      {/if}

      <div class="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          class="checkbox checkbox-success"
        />
        <label for="rememberMe" class="ml-2 text-sm text-base-content"
          >Remember Me</label
        >
      </div>

      <div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition"
        >
          Sign In
        </button>
      </div>

      <p class="text-sm text-center text-base-content">
        Don't have an account?
        <a href="/register" class="text-green-500 font-bold hover:underline"
          >Sign up</a
        >
      </p>
    </form>
  </div>
</div>
