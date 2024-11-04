<template>
  <div class="min-h-full bg-gray-900 py-16 px-64">
    <!-- Loading Spinner -->

    <ConfirmDialog
        v-model="showConfirmDialog"
        :title="confirmDialogTitle"
        :message="confirmDialogMessage"
        :loading="isSaving"
        :type="confirmDialogType"
        @confirm="handleConfirmAction"
    />

    <LoadingSpinner v-if="isSaving" />

    <!-- Notification -->
    <Notification
        v-if="showNotification"
        :message="notificationMessage"
        :type="notificationStatus"
        @close="showNotification = false"
    />

    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-teal-400">Jobs Manager</h1>
      <button
          @click="handleAddClick"
          class="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2
               hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
               transition-all duration-200 ease-in-out flex items-center"
      >
        <i class="fas fa-plus mr-2"></i>
        Add Vacancy
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-400 py-8">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
      <p class="mt-2">Loading vacancies...</p>
    </div>

    <template v-else>
      <!-- Create/Edit Form -->
      <div v-if="showCreateForm" class="bg-gray-800 border border-gray-700 p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-teal-400">
            {{ isEditing ? 'Edit Vacancy' : 'Create New Vacancy' }}
          </h2>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <!-- English Section -->
          <div>
            <h2 class="text-lg font-semibold text-teal-400 mb-4">English</h2>
            <div class="mb-4">
              <label class="block text-gray-400 mb-2">Title</label>
              <input
                  v-model="formData.content.en.title"
                  type="text"
                  :disabled="isSaving"
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-2">File</label>
              <select
                  v-model="formData.content.en.file"
                  :disabled="isSaving"
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option :value="null">Select file</option>
                <option
                    v-for="file in files"
                    :key="file.pathname"
                    :value="{ url: file.url, pathname: file.pathname, contentType: file.contentType }"
                >
                  {{ getFileName(file.pathname) }}
                </option>
              </select>
              <div v-if="formData.content.en.file" class="text-sm text-gray-400 mt-1">
                Selected: {{ getFileName(formData.content.en.file.pathname) }}
              </div>
            </div>
          </div>

          <!-- German Section -->
          <div>
            <h2 class="text-lg font-semibold text-teal-400 mb-4">German</h2>
            <div class="mb-4">
              <label class="block text-gray-400 mb-2">Title</label>
              <input
                  v-model="formData.content.de.title"
                  type="text"
                  :disabled="isSaving"
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-2">File</label>
              <select
                  v-model="formData.content.de.file"
                  :disabled="isSaving"
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option :value="null">Select file</option>
                <option
                    v-for="file in files"
                    :key="file.pathname"
                    :value="{ url: file.url, pathname: file.pathname, contentType: file.contentType }"
                >
                  {{ getFileName(file.pathname) }}
                </option>
              </select>
              <div v-if="formData.content.de.file" class="text-sm text-gray-400 mt-1">
                Selected: {{ getFileName(formData.content.de.file.pathname) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 mt-6">
          <button
              @click="cancelEdit"
              :disabled="isSaving"
              class="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
              @click="saveVacancy"
              :disabled="isSaving"
              class="bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2
                   hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                   focus:outline-none focus:ring-2 focus:ring-teal-500
                   transition-all duration-200 ease-in-out
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center"
          >
            <span>{{ isEditing ? 'Update' : 'Save' }} Vacancy</span>
          </button>
        </div>
      </div>

      <!-- Vacancies List -->
      <div class="bg-gray-800 border border-gray-700">
        <div class="p-4 border-b border-gray-700">
          <div class="grid grid-cols-12 text-sm font-medium text-gray-400">
            <div class="col-span-4">English Title</div>
            <div class="col-span-4">German Title</div>
            <div class="col-span-2">Created</div>
            <div class="col-span-2">Actions</div>
          </div>
        </div>

        <div class="divide-y divide-gray-700">
          <div
              v-for="vacancy in vacancies"
              :key="vacancy._id"
              class="p-4 hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div class="grid grid-cols-12 items-center">
              <div class="col-span-4 text-gray-200">
                {{ vacancy.content.en.title }}
              </div>
              <div class="col-span-4 text-gray-200">
                {{ vacancy.content.de.title }}
              </div>
              <div class="col-span-2 text-gray-400">
                {{ formatDate(vacancy.createdAt) }}
              </div>
              <div class="col-span-2 flex space-x-3">
                <button
                    @click="() => editVacancy(vacancy)"
                    :disabled="isSaving"
                    class="text-gray-400 hover:text-teal-400 transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                    @click="() => deleteVacancy(vacancy)"
                    :disabled="isSaving"
                    class="text-gray-400 hover:text-red-400 transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="vacancies.length === 0" class="p-8 text-center text-gray-400">
            No vacancies yet
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '~/components/ui/loading-spinner.vue'
import Notification from '~/components/ui/Notification.vue'
import ConfirmDialog from "~/components/ui/ConfirmDialog.vue";

const files = ref([])
const vacancies = ref([])
const showCreateForm = ref(false)
const loading = ref(true)
const isEditing = ref(false)
const editingId = ref(null)
const isSaving = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationStatus = ref('success')


const showConfirmDialog = ref(false)
const confirmDialogTitle = ref('')
const confirmDialogMessage = ref('')
const confirmDialogType = ref('danger')
const confirmCallback = ref(null)

const formData = ref({
  content: {
    en: {
      title: '',
      file: null
    },
    de: {
      title: '',
      file: null
    }
  }
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

// Показ уведомления
const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message
  notificationStatus.value = type
  showNotification.value = true
}

const handleConfirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  confirmCallback.value = null
  showConfirmDialog.value = false
}

// Reset form
const resetForm = () => {
  formData.value = {
    content: {
      en: { title: '', file: null },
      de: { title: '', file: null }
    }
  }
  isEditing.value = false
  editingId.value = null
  showCreateForm.value = false
}

// Handle add button click
const handleAddClick = () => {
  resetForm()
  showCreateForm.value = true
}

// Cancel edit/create
const cancelEdit = () => {
  resetForm()
}

// Load files and vacancies
const loadData = async () => {
  loading.value = true
  try {
    const [filesResponse, vacanciesResponse] = await Promise.all([
      $fetch('/api/files/list'),
      $fetch('/api/vacancies')
    ])
    files.value = filesResponse
    vacancies.value = vacanciesResponse
  } catch (error) {
    console.error('Error loading data:', error)
    showNotificationMessage('Error loading data', 'error')
  } finally {
    loading.value = false
  }
}

// Edit vacancy
const editVacancy = (vacancy) => {
  isEditing.value = true
  editingId.value = vacancy._id
  formData.value = {
    content: {
      en: {
        title: vacancy.content.en.title || '',
        file: vacancy.content.en.file ? {
          url: vacancy.content.en.file.url,
          pathname: vacancy.content.en.file.pathname,
          contentType: vacancy.content.en.file.contentType
        } : null
      },
      de: {
        title: vacancy.content.de.title || '',
        file: vacancy.content.de.file ? {
          url: vacancy.content.de.file.url,
          pathname: vacancy.content.de.file.pathname,
          contentType: vacancy.content.de.file.contentType
        } : null
      }
    }
  }
  showCreateForm.value = true
}

// Save vacancy
const saveVacancy = async () => {
  if (!formData.value.content.en.title || !formData.value.content.de.title) {
    showNotificationMessage('Please fill in both titles', 'error')
    return
  }

  isSaving.value = true

  try {
    if (isEditing.value) {
      await $fetch(`/api/vacancies/${editingId.value}`, {
        method: 'PUT',
        body: formData.value
      })
      showNotificationMessage('Vacancy updated successfully')
    } else {
      await $fetch('/api/vacancies', {
        method: 'POST',
        body: formData.value
      })
      showNotificationMessage('Vacancy created successfully')
    }

    resetForm()
    await loadData()
  } catch (error) {
    console.error('Error saving vacancy:', error)
    showNotificationMessage('Failed to save vacancy', 'error')
  } finally {
    isSaving.value = false
  }
}

const showConfirm = ({ title, message, type = 'danger', callback }) => {
  confirmDialogTitle.value = title
  confirmDialogMessage.value = message
  confirmDialogType.value = type
  confirmCallback.value = callback
  showConfirmDialog.value = true
}

// Delete vacancy
const deleteVacancy = async (vacancy) => {
  showConfirm({
    title: 'Delete Vacancy',
    message: `Are you sure you want to delete the vacancy "${vacancy.content.en.title}"?`,
    type: 'danger',
    callback: async () => {
      isSaving.value = true;
      try {
        await $fetch(`/api/vacancies/${vacancy._id}`, {
          method: 'DELETE'
        });
        showNotificationMessage('Vacancy deleted successfully');
        await loadData();
      } catch (error) {
        console.error('Error deleting vacancy:', error);
        showNotificationMessage('Failed to delete vacancy', 'error');
      } finally {
        isSaving.value = false;
      }
    }
  });
};


// Helper functions
const getFileName = (pathname) => {
  if (!pathname) return ''
  return pathname.split('/').pop()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// Initialize
onMounted(async () => {
  await loadData()
})
</script>