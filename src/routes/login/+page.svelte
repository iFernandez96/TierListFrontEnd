<div class="flex justify-center items-center h-screen bg-gray-100">
  <div class="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-md">
    <h1 class="text-3xl font-semibold text-center text-gray-700">Login</h1>

    <form class="space-y-4">
      <div>
        <label class="label">
          <span class="text-base label-text">Email</span>
        </label>
        <input 
          type="text" 
          placeholder="Email Address" 
          class="w-full input input-bordered" 
        />
      </div>

      <div>
        <label class="label">
          <span class="text-base label-text">Password</span>
        </label>
        <input 
          type="password" 
          id="password"
          placeholder="Enter Password" 
          class="w-full input input-bordered" 
        />
        <a href="#" class="text-xs text-gray-600 hover:underline hover:text-blue-600">Forgot Password?</a>
      </div>

      <div class="flex items-center">
        <input type="checkbox" id="rememberMe" class="checkbox checkbox-neutral" />
        <label for="rememberMe" class="ml-2 text-sm text-gray-600">Remember Me</label>
      </div>

      <div>
        <button class="btn btn-neutral btn-block">Login</button>
      </div>

      <p class="text-sm text-center text-gray-600">
        Don't have an account?
        <a href="/register" class="text-blue-600 hover:underline">Sign up</a>
      </p>
    </form>
  </div>
</div>

  <!-- To get more components like this: https://daisyui.com/components/button/ -->
