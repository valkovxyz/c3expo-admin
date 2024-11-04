<template>
  <div class="topic-editor space-y-4 bg-gray-900 p-6 border border-gray-800">
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
    <div class="editor-section relative">
      <ClientOnly>
        <QuillEditor
            ref="editor"
            v-model:content="localContent"
            contentType="html"
            theme="snow"
            :options="editorOptions"
            class="bg-gray-800 text-gray-100 editor-large-text"
            @update:content="handleEditorContentUpdate"
        />
      </ClientOnly>

      <!-- Color Picker -->
      <QuillColorPicker
          v-if="showColorPicker"
          :initial-color="currentColor"
          @change="handleColorSelection"
          @close="handleColorPickerClose"
          :style="colorPickerStyle"
      />
    </div>

    <!-- Unsaved Changes Indicator -->
    <div v-if="hasUnsavedChanges" class="flex items-center justify-end mt-4 text-sm text-gray-400">
      <i class="fas fa-circle text-teal-400 mr-2"></i>
      Unsaved changes
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import QuillColorPicker from './QuillColorPicker.vue'
import 'vue-color-kit/dist/vue-color-kit.css'

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

const editor = ref(null)
const isLoading = ref(false)
const localTitle = ref('')
const localContent = ref('')
const hasUnsavedChanges = ref(false)
const isInternalUpdate = ref(false)
const showColorPicker = ref(false)
const currentColor = ref('#000000')
const colorPickerStyle = ref({})

// Конфигурация редактора с настроенными шрифтами
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'font': [
          'system-ui',
          'century-gothic',
          'montserrat'
        ]}],
      [{ 'align': [] }]
    ]
  },
  placeholder: 'Start writing your topic content...'
}

const setupColorButton = () => {
  nextTick(() => {
    const colorButton = document.querySelector('.ql-color')
    if (colorButton) {
      colorButton.addEventListener('click', handleColorButtonClick)
    }
  })
}

const handleColorPickerClose = () => {
  showColorPicker.value = false
}

const handleColorButtonClick = (e) => {
  e.preventDefault()
  e.stopPropagation()

  if (editor.value) {
    const quill = editor.value.getQuill()
    const range = quill.getSelection()

    if (range) {
      const format = quill.getFormat(range)
      const selectedColor = format.color || '#000000'
      currentColor.value = selectedColor

      const rect = e.target.getBoundingClientRect()
      colorPickerStyle.value = {
        position: 'absolute',
        top: `${rect.height + 5}px`,
        left: '0px',
        zIndex: 1000
      }

      showColorPicker.value = true
    }
  }
}

const handleColorSelection = (color) => {
  if (editor.value) {
    const quill = editor.value.getQuill()
    const range = quill.getSelection(true)

    if (range) {
      if (range.length === 0) {
        quill.format('color', color)
      } else {
        quill.formatText(range.index, range.length, 'color', color)
      }
    }
  }
  hasUnsavedChanges.value = true
}

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
    isLoading.value = true
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
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    }
  }
}

// Инициализация редактора и регистрация форматов шрифтов
onMounted(() => {
  setupColorButton()
  nextTick(() => {
    if (editor.value) {
      const Quill = editor.value.getQuill().constructor

      // Регистрация форматов шрифтов
      const Font = Quill.import('formats/font')
      Font.whitelist = ['century-gothic', 'montserrat', 'system-ui'] // Разрешенные значения для шрифтов
      Quill.register(Font, true)

      // Инициализация Quill
      const quill = editor.value.getQuill()
      quill.getModule('toolbar').addHandler('font', (value) => {
        quill.format('font', value)
      })
    }
  })
})

watch(() => props.modelValue, async (newValue, oldValue) => {
  if (newValue && (!oldValue ||
      newValue.content !== oldValue.content ||
      newValue.title !== oldValue.title)) {
    await updateEditorContent()
    hasUnsavedChanges.value = false
  }
}, {deep: true})

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

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

@font-face {
  font-family: 'Century Gothic';
  src: url('/assets/fonts/centurygothic.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}



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

/* Основные стили редактора */
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

/* Стили для шрифтов в редакторе */
.ql-snow .ql-picker.ql-font {
  width: 150px;
}

.ql-font-century-gothic {
  font-family: 'Century Gothic', sans-serif;
}

.ql-font-montserrat {
  font-family: 'Montserrat', sans-serif;
}

.ql-font-system-ui {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Стили для выпадающего списка шрифтов */
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: 'System UI';
  font-family: system-ui;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='century-gothic']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='century-gothic']::before {
  content: 'Century Gothic';
  font-family: 'Century Gothic';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='montserrat']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='montserrat']::before {
  content: 'Montserrat';
  font-family: 'Montserrat';
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

/* Color Picker specific styles */
.ql-color {
  width: 28px !important;
  height: 24px !important;
  position: relative;
}

.ql-picker.ql-color {
  width: 28px !important;
}

.ql-picker.ql-color .ql-picker-label {
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
}

.ql-picker.ql-color .ql-picker-label::before {
  content: '' !important;
  width: 16px !important;
  height: 16px !important;
  border: 1px solid var(--editor-border) !important;
  border-radius: 2px !important;
  margin: 0 !important;
  background-color: currentColor !important;
}

.ql-picker.ql-color .ql-picker-options {
  display: none !important;
}


/* Скрываем стандартный picker */
.ql-color .ql-picker-options {
  display: none !important;
}

.color-picker-container {
  position: absolute;
  background: var(--editor-bg);
  border: 1px solid var(--editor-border);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>