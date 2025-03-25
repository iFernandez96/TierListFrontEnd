<script lang="ts">
  import "../lib/auth"; // ✅ triggers store logic on app load
  import { onMount } from "svelte";
  import { isLoggedIn, logout, user } from "../lib/auth"; // 👈 added `user`
  import "/src/app.css";

  let showDropdown = false;

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function toggleTheme(event: Event) {
    const target = event.target as HTMLInputElement;
    const theme = target.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // restore theme from local storage on page load
  onMount(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
      const checkbox = document.querySelector(".theme-controller") as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = savedTheme === "dark";
      }
    }
  });
</script>

<nav class="navbar bg-white shadow-md px-6 py-4 flex justify-between sticky top-0 z-50">
  <div class="flex items-center space-x-6">
    <a href="/" class="hover:opacity-80 transition">
      <img src="/rankify_logo.png" alt="Rankify Logo" class="h-16">
    </a>

    {#if $isLoggedIn}
      <div class="flex space-x-2">
        <a href="/dashboard" class="text-neutral text-lg px-3 hover:text-green-500 focus:outline-none">Dashboard</a>
        <a href="/featured" class="text-neutral text-lg px-3 hover:text-green-500 focus:outline-none">Featured</a>
      </div>
    {/if}
  </div>

  <div class="relative dropdown-container">
    {#if $isLoggedIn}
      <div class="flex items-center space-x-5 cursor-pointer" on:click={toggleDropdown}>
        {#if $user}
          <span class="text-base text-neutral font-medium hidden md:inline">
            {$user.firstName}
          </span>
        {/if}
        <div class="avatar">
          <div class="w-12 h-12 rounded-full ring ring-green-500 ring-offset-2">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User Avatar" />
          </div>
        </div>
      </div>

      {#if showDropdown}
        <div class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <div class="px-4 py-2 text-sm text-gray-500 border-b">
            {#if $user}
              Signed in as<br />
              <span class="font-semibold text-black">{$user.firstName}</span>
            {/if}
          </div>
          <a href="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</a>
          <button on:click={logout} class="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Sign Out</button>
        </div>
      {/if}
    {:else}
      <a href="/login" class="text-neutral text-lg px-3 hover:text-green-500 focus:outline-none">Login</a>
    {/if}
  </div>
</nav>

<slot />

<!-- Theme Switcher -->
<div class="fixed bottom-5 right-5">
  <label class="swap swap-rotate">
    <input type="checkbox" class="theme-controller" on:change={toggleTheme} />

    <svg class="swap-off h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
      />
    </svg>

    <svg class="swap-on h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
      />
    </svg>
  </label>
</div>
