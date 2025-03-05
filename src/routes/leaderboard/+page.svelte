<script lang="ts">
    import { onMount } from "svelte";
    import { fetchData } from "$lib/api.js";

    let leaderboard = [
      { rank: 1, username: "MockUser", totalLikes: 100 }
    ]; // Placeholder data
  
    async function loadLeaderboard() {
      const data = await fetchData("/api/leaderboard");
      if (data) {
        leaderboard = data;
      }
    }
  
    function getRankIcon(rank: number) {
      if (rank === 1) return "🥇";
      if (rank === 2) return "🥈";
      if (rank === 3) return "🥉";
      return `${rank}.`;
    }

    onMount(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") || "light";
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
        loadLeaderboard();
    });
</script>

<div class="container mx-auto p-6 bg-base-200 min-h-screen">
    <h1 class="text-3xl font-bold text-base-content text-center">Leaderboard 🏆</h1>

    <div class="mt-6 space-y-4">
      {#each leaderboard as user, i}
        <div class="p-4 bg-base-100 border border-base-300 shadow-lg rounded-md flex justify-between text-base-content">
          <span>{getRankIcon(i + 1)} @{user.username}</span>
          <span>❤️ {user.totalLikes} Likes</span>
        </div>
      {/each}
    </div>
</div>
