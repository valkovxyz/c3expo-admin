<template>
  <div class="topic-editor space-y-4 bg-gray-900 p-6  border border-gray-800">
    <!-- Header Section -->
    <div class="editor-header mb-6">
      <h2 class="text-xl font-semibold text-teal-400 flex items-center mb-4">
        <i class="fas fa-edit mr-2"></i>
        Topic Editor
      </h2>

      <!-- Title Input -->
      <div class="editor-section">
        <input
            v-model="localTitle"
            @input="updateContent"
            class="w-full p-3 bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-500"
            placeholder="Enter topic title..."
        />
      </div>
    </div>

    <!-- Editor Section -->
    <div class="editor-section">
      <ClientOnly>
        <QuillEditor
            ref="editor"
            v-model:content="localContent"
            contentType="html"
            theme="snow"
            :toolbar="
                ['bold', 'italic', 'underline', 'strike', {'color': []}, {'background': []}, { 'script': 'sub'}, { 'script': 'super' }]"
            class="bg-gray-800 text-gray-100 editor-large-text"
            @update:content="handleEditorContentUpdate"
            :options="{
            placeholder: 'Start writing your topic content...',
            theme: 'bubble',
            modules: {
              toolbar: [
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'font': [] }],
                [{ 'align': [] }]
              ]
            }
          }"
        />
      </ClientOnly>
    </div>

    <!-- Unsaved Changes Indicator -->
    <div v-if="hasUnsavedChanges" class="flex items-center justify-end mt-4 text-sm text-gray-400">
      <i class="fas fa-circle text-teal-400 mr-2"></i>
      Unsaved changes
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

watch(() => props.modelValue, async (newValue, oldValue) => {
  if (newValue && (!oldValue ||
      newValue.content !== oldValue.content ||
      newValue.title !== oldValue.title)) {
    await updateEditorContent()
    hasUnsavedChanges.value = false
  }
}, { deep: true })

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
/* Custom dark theme styles for Quill editor */
:root {
  --editor-bg: #1a1e2b;
  --editor-border: #2d3748;
  --editor-text: #e2e8f0;
  --editor-placeholder: #718096;
  --editor-toolbar-bg: #1f2937;
  --editor-hover: #374151;
  --editor-accent: #2dd4bf;
}

.ql-toolbar.ql-snow {
  border-color: var(--editor-border);
  background-color: var(--editor-toolbar-bg);
  border-bottom: none;
}

.ql-container.ql-snow {
  border-color: var(--editor-border);
  background-color: var(--editor-bg);
  color: var(--editor-text);
  min-height: 300px;
}

.ql-editor {
  color: var(--editor-text);
}


.ql-editor.ql-blank::before {
  color: var(--editor-placeholder);
  font-style: normal;
}

/* Toolbar button styles */
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
  border-color: var(--editor-border) !important;
}

/* Tooltip styles */
.ql-snow .ql-tooltip {
  background-color: var(--editor-toolbar-bg);
  color: var(--editor-text);
  border-color: var(--editor-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ql-snow .ql-tooltip input[type=text] {
  background-color: var(--editor-bg);
  color: var(--editor-text);
  border-color: var(--editor-border);
}

/* Hover states */
.ql-snow .ql-picker-label:hover,
.ql-snow .ql-picker-item:hover {
  color: var(--editor-accent);
}

.ql-snow .ql-picker.ql-expanded .ql-picker-label {
  color: var(--editor-accent);
  border-color: var(--editor-border);
}

.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  border-color: var(--editor-border);
}

.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:hover {
  color: var(--editor-accent);
}

.ql-snow.ql-toolbar button:hover .ql-stroke,
.ql-snow .ql-toolbar button:hover .ql-stroke,
.ql-snow.ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke {
  stroke: var(--editor-accent);
}

.ql-snow.ql-toolbar button:hover .ql-fill,
.ql-snow .ql-toolbar button:hover .ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-fill {
  fill: var(--editor-accent);
}

/* Active states */
.ql-snow .ql-picker-item.ql-selected {
  color: var(--editor-accent);
}

/* Focus states */
.ql-container.ql-snow:focus-within {
  border-color: var(--editor-accent);
}

.editor-large-text .ql-editor {
  font-size: 16px;
  line-height: 1.6;
  padding: 20px;
}


</style>