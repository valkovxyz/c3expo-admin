<!-- pages/documents.vue -->
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

    <!-- Confirm Dialog -->
    <ConfirmDialog
        v-model="showConfirmDialog"
        :title="confirmDialogTitle"
        :message="confirmDialogMessage"
        :loading="isProcessing"
        :type="confirmDialogType"
        @confirm="handleConfirmAction"
    />

    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-teal-400">Documents Manager</h1>
      <button
          @click="handleAddClick"
          class="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2
               hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
               transition-all duration-200 ease-in-out flex items-center"
      >
        <i class="fas fa-plus mr-2"></i>
        Add Document
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-400 py-8">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
      <p class="mt-2">Loading documents...</p>
    </div>

    <template v-else>
      <!-- Create/Edit Form -->
      <div v-if="showCreateForm" class="bg-gray-800 border border-gray-700 p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-teal-400">
            {{ isEditing ? 'Edit Document' : 'Create New Document' }}
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

        <!-- Active Status Toggle -->
        <div class="mt-6">
          <label class="flex items-center cursor-pointer">
            <div class="relative">
              <input
                  type="checkbox"
                  v-model="formData.isActive"
                  class="sr-only"
                  :disabled="isSaving"
              >
              <div class="w-10 h-5 bg-gray-700 rounded-full shadow-inner"></div>
              <div class="dot absolute w-4 h-4 bg-gray-100 rounded-full shadow -left-1 top-1 transition"
                   :class="[formData.isActive ? 'transform translate-x-6 bg-teal-400' : 'bg-gray-400']">
              </div>
            </div>
            <div class="ml-3 text-gray-400">
              Active in Footer
            </div>
          </label>
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
              @click="saveDocument"
              :disabled="isSaving"
              class="bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2
                   hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                   focus:outline-none focus:ring-2 focus:ring-teal-500
                   transition-all duration-200 ease-in-out
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center"
          >
            <span>{{ isEditing ? 'Update' : 'Save' }} Document</span>
          </button>
        </div>
      </div>

      <!-- Documents List -->
      <div class="bg-gray-800 border border-gray-700">
        <div class="p-4 border-b border-gray-700">
          <div class="grid grid-cols-12 text-sm font-medium text-gray-400">
            <div class="col-span-1"></div>
            <div class="col-span-4">English Title</div>
            <div class="col-span-4">German Title</div>
            <div class="col-span-1">Status</div>
            <div class="col-span-2">Actions</div>
          </div>
        </div>

        <draggable
            v-model="documents"
            item-key="_id"
            handle=".drag-handle"
            :disabled="isProcessing"
            class="divide-y divide-gray-700"
            @end="handleDragEnd"
        >
          <template #item="{ element: document }">
            <div class="p-4 hover:bg-gray-700/50 transition-colors duration-200">
              <div class="grid grid-cols-12 items-center">
                <div class="col-span-1">
                  <i class="fas fa-grip-vertical drag-handle cursor-move text-gray-400 hover:text-teal-400"></i>
                </div>
                <div class="col-span-4 text-gray-200">
                  {{ document.content.en.title }}
                </div>
                <div class="col-span-4 text-gray-200">
                  {{ document.content.de.title }}
                </div>
                <div class="col-span-1">
                  <span :class="[
                    'px-2 py-1 text-xs rounded-full',
                    document.isActive
                      ? 'bg-teal-500/10 text-teal-400'
                      : 'bg-gray-500/10 text-gray-400'
                  ]">
                    {{ document.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="col-span-2 flex space-x-3">
                  <button
                      @click="() => editDocument(document)"
                      :disabled="isProcessing"
                      class="text-gray-400 hover:text-teal-400 transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                      @click="() => deleteDocument(document)"
                      :disabled="isProcessing"
                      class="text-gray-400 hover:text-red-400 transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <div v-if="documents.length === 0" class="p-8 text-center text-gray-400">
          No documents yet
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import LoadingSpinner from '~/components/ui/loading-spinner.vue'
import Notification from '~/components/ui/Notification.vue'
import ConfirmDialog from "~/components/ui/ConfirmDialog.vue"

const files = ref([])
const documents = ref([])
const showCreateForm = ref(false)
const loading = ref(true)
const isEditing = ref(false)
const editingId = ref(null)
const isSaving = ref(false)
const isProcessing = ref(false)
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
  },
  isActive: true
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

// Show notification message
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
    },
    isActive: true
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

// Cancel edit
const cancelEdit = () => {
  resetForm()
}

// Load data
const loadData = async () => {
  loading.value = true
  try {
    const [filesResponse, documentsResponse] = await Promise.all([
      $fetch('/api/files/list'),
      $fetch('/api/documents')
    ])
    files.value = filesResponse
    documents.value = documentsResponse
  } catch (error) {
    console.error('Error loading data:', error)
    showNotificationMessage('Error loading data', 'error')
  } finally {
    loading.value = false
  }
}

// Edit document
const editDocument = (document) => {
  isEditing.value = true
  editingId.value = document._id
  formData.value = {
    content: {
      en: {
        title: document.content.en.title || '',
        file: document.content.en.file
      },
      de: {
        title: document.content.de.title || '',
        file: document.content.de.file
      }
    },
    isActive: document.isActive
  }
  showCreateForm.value = true
}

// Save document
const saveDocument = async () => {
  if (!formData.value.content.en.title || !formData.value.content.de.title) {
    showNotificationMessage('Please fill in both titles', 'error')
    return
  }

  isSaving.value = true

  try {
    if (isEditing.value) {
      await $fetch(`/api/documents/${editingId.value}`, {
        method: 'PUT',
        body: formData.value
      })
      showNotificationMessage('Document updated successfully')
    } else {
      await $fetch('/api/documents', {
        method: 'POST',
        body: formData.value
      })
      showNotificationMessage('Document created successfully')
    }

    resetForm()
    await loadData()
  } catch (error) {
    console.error('Error saving document:', error)
    showNotificationMessage('Failed to save document', 'error')
  } finally {
    isSaving.value = false
  }
}

// Handle drag end
const handleDragEnd = async () => {
  if (isProcessing.value) return

  isProcessing.value = true
  try {
    await $fetch('/api/documents/reorder', {
      method: 'PUT',
      body: { documents: documents.value }
    })
    showNotificationMessage('Documents reordered successfully')
  } catch (error) {
    console.error('Error reordering documents:', error)
    showNotificationMessage('Failed to reorder documents', 'error')
    await loadData() // Reload original order
  } finally {
    isProcessing.value = false
  }
}

// In your <script setup> section, add/update this function
const showConfirm = ({ title, message, type = 'danger', callback }) => {
  confirmDialogTitle.value = title
  confirmDialogMessage.value = message
  confirmDialogType.value = type
  confirmCallback.value = callback
  showConfirmDialog.value = true
}
// Delete document
const deleteDocument = async (document) => {
  showConfirm({
    title: 'Delete Document',
    message: `Are you sure you want to delete "${document.content.en.title}"?`,
    type: 'danger',
    callback: async () => {
      isProcessing.value = true
      try {
        await $fetch(`/api/documents/${document._id}`, {
          method: 'DELETE'
        })
        showNotificationMessage('Document deleted successfully')
        await loadData()
      } catch (error) {
        console.error('Error deleting document:', error)
        showNotificationMessage('Failed to delete document', 'error')
      } finally {
        isProcessing.value = false
      }
    }
  })
}

// Helper functions
const getFileName = (pathname) => {
  if (!pathname) return ''
  return pathname.split('/').pop()
}

// Initialize
onMounted(async () => {
  await loadData()
})
</script>

<style scoped>
.dot {
  transition: all 0.3s ease-in-out;
}

.drag-handle {
  cursor: move;
  cursor: -webkit-grabbing;
}
</style>