<template>
  <div class="topic-editor space-y-4">
    <div class="editor-section">
      <input
          v-model="localTitle"
          @input="updateContent"
          class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ease-in-out"
          placeholder="Enter title"
      />
    </div>

    <div class="editor-section">
      <ClientOnly>
        <QuillEditor
            ref="editor"
            v-model:content="localContent"
            contentType="html"
            theme="snow"
            toolbar="full"
            class="bg-gray-700 text-gray-100 rounded-md"
            @update:content="handleEditorContentUpdate"
            :options="{
              placeholder: 'Start writing...',
              theme: 'snow',
              modules: {
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'header': 1 }, { 'header': 2 }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'script': 'sub'}, { 'script': 'super' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  [{ 'direction': 'rtl' }],
                  [{ 'size': ['small', false, 'large', 'huge'] }],
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'font': [] }],
                  [{ 'align': [] }],
                  ['clean'],
                  ['link', 'image']
                ]
              }
            }"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  language: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const localTitle = ref('')
const localContent = ref('')
const hasUnsavedChanges = ref(false)
const editor = ref(null)
const isInternalUpdate = ref(false)

const updateContent = () => {
  hasUnsavedChanges.value = true
  emit('update:modelValue', {
    title: localTitle.value,
    content: localContent.value
  })
}

const handleEditorContentUpdate = (content) => {
  if (!isInternalUpdate.value) {
    localContent.value = content
    updateContent()
  }
}

const confirmLanguageChange = () => {
  return new Promise((resolve) => {
    if (!hasUnsavedChanges.value) {
      resolve(true)
      return
    }

    const result = window.confirm(
        'You have unsaved changes. Are you sure you want to change the language?'
    )
    resolve(result)
  })
}

const resetUnsavedChanges = () => {
  hasUnsavedChanges.value = false
}

const updateEditorContent = async () => {
  if (props.modelValue) {
    isInternalUpdate.value = true
    try {
      localTitle.value = props.modelValue.title || ''

      // Только если содержимое действительно изменилось
      if (localContent.value !== props.modelValue.content) {
        localContent.value = props.modelValue.content || ''

        await nextTick()
        if (editor.value?.getQuill()) {
          const quill = editor.value.getQuill()
          const currentSelection = quill.getSelection()
          quill.setContents(quill.clipboard.convert(props.modelValue.content || ''))
          if (currentSelection) {
            quill.setSelection(currentSelection)
          }
        }
      }
    } finally {
      isInternalUpdate.value = false
    }
  }
}

// Наблюдаем за изменениями в modelValue
watch(() => props.modelValue, async (newValue, oldValue) => {
  // Проверяем, действительно ли изменилось содержимое
  if (newValue && (!oldValue ||
      newValue.content !== oldValue.content ||
      newValue.title !== oldValue.title)) {
    await updateEditorContent()
    hasUnsavedChanges.value = false
  }
}, { deep: true })

// Наблюдаем за изменениями языка
watch(() => props.language, async () => {
  await updateEditorContent()
  hasUnsavedChanges.value = false
})

defineExpose({
  confirmLanguageChange,
  resetUnsavedChanges,
  updateEditorContent
})
</script>

<style>
/* Custom styles for Quill editor in dark mode */
:root {
  --editor-bg: #1a202c;
  --editor-border: #4a5568;
  --editor-text: #e2e8f0;
  --editor-placeholder: #a0aec0;
  --editor-toolbar-bg: #2d3748;
}

.ql-toolbar.ql-snow {
  border-color: var(--editor-border);
  background-color: var(--editor-toolbar-bg);
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.ql-container.ql-snow {
  border-color: var(--editor-border);
  background-color: var(--editor-bg);
  color: var(--editor-text);
  min-height: 200px;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.ql-editor {
  color: var(--editor-text);
}

.ql-editor.ql-blank::before {
  color: var(--editor-placeholder);
}

.ql-snow .ql-stroke {
  stroke: var(--editor-text);
}

.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
  fill: var(--editor-text);
}

.ql-snow .ql-picker {
  color: var(--editor-text);
}

.ql-snow .ql-picker-options {
  background-color: var(--editor-toolbar-bg);
}

.ql-snow .ql-tooltip {
  background-color: var(--editor-toolbar-bg);
  color: var(--editor-text);
  border-color: var(--editor-border);
}

.ql-snow .ql-tooltip input[type=text] {
  background-color: var(--editor-bg);
  color: var(--editor-text);
  border-color: var(--editor-border);
}

/* Fix for dark theme dropdowns */
.ql-snow .ql-picker-label {
  color: var(--editor-text);
}

.ql-snow .ql-picker-item {
  color: var(--editor-text);
}

.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  border-color: var(--editor-border);
}
</style>