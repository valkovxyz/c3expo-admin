<template>
  <div class="min-h-full bg-gray-900 py-16 px-64">
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
              class="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2
                   hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800
                   transition-all duration-200 ease-in-out flex items-center"
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
              : 'border-gray-700 bg-gray-800/50'
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
                <span class="text-gray-200 truncate">{{ getFileName(file.pathname) }}</span>
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
                    class="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                    title="Download"
                >
                  <i class="fas fa-download"></i>
                </button>
                <button
                    @click="() => copyFileUrl(file)"
                    class="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                    title="Copy URL"
                >
                  <i class="fas fa-link"></i>
                </button>
                <button
                    @click="() => deleteFile(file)"
                    class="text-gray-400 hover:text-red-400 transition-colors duration-200"
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
const files = ref([])
const dragActive = ref(false)
const fileInput = ref(null)
const loading = ref(true)
const router = useRouter()

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

// Load files from server
const loadFiles = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/files/list')
    files.value = response
  } catch (error) {
    console.error('Error loading files:', error)
    alert('Error loading files')
  } finally {
    loading.value = false
  }
}

// Upload files
const uploadFiles = async (filesToUpload) => {
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

      console.log('File uploaded successfully:', response)
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        data: error.data
      })

      if (error.statusCode === 401) {
        router.push('/login')
        return
      }
      alert(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`)
    }
  }

  await loadFiles()
}

// Handle file upload button click
const handleUploadClick = () => {
  fileInput.value?.click()
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
  dragActive.value = false
  const droppedFiles = Array.from(event.dataTransfer.files || [])
  if (droppedFiles.length) {
    await uploadFiles(droppedFiles)
  }
}

// Delete file
const deleteFile = async (file) => {
  if (!confirm(`Are you sure you want to delete ${getFileName(file.pathname)}?`)) {
    return
  }

  try {
    await $fetch(`/api/files/${encodeURIComponent(file.pathname)}`, {
      method: 'DELETE'
    })
    await loadFiles()
  } catch (error) {
    console.error('Error deleting file:', error)
    if (error.statusCode === 401) {
      router.push('/login')
    } else {
      alert('Failed to delete file')
    }
  }
}

// Copy file URL to clipboard
const copyFileUrl = async (file) => {
  try {
    await navigator.clipboard.writeText(file.url)
    alert('URL copied to clipboard')
  } catch (error) {
    console.error('Error copying URL:', error)
    alert('Failed to copy URL')
  }
}

// Download file
const downloadFile = (file) => {
  window.open(file.url, '_blank')
}

// Helper functions
const getFileName = (pathname) => {
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