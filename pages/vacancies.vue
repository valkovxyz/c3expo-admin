```vue
<template>
  <div class="min-h-full bg-gray-900 py-16 px-64">
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
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-2">File</label>
              <select
                  v-model="formData.content.en.file"
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-2">File</label>
              <select
                  v-model="formData.content.de.file"
                  class="w-full bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              class="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
              @click="saveVacancy"
              class="bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2
                   hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                   focus:outline-none focus:ring-2 focus:ring-teal-500
                   transition-all duration-200 ease-in-out"
          >
            {{ isEditing ? 'Update' : 'Save' }} Vacancy
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
                    class="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                    title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                    @click="() => deleteVacancy(vacancy)"
                    class="text-gray-400 hover:text-red-400 transition-colors duration-200"
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
const files = ref([])
const vacancies = ref([])
const showCreateForm = ref(false)
const loading = ref(true)
const isEditing = ref(false)
const editingId = ref(null)
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
    alert('Error loading data')
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
    alert('Please fill in both titles')
    return
  }

  try {
    if (isEditing.value) {
      await $fetch(`/api/vacancies/${editingId.value}`, {
        method: 'PUT',
        body: formData.value
      })
    } else {
      await $fetch('/api/vacancies', {
        method: 'POST',
        body: formData.value
      })
    }

    resetForm()
    await loadData()
  } catch (error) {
    console.error('Error saving vacancy:', error)
    alert('Error saving vacancy')
  }
}

// Delete vacancy
const deleteVacancy = async (vacancy) => {
  if (!confirm(`Are you sure you want to delete this vacancy?`)) {
    return
  }

  try {
    await $fetch(`/api/vacancies/${vacancy._id}`, {
      method: 'DELETE'
    })
    await loadData()
  } catch (error) {
    console.error('Error deleting vacancy:', error)
    alert('Error deleting vacancy')
  }
}

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