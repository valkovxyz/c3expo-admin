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

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-400 py-8">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
      <p class="mt-2">Loading files...</p>
    </div>

    <template v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-teal-400">Document Manager</h1>
        <div class="flex items-center space-x-4">
          <button
              @click="handleUploadClick"
              :disabled="isProcessing"
              class="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2
                 hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800
                 transition-all duration-200 ease-in-out flex items-center
                 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-upload mr-2"></i>
            Upload Files
          </button>
          <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              @change="handleFileSelect"
          />
        </div>
      </div>

      <!-- Drag & Drop Zone -->
      <div
          @dragenter.prevent="dragActive = true"
          @dragleave.prevent="dragActive = false"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          :class="[
          'border-2 border-dashed p-8 mb-6 text-center transition-colors duration-200',
          dragActive
            ? 'border-teal-400 bg-gray-800'
            : 'border-gray-700 bg-gray-800/50',
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        <div class="text-gray-400">
          <i class="fas fa-cloud-upload-alt text-3xl mb-2"></i>
          <p>Drag and drop files here or click upload button above</p>
        </div>
      </div>

      <!-- Files List -->
      <div class="bg-gray-800 border border-gray-700">
        <div class="p-4 border-b border-gray-700">
          <div class="grid grid-cols-12 text-sm font-medium text-gray-400">
            <div class="col-span-5">Name</div>
            <div class="col-span-3">Type</div>
            <div class="col-span-2">Size</div>
            <div class="col-span-2">Actions</div>
          </div>
        </div>

        <div class="divide-y divide-gray-700">
          <div
              v-for="file in files"
              :key="file.pathname"
              class="p-4 hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div class="grid grid-cols-12 items-center">
              <div class="col-span-5 flex items-center">
                <i :class="getFileIcon(file.contentType)" class="mr-3 text-gray-400"></i>
                <a
                    @click="openFile(file)"
                    class="text-gray-200 hover:text-teal-400 cursor-pointer truncate transition-colors duration-200"
                    :title="getFileName(file.pathname)"
                >
                  {{ getFileName(file.pathname) }}
                </a>
              </div>
              <div class="col-span-3 text-gray-400">
                {{ file.contentType }}
              </div>
              <div class="col-span-2 text-gray-400">
                {{ formatFileSize(file.size) }}
              </div>
              <div class="col-span-2 flex space-x-3">
                <button
                    @click="() => downloadFile(file)"
                    :disabled="isProcessing"
                    class="text-gray-400 hover:text-teal-400 transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download"
                >
                  <i class="fas fa-download"></i>
                </button>
                <button
                    @click="() => copyFileUrl(file)"
                    :disabled="isProcessing"
                    class="text-gray-400 hover:text-teal-400 transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy URL"
                >
                  <i class="fas fa-link"></i>
                </button>
                <button
                    @click="() => deleteFile(file)"
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

          <div v-if="files.length === 0" class="p-8 text-center text-gray-400">
            No files uploaded yet
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
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue'

const files = ref([])
const dragActive = ref(false)
const fileInput = ref(null)
const loading = ref(true)
const router = useRouter()

// Состояния для уведомлений и загрузки
const isProcessing = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationStatus = ref('success')

// Состояния для диалога подтверждения
const showConfirmDialog = ref(false)
const confirmDialogTitle = ref('')
const confirmDialogMessage = ref('')
const confirmDialogType = ref('danger')
const confirmCallback = ref(null)

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

// Показ диалога подтверждения
const showConfirm = ({ title, message, type = 'danger', callback }) => {
  confirmDialogTitle.value = title
  confirmDialogMessage.value = message
  confirmDialogType.value = type
  confirmCallback.value = callback
  showConfirmDialog.value = true
}

// Обработчик подтверждения
const handleConfirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  confirmCallback.value = null
  showConfirmDialog.value = false
}

// Загрузка списка файлов
const loadFiles = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/files/list')
    files.value = response
  } catch (error) {
    console.error('Error loading files:', error)
    showNotificationMessage('Error loading files', 'error')
    if (error.statusCode === 401) {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

// Handle file upload button click
const handleUploadClick = () => {
  if (isProcessing.value) return
  fileInput.value?.click()
}

// Upload files
const uploadFiles = async (filesToUpload) => {
  if (isProcessing.value) return

  isProcessing.value = true
  let successCount = 0
  let failCount = 0
  const totalFiles = filesToUpload.length

  for (const file of filesToUpload) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await $fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      if (!response) {
        throw new Error('Upload failed - no response')
      }

      successCount++
    } catch (error) {
      failCount++
      console.error('Upload error details:', {
        file: file.name,
        error: error
      })

      if (error.statusCode === 401) {
        router.push('/login')
        return
      }
    }
  }

  // Показываем результат загрузки
  if (successCount > 0) {
    showNotificationMessage(
        `Successfully uploaded ${successCount} file${successCount !== 1 ? 's' : ''}` +
        (failCount > 0 ? `, ${failCount} failed` : '')
    )
  } else if (failCount > 0) {
    showNotificationMessage(
        `Failed to upload ${failCount} file${failCount !== 1 ? 's' : ''}`,
        'error'
    )
  }

  await loadFiles()
  isProcessing.value = false
}

// Handle file selection
const handleFileSelect = async (event) => {
  const selectedFiles = Array.from(event.target.files || [])
  if (selectedFiles.length) {
    await uploadFiles(selectedFiles)
    event.target.value = ''
  }
}

// Handle file drop
const handleFileDrop = async (event) => {
  if (isProcessing.value) return

  dragActive.value = false
  const droppedFiles = Array.from(event.dataTransfer.files || [])
  if (droppedFiles.length) {
    await uploadFiles(droppedFiles)
  }
}

// Delete file
const deleteFile = async (file) => {
  if (isProcessing.value) return

  showConfirm({
    title: 'Delete File',
    message: `Are you sure you want to delete "${getFileName(file.pathname)}"?`,
    type: 'danger',
    callback: async () => {
      isProcessing.value = true

      try {
        await $fetch(`/api/files/${encodeURIComponent(file.pathname)}`, {
          method: 'DELETE'
        })
        showNotificationMessage(`File "${getFileName(file.pathname)}" deleted successfully`)
        await loadFiles()
      } catch (error) {
        console.error('Error deleting file:', error)
        if (error.statusCode === 401) {
          router.push('/login')
        } else {
          showNotificationMessage(`Failed to delete file "${getFileName(file.pathname)}"`, 'error')
        }
      } finally {
        isProcessing.value = false
      }
    }
  })
}

// Copy file URL to clipboard
const copyFileUrl = async (file) => {
  if (isProcessing.value) return

  try {
    await navigator.clipboard.writeText(file.url)
    showNotificationMessage('URL copied to clipboard')
  } catch (error) {
    console.error('Error copying URL:', error)
    showNotificationMessage('Failed to copy URL', 'error')
  }
}

// Open file in new tab
const openFile = (file) => {
  if (isProcessing.value) return
  window.open(file.url, '_blank')
}

// Download file
const downloadFile = (file) => {
  if (isProcessing.value) return
  window.open(file.url, '_blank')
}

// Helper functions
const getFileName = (pathname) => {
  if (!pathname) return ''
  return pathname.split('/').pop()
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const getFileIcon = (contentType) => {
  const icons = {
    'image': 'fa-image',
    'video': 'fa-video',
    'audio': 'fa-music',
    'application/pdf': 'fa-file-pdf',
    'application/msword': 'fa-file-word',
    'application/vnd.ms-excel': 'fa-file-excel',
    'text': 'fa-file-alt',
  }

  for (const [type, icon] of Object.entries(icons)) {
    if (contentType?.startsWith(type)) {
      return `fas ${icon}`
    }
  }

  return 'fas fa-file'
}

// Initialize
onMounted(async () => {
  await loadFiles()
})
</script>