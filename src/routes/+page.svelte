<script lang="ts">
  import { onMount } from "svelte";
  import { isLoggedIn } from "../lib/auth"; // Import authentication state
  import { goto } from "$app/navigation";

  function handleStart() {
    if ($isLoggedIn) {
      goto("/dashboard"); // If logged in, go to dashboard
    } else {
      goto("/login"); // If not logged in, go to login page
    }
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  });
</script>

<div class="flex flex-col justify-center items-center h-screen bg-base-200">
  <h1 class="text-4xl font-bold text-base-content text-center">Welcome to Rankify</h1>
  <p class="text-lg text-base-content text-center mt-2">
    Create, rank, and explore tier lists with the community 🏆
  </p>

  <div class="mt-6 flex space-x-4">
    <button on:click={handleStart} class="btn btn-success">
      Start Your First Tier List Now!
    </button>
  </div>
</div>
