// pages/login.vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '~/components/ui/loading-spinner.vue'
import Notification from '~/components/ui/Notification.vue'

const router = useRouter()

// Состояния формы
const username = ref('')
const password = ref('')
const isLoading = ref(false)

// Состояния уведомления
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationStatus = ref('error')

// Метаданные страницы
definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

// Проверка аутентификации при загрузке
const { isAuthenticated } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/')
  }
})

// Показ уведомления
const showError = (message) => {
  isLoading.value = false // Сначала убираем спиннер
  console.log('message', message)

  // Затем показываем уведомление
  notificationMessage.value = message
  notificationStatus.value = 'error'
  showNotification.value = true
}

// Обработка входа
const handleLogin = async () => {
  // Сбрасываем состояние уведомления при новой попытке
  showNotification.value = false

  if (!username.value || !password.value) {
    notificationMessage.value = 'Please fill in all fields'
    notificationStatus.value = 'error'
    showNotification.value = true
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (response.success) {
      router.push('/')
    }
  } catch (error) {
    console.error('Login failed:', error)

    // Обработка различных типов ошибок
    if (error.response) {
      if (error.response.status === 401) {
        showError('Invalid username or password')
      } else if (error.response._data && error.response._data.statusMessage) {
        showError(error.response._data.statusMessage)
      } else {
        showError('Server error. Please try again later.')
      }
    } else if (error.message) {
      showError(error.message)
      console.log(error)
    } else {
      showError('An error occurred during login. Please try again.')
    }
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
    <!-- Спиннер загрузки -->
    <LoadingSpinner v-if="isLoading" />

    <div class="max-w-md w-full mx-auto space-y-8 bg-gray-800 p-8 shadow-2xl transform transition-all duration-500">
      <!-- Заголовок -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-teal-400">
          Welcome Back
        </h2>
        <p class="mt-4 text-center text-sm text-gray-400">
          Sign in to your account
        </p>
      </div>

      <!-- Форма -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="-space-y-px">
          <!-- Username поле -->
          <div class="mb-4">
            <label for="username" class="sr-only">Username</label>
            <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                required
                :disabled="isLoading"
                class="block w-full px-3 py-3 border border-gray-700 bg-gray-700/50 placeholder-gray-400 text-gray-100
                     focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                     transition-all duration-300 ease-in-out
                     disabled:opacity-50"
                placeholder="Username"
            />
          </div>

          <!-- Password поле -->
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                :disabled="isLoading"
                class="block w-full px-3 py-3 border border-gray-700 bg-gray-700/50 placeholder-gray-400 text-gray-100
                     focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                     transition-all duration-300 ease-in-out
                     disabled:opacity-50"
                placeholder="Password"
            />
          </div>
        </div>

        <!-- Кнопка входа -->
        <div class="relative">
          <div
              class="absolute -inset-1 bg-gradient-to-r from-teal-600 to-teal-400 opacity-20
                   group-hover:opacity-50 transition-all duration-1000 group-hover:duration-200"
          ></div>
          <button
              type="submit"
              :disabled="isLoading"
              class="relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium
                   text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transform transition-all duration-500
                   ease-out hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Sign in</span>
            <span v-else class="flex items-center">
              Loading...
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- Уведомление об ошибке -->
    <Notification
        v-if="showNotification && notificationMessage"
        :key="notificationMessage"
        :message="notificationMessage"
        :type="notificationStatus"
        @close="showNotification = false"
    />
  </div>
</template>