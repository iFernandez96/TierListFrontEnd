<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Variables for search and tier list
  let searchQuery = "";
  let searchResults: string[] = [];
  let tierListItems: string[] = [];

  // Set an example end time for the week (here, 2 days from now)
  let endTime = new Date();
  endTime.setDate(endTime.getDate() + 2);
  let timer = "";

  // Update timer every second
  function updateTimer() {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    if (diff <= 0) {
      timer = "Time is up!";
      clearInterval(timerInterval);
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    timer = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  }
  let timerInterval: number;

  // Search handler for fuzzy matching
  function handleSearch() {
    if (searchQuery.toLowerCase().includes("pitza")) {
      searchResults = ["Pizza"];
    } else if (searchQuery.trim() !== "") {
      // For demo reasons just return the search query
      searchResults = [searchQuery];
    } else {
      searchResults = [];
    }
  }

  // Add an item to the tier list if not already present
  function addItem(item: string) {
    if (!tierListItems.includes(item)) {
      tierListItems = [...tierListItems, item];
    }
    searchQuery = "";
    searchResults = [];
  }

  // Reset the current tier list
  function resetTierList() {
    tierListItems = [];
  }

  // Placeholder for auto-saving: in a real app, you would call an API
  function autoSaveTierList() {
    // e.g., call fetch() to save tierListItems asynchronously
    console.log("Auto-saving:", tierListItems);
  }

  // Setup the timer and theme on mount
  onMount(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  });
</script>

<div class="container mx-auto p-6">
  <!-- header -->
  <div class="flex items-center mb-1">
    <h1 class="text-3xl font-bold text-base-content">Featured Tier List: <span class="text-stone-400">Movies</span></h1>
    <span class="ml-4 text-xl font-semibold text-green-500 whitespace-nowrap">{timer}</span>
  </div>
  <p class="text-gray-600 text-base-content mt-2">
    Create and edit your weekly tier list until the timer runs out.
  </p>

  <!-- place hodler for israels version of tier list -->
  <div class="mt-8">
    <h2 class="text-2xl font-semibold text-green-500">Your Tier List</h2>
    <div class="mt-4 space-y-2">
      {#each tierListItems as item, index}
        <div class="card bg-base-100 border border-base-300 shadow-lg rounded-md text-base-content">
          <div class="card-body">
            <span>{index + 1}. {item}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- search bar -->
  <div class="mt-6">
    <input
      type="text"
      bind:value={searchQuery}
      on:input={handleSearch}
      placeholder="Search items"
      class="input input-bordered w-full max-w-md bg-base-100 text-base-content"
    />
  </div>

  <!-- display search results -->
  {#if searchResults.length > 0}
    <div class="mt-2">
      <div class="flex space-x-2">
        {#each searchResults as result}
          <button on:click={() => addItem(result)} class="btn btn-sm btn-primary">
            {result}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- buttons -->
  <div class="mt-6 flex space-x-4">
    <button on:click={resetTierList} class="btn btn-outline btn-warning">Reset Tier List</button>
    <button class="btn btn-success" on:click={autoSaveTierList}>Submit Tier List</button>
  </div>
</div>
