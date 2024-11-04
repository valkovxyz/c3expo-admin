<<template>
  <div
      class="color-picker-wrapper color-picker-absolute"
      ref="colorPickerRef"
  >
    <div class="color-picker-content">
      <ColorPicker
          :modelValue="tempColor"
          :sucker-hide="true"
          :show-alpha="false"
          @update:modelValue="updateTempColor"
          @changeColor="handleTempColorChange"
      />

      <!-- Секция с кнопками -->
      <div class="picker-actions">
        <div class="color-preview">
          Selected: <span class="color-sample" :style="{ backgroundColor: tempColor }"></span>
          <span class="color-value">{{ tempColor }}</span>
        </div>
        <div class="buttons-group">
          <button
              class="btn btn-cancel"
              @click="handleCancel"
          >
            Cancel
          </button>
          <button
              class="btn btn-save"
              @click="handleSave"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const props = defineProps({
  initialColor: {
    type: String,
    default: '#000000'
  }
})

const emit = defineEmits(['change', 'close'])

const colorPickerRef = ref(null)
const tempColor = ref(props.initialColor) // Временное значение цвета

// Обработчик временного изменения цвета
const handleTempColorChange = (colorObject) => {
  tempColor.value = colorObject.hex
}

const updateTempColor = (color) => {
  tempColor.value = color
}


// Обработчик сохранения
const handleSave = () => {
  emit('change', tempColor.value)
  emit('close')
}

// Обработчик отмены
const handleCancel = () => {
  tempColor.value = props.initialColor // Возвращаем исходный цвет
  emit('close')
}

// Обработчик клика вне компонента
const handleClickOutside = (event) => {
  if (colorPickerRef.value && !colorPickerRef.value.contains(event.target)) {
    if (!event.target.closest('.ql-color')) {
      handleCancel() // Используем handleCancel вместо простого закрытия
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

watch(() => props.initialColor, (newColor) => {
  tempColor.value = newColor
}, { immediate: true })
</script>

<style scoped>
.color-picker-wrapper {
  background: var(--editor-bg);
  border: 1px solid var(--editor-border);
  padding: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.color-picker-absolute {
  position: absolute;
  z-index: 1000;
}

.color-picker-content {
  width: 220px;
}

/* Стили для секции с действиями */
.picker-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--editor-border);
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--editor-text);
  font-size: 14px;
}

.color-sample {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 1px solid var(--editor-border);
  border-radius: 4px;
}

.color-value {
  font-family: monospace;
  color: var(--editor-text);
}

.buttons-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid var(--editor-border);
  color: var(--editor-text);
}

.btn-cancel:hover {
  background-color: var(--editor-hover);
}

.btn-save {
  background-color: var(--editor-accent);
  border: 1px solid var(--editor-accent);
  color: var(--editor-bg);
}

.btn-save:hover {
  opacity: 0.9;
}

/* Стили для колорпикера */
:deep(.color-picker) {
  width: 100% !important;
  background: var(--editor-bg) !important;
  border: none !important;
}

:deep(.color-picker input) {
  background: var(--editor-bg) !important;
  color: var(--editor-text) !important;
  border: 1px solid var(--editor-border) !important;
}

:deep(.saturation) {
  border: 1px solid var(--editor-border) !important;
}

:deep(.hue) {
  border: 1px solid var(--editor-border) !important;
}

:deep(.default-colors) {
  border-top: 1px solid var(--editor-border) !important;
}

:deep(.default-colors span) {
  border: 1px solid var(--editor-border) !important;
}

:deep(.vc-colorPicker) {
  background-color: var(--editor-bg) !important;
  color: var(--editor-text) !important;
}

/* Дополнительные стили для улучшения UX */
:deep(.color-picker .saturation-wrapper) {
  margin-bottom: 10px;
}

:deep(.color-picker .hue-wrapper) {
  margin-bottom: 10px;
}

:deep(.color-picker input) {
  height: 32px;
  padding: 4px 8px;
  margin: 4px 0;
}

:deep(.hu-color-picker) {
  box-shadow: none !important;
  background: var(--editor-bg) !important;
}

:deep(.colors .item:nth-child(8n+1)) {
  margin-left: 10px;
}
</style>