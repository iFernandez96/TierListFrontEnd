<script lang="ts">
  import "/src/app.css";
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
