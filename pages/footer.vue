<!-- pages/footer/edit.vue -->
<template>
  <div class="min-h-full bg-gray-900 py-16 px-64">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="isProcessing" />

    <!-- Notification -->
    <Notification
        v-if="showNotification && notificationMessage"
        :key="notificationMessage"
        :message="notificationMessage"
        :type="notificationStatus"
        @close="showNotification = false"
    />

    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-teal-400">Footer Settings</h1>
    </div>

    <!-- Edit Form -->
    <div class="bg-gray-800 border border-gray-700 p-6">
      <form @submit.prevent="saveFooter" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label class="block text-gray-400 mb-2">Email Address</label>
          <input
              v-model="formData.email"
              type="email"
              required
              :disabled="isSaving"
              class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter email address"
          />
        </div>

        <!-- Phone Field -->
        <div>
          <label class="block text-gray-400 mb-2">Phone Number</label>
          <input
              v-model="formData.phone"
              type="text"
              required
              :disabled="isSaving"
              class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter phone number"
          />
        </div>

        <!-- Website Field -->
        <div>
          <label class="block text-gray-400 mb-2">Website URL</label>
          <input
              v-model="formData.website"
              type="url"
              required
              :disabled="isSaving"
              class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter website URL"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
              type="submit"
              :disabled="isSaving"
              class="bg-gray-900 border border-gray-700 text-gray-100 px-6 py-2
                   hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                   focus:outline-none focus:ring-2 focus:ring-teal-500
                   transition-all duration-200 ease-in-out
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center"
          >
            <i class="fas fa-save mr-2"></i>
            <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Last Updated -->
    <div v-if="lastUpdated" class="mt-4 text-right text-sm text-gray-400">
      Last updated: {{ formatDate(lastUpdated) }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '~/components/ui/loading-spinner.vue'
import Notification from '~/components/ui/Notification.vue'

const formData = ref({
  email: '',
  phone: '',
  website: ''
})

const lastUpdated = ref(null)
const isSaving = ref(false)
const isProcessing = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationStatus = ref('success')

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

// Load footer data
const loadFooter = async () => {
  isProcessing.value = true
  try {
    const response = await $fetch('/api/footer')
    formData.value = {
      email: response.email,
      phone: response.phone,
      website: response.website
    }
    lastUpdated.value = response.updatedAt
  } catch (error) {
    console.error('Error loading footer:', error)
    showNotificationMessage('Error loading footer data', 'error')
  } finally {
    isProcessing.value = false
  }
}

// Save footer data
const saveFooter = async () => {
  isSaving.value = true
  try {
    const response = await $fetch('/api/footer', {
      method: 'PUT',
      body: formData.value
    })
    lastUpdated.value = response.updatedAt
    showNotificationMessage('Footer settings saved successfully')
  } catch (error) {
    console.error('Error saving footer:', error)
    showNotificationMessage('Error saving footer settings', 'error')
  } finally {
    isSaving.value = false
  }
}

// Show notification
const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message
  notificationStatus.value = type
  showNotification.value = true
}

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// Initialize
onMounted(() => {
  loadFooter()
})
</script>