<script lang="ts">
  import { user } from '$lib/auth';
  import { get } from 'svelte/store';
  import { onMount } from "svelte";
  import { v4 as uuid } from "uuid";
  import tippy from '$lib/actions/tippy.svelte';
  import { X } from 'lucide-svelte';
  import { defaultTiers } from './utils';

  let searchQuery = "";
  let searchResults: string[] = [];
  let unassignedItems: { id: string; label: string }[] = [];
  let TIER_ID = 1;
  let currentTier: { tier_id: number; subject: string; start_time: string; end_time: string } | null = null;
  let isTierListWeek = true;
  let hasSubmitted = false;
  let showEditor = false;
  let nextSubmissionDate = "";
  let pageReady = false;


  type TierEntry = {
    entry: string;
    tier: number;
  };

  type TierCategory = {
    tier_id: number;
    subject: string;
    start_time: string;
    end_time: string;
  };

  let tiers = [
    { id: "S", label: "S", color: "#ef4444", items: [] as { id: string, label: string}[] },
    { id: "A", label: "A", color: "#f97316", items: [] },
    { id: "B", label: "B", color: "#eab308", items: [] },
    { id: "C", label: "C", color: "#22c55e", items: [] },
    { id: "D", label: "D", color: "#3b82f6", items: [] },
    { id: "E", label: "E", color: "#6366f1", items: [] },
    { id: "F", label: "F", color: "#d946ef", items: [] }
  ];

  let endTime = new Date();
  endTime.setDate(endTime.getDate() + 2);
  let timer = "";
  let timerInterval: number;

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

  async function fetchTimer() {
    const res = await fetch("https://project2db-b60469abc86b.herokuapp.com/timer");
    const data = await res.json();
    endTime = new Date(data.endOfWeek);
    const nextStart = new Date(data.startOfWeek);
    nextStart.setDate(nextStart.getDate() + 7);
    nextSubmissionDate = nextStart.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    updateTimer();
  }

  async function fetchMode() {
    const res = await fetch("https://project2db-b60469abc86b.herokuapp.com/api/mode"); // or correct route if it exists
    const data = await res.text();
    isTierListWeek = data === "TierListWeek";
  }

  async function fetchUserEntriesThisWeek(userId: number) {
    if (!TIER_ID) return;
    const res = await fetch(`https://project2db-b60469abc86b.herokuapp.com/api/entries/user/${userId}/tier/${TIER_ID}`);
    const entries = await res.json();

    if (entries.length > 0) {
      hasSubmitted = true;
      loadSavedEntries(entries);
    }
  }

  function loadSavedEntries(entries: TierEntry[]) {
    tiers = tiers.map(tier => ({ ...tier, items: [] }));
    unassignedItems = [];

    for (const entry of entries) {
      const label = entry.entry;
      const tierIndex = entry.tier;
      const id = uuid();

      if (tierIndex >= 0 && tierIndex < tiers.length) {
        tiers[tierIndex].items.push({ id, label });
      } else {
        unassignedItems.push({ id, label });
      }
    }
  }

  function handleSearch() {
    if (searchQuery.toLowerCase().includes("pitza")) {
      searchResults = ["Pizza"];
    } else if (searchQuery.trim() !== "") {
      searchResults = [searchQuery];
    } else {
      searchResults = [];
    }
  }

  function addItem(item: string) {
    if (!unassignedItems.some(i => i.label === item)) {
      unassignedItems = [...unassignedItems, { id: uuid(), label: item }];
    }
    searchQuery = "";
    searchResults = [];
  }

  function assignToTier(item: { id: string; label: string }, tierId: string) {
    tiers = tiers.map(t => {
      if (t.id === tierId && !t.items.find(i => i.id === item.id)) {
        return { ...t, items: [...t.items, item] };
      }
      return t;
    });
    unassignedItems = unassignedItems.filter(i => i.id !== item.id);
  }



  function removeItem(item: { id: string; label: string }) {
    const tier = tiers.find(t => t.items.some(i => i.id === item.id));
    if (tier) {
      tier.items = tier.items.filter(i => i.id !== item.id);
    } else {
      unassignedItems = unassignedItems.filter(i => i.id !== item.id);
    }
  }

  function removeFromTier(tierId: string, item: { id: string; label: string }) {
    // reassign the entire tiers array with map
    tiers = tiers.map(t => {
      if (t.id === tierId) {
        // filter out the item
        return { ...t, items: t.items.filter(i => i.id !== item.id) };
      }
      return t;
    });

    // add back to unassigned
    unassignedItems = [...unassignedItems, item];
  }

  function resetTierList() {
    unassignedItems = [];
    tiers = tiers.map(t => ({ ...t, items: [] }));
  }

  async function submitTierList() {
    const currentUser = get(user);
    console.log("Submitting with:", currentUser); // ✅ Add this line here
    
    if (!currentUser) {
      alert("You must be logged in to submit.");
      return;
    }

    const userId = currentUser.id;

    await fetch(`https://project2db-b60469abc86b.herokuapp.com/api/entries/user/${userId}/tier/${TIER_ID}`, {
      method: "DELETE"
    });

    const entries = tiers.flatMap((tier, index) =>
      tier.items.map(item => ({
        user_id: userId,
        tier_id: TIER_ID,
        entry: item.label,
        tier: index 
      }))
    );


    try {
      await Promise.all(
        entries.map(entry =>
          fetch("https://project2db-b60469abc86b.herokuapp.com/api/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry)
          })
        )
      );
      alert("Tier list submitted successfully!");
    } catch (error) {
      console.error("Failed to submit:", error);
      alert("There was an error submitting your tier list.");
    }
  }

  async function fetchCurrentTier() {
    const res = await fetch("https://project2db-b60469abc86b.herokuapp.com/api/tiers");
    const allTiers: TierCategory[] = await res.json();
    const now = new Date();

    currentTier = allTiers.find((tier: TierCategory) => {
      const start = new Date(tier.start_time);
      const end = new Date(tier.end_time);
      return now >= start && now <= end;
    }) || null;

    if (currentTier) {
      TIER_ID = currentTier.tier_id;
      endTime = new Date(currentTier.end_time);
    }
  }

  async function loadPageData() {
    const currentUser = get(user);
    if (!currentUser) return;

    try {
      // 1. Fetch tier and timer data FIRST (in sequence)
      await fetchCurrentTier();
      await fetchTimer();

      // 2. Only fetch mode and user entries if currentTier exists
      if (currentTier) {
        TIER_ID = currentTier.tier_id;

        await fetchMode();
        isTierListWeek = true; // <- FOR DEMO: force it to always show editor COMMENT OUT IN PRODUCTION
        await fetchUserEntriesThisWeek(currentUser.id);
      } else {
        console.warn("No current tier category available.");
      }
    } catch (error) {
      console.error("Failed to load page data:", error);
    }
    pageReady = true;
  }


  onMount(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    loadPageData(); // load all necessary data after mount
  });
</script>

{#snippet item(item: { id: string; label: string })}
  <div class="tier-string">
    <button
      class="badge badge-outline p-3 cursor-pointer"
      use:tippy={() => ({
        content: document.getElementById(`tiers-for-${item.id}`) || undefined,
        onMount: () => {
          const template = document.getElementById(`tiers-for-${item.id}`);
          if (template) {
            template.style.display = 'flex';
          }
        },
        onShown: (instance) => {
          instance.popper.addEventListener('click', () => {
            instance.hide();
          });
        },
        duration: 0,
        trigger: 'click',
        interactive: true,
        placement: 'bottom'
      })}
    >
      {item.label}
    </button>
    <div class="item-tiers" style="display: none" id={`tiers-for-${item.id}`}>
      {#each tiers.filter(t => !t.items.some(i => i.label === item.label)) as tier}
        <button
          aria-label="Add Item to Tier {tier.label}"
          class="tier"
          style="background-color: {tier.color}"
          on:click={() => assignToTier(item, tier.id)}
        >
          {tier.label}
        </button>
      {/each}
      <button
        aria-label="Remove Item"
        class="tier remove"
        on:click={() => removeItem(item)}
      >
        <X />
      </button>
    </div>
  </div>
{/snippet}

{#if !pageReady}
  <div class="text-center mt-12 text-base-content text-xl">Loading...</div>

{:else if !isTierListWeek}
  <div class="text-center mt-12 space-y-4">
    {#if hasSubmitted}
      <p class="text-3xl font-semibold text-success">
        You already submitted your tier list! 🎉
      </p>
      <button class="btn btn-outline btn-success" on:click={() => showEditor = true}>
        Edit Submission
      </button>
    {:else}
      <p class="text-3xl font-medium text-error">
        You've missed the submission window 😢 Come back on {nextSubmissionDate}!
      </p>
    {/if}
  </div>
{:else if !currentTier}
  <div class="text-center mt-12 space-y-4">
    <p class="text-2xl font-medium text-error">No tier list is currently available.</p>
  </div>
{:else if hasSubmitted && !showEditor}
  <div class="text-center mt-12 space-y-4">
    <p class="text-2xl font-semibold text-warning">
      You already completed this week's tier list. Want to change it?
    </p>
    <button class="btn btn-primary" on:click={() => showEditor = true}>
      Edit My Submission
    </button>
  </div>
{:else}
  <!-- Normal tier list creation UI -->
  <div class="container mx-auto max-w-5xl p-6">
    <div class="flex items-center mb-1">
      <h1 class="text-3xl font-bold text-base-content">
        Featured Tier List: <span class="text-stone-400">{currentTier.subject}</span>
      </h1>
      <span class="ml-4 text-xl font-semibold text-green-500 whitespace-nowrap">{timer}</span>
    </div>
    <p class="text-gray-600 text-base-content mt-2">
      Create and edit your weekly tier list until the timer runs out.
    </p>

    <!-- Tier List UI (unchanged from yours, not re-pasted here for brevity) -->
    <!-- ... -->
    <div class="mt-8 space-y-4">
      {#each tiers as tier (tier.id)}
        <div class="flex items-center bg-base-200 rounded-lg shadow">
          <div class="w-20 h-16 flex items-center justify-center font-bold text-white rounded-l text-lg" style="background-color: {tier.color}">
            {tier.label}
          </div>
          <div class="flex-1 flex flex-wrap gap-2 px-4 py-3">
            {#each tier.items as item (item.id)}
            <button
              type="button"
              class="badge badge-outline p-3 cursor-pointer"
              use:tippy={() => ({
                content: `Remove from tier`,
                trigger: 'click',
                onShown(instance) {
                  setTimeout(() => instance.hide(), 1000);
                }
              })}
              on:click={() => removeFromTier(tier.id, item)}
            >
              {item.label} <X class="w-3 h-3 ml-1" />
            </button>        
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-8">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-xl font-semibold text-green-500">Unassigned Items</h2>
        <input
          type="text"
          bind:value={searchQuery}
          on:input={handleSearch}
          on:keypress={(e) => e.key === 'Enter' && searchResults.length > 0 && addItem(searchResults[0])}
          placeholder="Search items"
          class="input input-bordered max-w-md bg-base-100 text-base-content"
          list="search-results"
        />
        <datalist id="search-results">
          {#each searchResults as result}
            <option value={result}></option>
          {/each}
        </datalist>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each unassignedItems as item (item.id)}
          <div class="item-outer">
            <div class="item">
              <div
                class="badge badge-soft badge-success cursor-pointer text-2xl p-6"
                use:tippy={() => ({
                  content: document.getElementById(`tiers-for-${item.id}`) || undefined,
                  onMount: () => {
                    const el = document.getElementById(`tiers-for-${item.id}`);
                    if (el) el.style.display = 'flex';
                  },
                  trigger: 'click',
                  interactive: true,
                  placement: 'bottom'
                })}
              >
                {item.label}
              </div>
              <div class="item-tiers" style="display: none" id={`tiers-for-${item.id}`}>
                {#each tiers as tier}
                  <button class="tier" style="background-color: {tier.color}" on:click={() => assignToTier(item, tier.id)}>
                    {tier.label}
                  </button>
                {/each}
                <button class="tier remove" on:click={() => removeItem(item)}>
                  <X />
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>       
    </div>
  
    <div class="mt-6 flex space-x-4">
      <button on:click={resetTierList} class="btn btn-outline btn-warning">Reset Tier List</button>
      <button class="btn btn-success" on:click={submitTierList}>Submit Tier List</button>
    </div>
  </div>
{/if}

<style lang="scss">
  // Global box-sizing for consistency
  * {
    box-sizing: border-box;
  }

  // Focus outline for accessibility
  button,
  div,
  input {
    &:focus-visible {
      outline: 2px solid var(--primary);
    }
  }

  // Wrapper around each item for tier or unassigned
  .item-outer {
    min-width: 70px;
    width: 10%;
  }

  // Individual item styling including border and layout
  .item {
    border: 1px dashed var(--base-300);
    margin: 2px;
    aspect-ratio: 7;
    position: relative;
    transition: 0.5s;

    &:hover {
      border: 1px dashed var(--primary);
    }

    // Button within item
    > button {
      border: none;
      background-color: grey; // Green background for the button
      color: white; // Ensure text is readable on green
      padding: 25px;
      height: 100%;
      width: 100%; // Ensures full width to center text
      text-align: center; // Centers the text horizontally
      display: flex; // Use flex to center both horizontally and vertically
      align-items: center;
      justify-content: center;
      font-weight: 600;
      cursor: pointer;
      border-radius: 0.375rem; // Optional: matches DaisyUI btn-rounded
    }

    // Dropdown menu that appears when item is clicked
    .item-tiers {
      display: flex;
      flex-direction: row;
      margin: 0 -2px;

      // Remove button inside the tier popup
      .remove {
        background-color: transparent;
        padding: 0;

        :global(svg) {
          stroke: white;
          width: 14px;
        }
      }

      // Buttons representing available tiers
      .tier {
        width: 20px;
        margin: 2px;
        aspect-ratio: 1;
        color: var(--base-content);
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;

        &:hover {
          filter: saturate(5);
        }
      }
    }
  }

  // Overall tier list container styles
  .tiers {
    background-color: var(--base-100);

    .tier {
      display: flex;
      flex-direction: row; // Layout: tier label on the left, items on the right
      align-items: center;
      margin: 2px 0;
      background-color: var(--base-200);
      container-type: inline-size;
      position: relative;

      // Label for each tier (e.g., S, A, B...)
      .label {
        min-width: 74px;
        width: 10%;
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 5cqw;
        color: black; // Always black text regardless of theme
        position: relative;
      }

      // Area where items inside the tier are displayed
      .content {
        flex: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0 4px;
        align-items: center;
      }
    }
  }
</style>