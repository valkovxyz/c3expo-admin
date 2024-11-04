// components/ui/ConfirmDialog.vue
<template>
  <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
  >
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>

      <!-- Dialog -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
          <div
              v-if="modelValue"
              class="bg-gray-800 border border-gray-700  shadow-2xl w-full max-w-md p-6"
          >
            <!-- Title -->
            <div class="flex items-center mb-4">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center mr-3',
                type === 'danger' && 'bg-red-500/10 text-red-500',
                type === 'warning' && 'bg-yellow-500/10 text-yellow-500',
                type === 'info' && 'bg-blue-500/10 text-blue-500'
              ]">
                <i :class="[
                  'fas',
                  type === 'danger' && 'fa-exclamation-triangle',
                  type === 'warning' && 'fa-exclamation-circle',
                  type === 'info' && 'fa-info-circle'
                ]"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-100">
                {{ title }}
              </h3>
            </div>

            <!-- Message -->
            <div class="mb-6 text-gray-300">
              {{ message }}
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
              <button
                  @click="onCancel"
                  class="px-4 py-2 text-sm text-gray-400 hover:text-gray-100 transition-colors"
                  :disabled="loading"
              >
                {{ cancelText }}
              </button>
              <button
                  @click="onConfirm"
                  :disabled="loading"
                  :class="[
                  'px-4 py-2 text-sm font-medium  transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800',
                  loading && 'cursor-not-allowed opacity-50',
                  type === 'danger' && 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
                  type === 'warning' && 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
                  type === 'info' && 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                ]"
              >
                <span v-if="!loading">{{ confirmText }}</span>
                <i v-else class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'danger',
    validator: (value) => ['danger', 'warning', 'info'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const onConfirm = () => {
  if (props.loading) return
  emit('confirm')
}

const onCancel = () => {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}

// Закрытие по Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.modelValue && !props.loading) {
    onCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>