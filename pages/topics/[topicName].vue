<template>
  <div class="min-h-full bg-gray-900 py-16 px-64">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-teal-400">Edit Topic: {{ formatTopicName(topicName) }}</h1>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-400">Language:</span>
        <select
            v-model="selectedLanguage"
            @change="handleLanguageChange"
            class="bg-gray-800 border border-gray-700 text-white px-3 py-1.5
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                   transition-colors duration-200"
        >
          <option value="en">English</option>
          <option value="de">German</option>
        </select>
      </div>
    </div>

    <div class="bg-gray-800 border border-gray-700">
      <TopicEditor
          ref="editorRef"
          v-if="topicData"
          v-model="topicData"
          :language="selectedLanguage"
          @update:modelValue="handleEditorChange"
      />

      <div class="p-4 border-t border-gray-700 flex justify-end">
        <button
            @click="saveTopic"
            class="bg-gray-900 border border-gray-700 text-gray-100 px-4 py-2
                   hover:bg-gray-700 hover:text-teal-400 hover:border-teal-400
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 disabled:hover:text-gray-100 disabled:hover:border-gray-700
                   transition-all duration-200 ease-in-out flex items-center"
            :disabled="!hasChanges"
        >
          <i class="fas fa-save mr-2"></i>
          {{ hasChanges ? 'Save Changes' : 'No Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const topicName = route.params.topicName
const topicData = ref(null)
const selectedLanguage = ref('en')
const fullTopicData = ref(null)
const editorRef = ref(null)
const hasChanges = ref(false)

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const formatTopicName = (name) => {
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const loadContent = async () => {
  try {
    const response = await $fetch(`/api/topics/${topicName}`)
    fullTopicData.value = response
    await updateTopicData()
    hasChanges.value = false
  } catch (error) {
    console.error('Error loading topic:', error)
    alert('Error loading topic content')
  }
}

const updateTopicData = async () => {
  if (fullTopicData.value?.content) {
    const content = fullTopicData.value.content[selectedLanguage.value] || { title: '', text: '' }

    topicData.value = {
      title: content.title || '',
      content: content.text || ''
    }

    await nextTick()

    if (editorRef.value) {
      await editorRef.value.updateEditorContent()
    }
  }
}

const handleLanguageChange = async () => {
  if (hasChanges.value) {
    const canChange = await editorRef.value?.confirmLanguageChange()
    if (!canChange) {
      selectedLanguage.value = route.query.language || 'en'
      return
    }
  }

  await updateTopicData()
  hasChanges.value = false
}

const handleEditorChange = (newValue) => {
  hasChanges.value = true
  topicData.value = { ...newValue }
}

const saveTopic = async () => {
  try {
    const updatedContent = {
      ...fullTopicData.value.content,
      [selectedLanguage.value]: {
        title: topicData.value.title,
        text: topicData.value.content
      }
    }

    const response = await $fetch(`/api/topics/${topicName}`, {
      method: 'PUT',
      body: { content: updatedContent }
    })

    if (response) {
      fullTopicData.value = response
      hasChanges.value = false
      alert('Topic saved successfully')
    }
  } catch (error) {
    console.error('Error saving topic:', error)
    alert('Failed to save topic. Please try again.')
  }
}

onMounted(() => {
  loadContent()
})
</script>