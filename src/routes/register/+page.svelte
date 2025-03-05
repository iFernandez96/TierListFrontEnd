<div class="flex justify-center items-center h-screen bg-gray-50">
  <div class="w-full p-8 m-auto bg-white rounded-lg shadow-lg lg:max-w-md ring-2 ring-500/50">
    <h1 class="text-4xl font-extrabold text-center text-green-600">Sign Up</h1>
    <p class="text-center text-gray-500 mt-1">Create your account to get started.</p>

    <form class="space-y-6 mt-4">

      <div>
        <label for="email" class="block text-gray-700 font-medium">Email</label>
        <input 
          type="text" 
          id="email"
          placeholder="Email Address" 
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="username" class="block text-gray-700 font-medium">Username</label>
        <input 
          type="text" 
          id="username"
          placeholder="Choose a Username" 
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="password" class="block text-gray-700 font-medium">Password</label>
        <input 
          type="password" 
          id="password"
          placeholder="Enter Password" 
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="confirm-password" class="block text-gray-700 font-medium">Confirm Password</label>
        <input 
          type="password" 
          id="confirm-password"
          placeholder="Confirm Password" 
          class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div class="flex items-center">
        <input type="checkbox" id="terms" class="checkbox checkbox-success" />
        <label for="terms" class="ml-2 text-sm text-gray-600">
          I agree to the <a href="#" class="text-green-600 hover:underline font-semibold">Terms & Conditions</a>
        </label>
      </div>

      <div>
        <button class="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition">
          Create Account
        </button>
      </div>

      <p class="text-sm text-center text-gray-600">
        Already have an account?  
        <a href="/login" class="text-green-600 font-bold hover:underline">Login</a>
      </p>
    </form>
  </div>
</div>
