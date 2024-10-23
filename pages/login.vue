<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
    <div
        class="max-w-md w-full mx-auto space-y-8 bg-gray-800 p-8 shadow-2xl transform transition-all duration-500"
    >
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-teal-400">
          Welcome Back
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Sign in to your account
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="-space-y-px">
          <div class="mb-4">
            <label for="username" class="sr-only">Username</label>
            <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                required
                class="block w-full px-3 py-3 border border-gray-700 bg-gray-700/50 placeholder-gray-400 text-gray-100
                       focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                       transition-all duration-300 ease-in-out"
                placeholder="Username"
            />
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="block w-full px-3 py-3 border border-gray-700 bg-gray-700/50 placeholder-gray-400 text-gray-100
                       focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                       transition-all duration-300 ease-in-out"
                placeholder="Password"
            />
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-teal-600 to-teal-400 opacity-20 group-hover:opacity-50 transition-all duration-1000 group-hover:duration-200"></div>
          <button
              type="submit"
              class="relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white
                     bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400
                     focus:outline-none focus:ring-2 focus:ring-teal-500
                     transform transition-all duration-500 ease-out
                     hover:shadow-lg hover:shadow-teal-500/25
                     active:scale-[0.98]"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const username = ref('')
const password = ref('')

definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const handleLogin = async () => {
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (response.success) {
      localStorage.setItem('dashboard_token', response.token)
      router.push('/')
    }
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials.')
  }
}
</script>