<script lang="ts">
  import { goto } from "$app/navigation";

  let firstName = "";
  let lastName = "";
  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = "";

  async function handleSignup(event: Event) {
    event.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      error = "Passwords do not match!";
      return;
    }

    try {
      const response = await fetch(
        "https://project2db-b60469abc86b.herokuapp.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            firstName,
            lastName,
            username,
            email,
            password,
          }),
        },
      );

      if (response.ok) {
        goto("/dashboard"); // Redirect on success
      } else {
        const errorMessage = await response.text();
        error = errorMessage || "Registration failed. Try again.";
      }
    } catch (err) {
      error = "Server error. Please try again later.";
    }
  }
</script>

<div class="flex justify-center items-center h-screen bg-gray-50">
  <div
    class="w-full p-8 m-auto bg-white rounded-lg shadow-lg lg:max-w-md ring-2 ring-green-500/50"
  >
    <h1 class="text-4xl font-extrabold text-center text-green-600">Sign Up</h1>
    <p class="text-center text-gray-500 mt-1">
      Create your account to get started.
    </p>

    <form on:submit={handleSignup} class="space-y-6 mt-4">
      <div>
        <label for="first-name" class="block text-gray-700 font-medium"
          >First Name</label
        >
        <input
          type="text"
          bind:value={firstName}
          required
          id="first-name"
          placeholder="First Name"
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="last-name" class="block text-gray-700 font-medium"
          >Last Name</label
        >
        <input
          type="text"
          bind:value={lastName}
          required
          id="last-name"
          placeholder="Last Name"
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="email" class="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          bind:value={email}
          required
          id="email"
          placeholder="Email Address"
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="username" class="block text-gray-700 font-medium"
          >Username</label
        >
        <input
          type="text"
          bind:value={username}
          required
          id="username"
          placeholder="Choose a Username"
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="password" class="block text-gray-700 font-medium"
          >Password</label
        >
        <input
          type="password"
          bind:value={password}
          required
          id="password"
          placeholder="Enter Password"
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="confirm-password" class="block text-gray-700 font-medium"
          >Confirm Password</label
        >
        <input
          type="password"
          bind:value={confirmPassword}
          required
          id="confirm-password"
          placeholder="Confirm Password"
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <button
          class="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition"
        >
          Create Account
        </button>
      </div>

      <p class="text-sm text-center text-gray-600">
        Already have an account?
        <a href="/login" class="text-green-600 font-bold hover:underline"
          >Login</a
        >
      </p>

      {#if error}
        <p class="text-red-500 text-center">{error}</p>
      {/if}
    </form>
  </div>
</div>