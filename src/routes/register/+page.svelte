<div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-md">
      <h1 class="text-3xl font-semibold text-center text-gray-700">Sign Up</h1>
  
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
            <span class="text-base label-text">Username</span>
          </label>
          <input 
            type="text" 
            placeholder="Choose a Username" 
            class="w-full input input-bordered" 
          />
        </div>
  
        <div>
          <label class="label">
            <span class="text-base label-text">Password</span>
          </label>
          <input 
            type="password" 
            placeholder="Enter Password" 
            class="w-full input input-bordered" 
          />
        </div>

        <div>
          <label class="label">
            <span class="text-base label-text">Confirm Password</span>
          </label>
          <input 
            type="password" 
            placeholder="Confirm Password" 
            class="w-full input input-bordered" 
          />
        </div>

        <div class="flex items-center">
          <input type="checkbox" id="terms" class="checkbox checkbox-neutral" />
          <label for="terms" class="ml-2 text-sm text-gray-600">
            I agree to the <a href="#" class="text-blue-600 hover:underline">Terms & Conditions</a>
          </label>
        </div>
  
        <div>
          <button class="btn btn-neutral btn-block">Create Account</button>
        </div>

        <p class="text-sm text-center text-gray-600">
          Already have an account?
          <a href="/login" class="text-blue-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  </div>
  