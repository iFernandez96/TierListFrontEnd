<script lang="ts">
  import "/src/app.css";
  let tierListName = $state("Tier List")
  function changeName() {
     
  }
</script>
<nav class="navbar bg-white shadow-md px-6 py-4">
  <span class="navbar-start">
    <a href="/" class="hover:opacity-80 transition">
      <img src="/rankify_logo.png" alt="Rankify Logo" class="h-16">
    </a>
  </span>
  <span class="navbar-end">
    <a href="/login" class="btn btn-neutral">Login</a>
  </span>
</nav>



<slot />


<footer class="text-white py-4 px-3 mt-16">
    <div class="container mx-auto flex flex-wrap items-center">
        <div class="w-full md:w-1/2 md:text-center md:mb-0 mb-8">
            <p class="text-xs text-gray-400 md:text-sm">Copyright 2025 &copy; All Rights Reserved - Israel Fernandez & Group 4</p>
        </div>
    </div>
</footer>
