<script lang="ts">
  import { user } from "../../lib/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Calculate the beginning and end of the current week
  const getWeekDateRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is sunday, 1 is monday, etc.
    
    const beginningOfWeek = new Date(now);
    beginningOfWeek.setDate(now.getDate() - dayOfWeek);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(beginningOfWeek.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };
    
    return `${formatDate(beginningOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  const weekDateRange = getWeekDateRange();

  // hardcoded, these would be fetched from the backend.
  let currentTierList: { week: string; summary: string } | null = {
    week: "Week 10",
    summary: "Your movies tier list for this week."
  };
  let pastTierLists = [
    { id: 1, week: "Week 9", title: "Movies Tier List" },
    { id: 2, week: "Week 8", title: "Music Tier List" }
  ];

  onMount(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  });
</script>

<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold text-base-content">
    {#if $user}
      Welcome, {$user.firstName}!
    {:else}
      Welcome!
    {/if}
  </h1>  
  <p class="text-gray-600 text-base-content">
    Rankify Dashboard
  </p>

  <div class="mt-8">
    <h2 class="text-2xl font-semibold text-green-500">
      This Week's Tier List: <span class="text-stone-400">{weekDateRange}</span>
    </h2>
    {#if currentTierList}
      <div class="card bg-base-100 shadow-lg mt-4 cursor-pointer" on:click={() => goto("/featured")}>
        <div class="card-body">
          <h3 class="card-title">Edit Your Tier List</h3>
          <p>{currentTierList.week}</p>
          <p>{currentTierList.summary}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-success">Edit</button>
          </div>
        </div>
      </div>
    {:else}
      <div class="card bg-base-100 shadow-lg mt-4 cursor-pointer" on:click={() => goto("/featured")}>
        <div class="card-body">
          <h3 class="card-title">No Tier List Yet</h3>
          <p>Create your tier list for this week now!</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Create</button>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="mt-8">
    <h2 class="text-2xl font-semibold text-green-500">Past Tier Lists</h2>
    {#if pastTierLists.length > 0}
      <div class="grid grid-cols-1 gap-4 mt-4">
        {#each pastTierLists as list}
          <div class="card bg-base-100 border border-base-300 shadow-lg rounded-md cursor-pointer" on:click={() => goto(`/past/${list.id}`)}>
            <div class="card-body">
              <h3 class="card-title">{list.title}</h3>
              <p>{list.week}</p>
              <div class="card-actions justify-end space-x-2">
                <button class="btn btn-outline btn-sm">Download</button>
                <button class="btn btn-outline btn-sm">Share</button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="mt-4 text-center text-base-content">No past tier lists available.</p>
    {/if}
  </div>
</div>
