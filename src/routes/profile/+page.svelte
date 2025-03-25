<script lang="ts">
    import { user } from "$lib/auth";
    import { onMount } from "svelte";
  
    // Editable user data
    let editable = {
      firstName: "",
      lastName: "",
      username: "",
      email: ""
    };
  
    let message = "";
  
    // populate editable fields when $user is ready
    $: if ($user) {
      editable.firstName = $user.firstName;
      editable.lastName = $user.lastName;
      editable.username = $user.username || "";
      editable.email = $user.email || "";
    }
  
    // Save profile changes
    async function handleSave() {
      if (!$user) return;
  
      try {
        const response = await fetch(
          `https://project2db-b60469abc86b.herokuapp.com/api/auth/update/${$user.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editable),
          }
        );
  
        const resultText = await response.text();
        console.log("PUT result:", response.status, resultText);
  
        if (response.ok) {
          message = "Profile updated successfully!";
        } else {
          message = "Error updating profile: " + resultText;
        }
      } catch (err) {
        console.error("Server error:", err);
        message = "Server error. Please try again.";
      }
    }
  
    onMount(() => {
      if (!$user) {
        message = "Not logged in.";
      }
    });
  </script>
  
  <div class="container mx-auto max-w-xl p-6">
    <h1 class="text-3xl font-bold mb-4">Edit Profile</h1>
  
    {#if $user}
      <div class="space-y-4">
        <div>
          <label class="block text-gray-600 font-semibold">First Name</label>
          <input
            class="input input-bordered w-full"
            bind:value={editable.firstName}
          />
        </div>
  
        <div>
          <label class="block text-gray-600 font-semibold">Last Name</label>
          <input
            class="input input-bordered w-full"
            bind:value={editable.lastName}
          />
        </div>
  
        <div>
          <label class="block text-gray-600 font-semibold">Username</label>
          <input
            class="input input-bordered w-full"
            bind:value={editable.username}
          />
        </div>
  
        <div>
          <label class="block text-gray-600 font-semibold">Email</label>
          <input
            class="input input-bordered w-full"
            bind:value={editable.email}
          />
        </div>
  
        <button class="btn btn-success" on:click={handleSave}>Save Changes</button>
  
        {#if message}
          <p class="mt-4 text-green-500 font-semibold">{message}</p>
        {/if}
      </div>
    {:else}
      <p>Loading user info...</p>
    {/if}
  </div>
  