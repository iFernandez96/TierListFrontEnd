<script lang="ts">
    import { user } from "../../lib/auth";
    import { onMount } from "svelte";

    onMount(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") || "light";
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    });
  </script>
  
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold">Welcome, {$user?.username}!</h1>
    <p class="text-gray-600">This is your dashboard. You can access your tier lists here.</p>
  </div>
  