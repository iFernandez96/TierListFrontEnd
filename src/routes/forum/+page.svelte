<script>
    import { onMount } from "svelte";
    import { fetchData } from "$lib/api.js";

    let category = "Movies"; // default for now
    let tierLists = [
      { id: 1, title: "Mock Tier List", user: "TestUser", likes: 5 }
    ]; // placeholder data
  
    async function loadTierLists() {
      const data = await fetchData(`/api/forum/${category.toLowerCase()}`);
      if (data) {
        tierLists = data;
      }
    }

    // fucntion to update category
    function updateCategory() {
      loadTierLists(); // Calls API (when backend is ready)
    }

    onMount(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") || "light";
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
        loadTierLists();
    });
</script>

<div class="container mx-auto p-6 bg-base-200 min-h-screen">
    <h1 class="text-3xl font-bold text-base-content text-center">Community Forum 🏆</h1>

    <div class="flex justify-center mt-4">
      <select class="select select-bordered bg-base-100 border-base-300 text-base-content" bind:value={category} on:change={updateCategory}>
        <option>Movies</option>
        <option>Music</option>
        <option>Games</option>
        <option>Food</option>
        <option>Sports</option>
      </select>
    </div>

    <div class="mt-6 space-y-4">
      {#each tierLists as list}
        <div class="p-4 bg-base-100 border border-base-300 shadow-lg rounded-md flex justify-between text-base-content">
          <span>📊 {list.title} (by @{list.user})</span>
          <button class="btn btn-outline border-base-300 text-base-content">❤️ {list.likes}</button>
        </div>
      {/each}
    </div>
</div>
