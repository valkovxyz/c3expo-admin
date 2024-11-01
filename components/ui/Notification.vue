// components/ui/Notification.vue
<template>
  <Transition
      enter-active-class="transform transition-all duration-300"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transform transition-all duration-300"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
  >
    <div
        v-show="isVisible"
        :class="[
        'fixed bottom-4 right-4 p-4 shadow-2xl z-50 backdrop-blur-sm',
        'border border-opacity-20',
        type === 'success' && 'bg-gray-800/90 border-teal-500 text-teal-400',
        type === 'error' && 'bg-gray-800/90 border-red-500 text-red-400',
        type === 'info' && 'bg-gray-800/90 border-blue-500 text-blue-400'
      ]"
    >
      <div class="flex items-center">
        <template v-if="type === 'success'">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
            />
          </svg>
        </template>
        <template v-else-if="type === 'error'">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </template>
        <span class="text-sm font-medium tracking-wide">{{ message }}</span>
      </div>

      <!-- Прогресс-бар -->
      <div class="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r"
           :class="[
             type === 'success' && 'from-teal-600 to-teal-400',
             type === 'error' && 'from-red-600 to-red-400',
             type === 'info' && 'from-blue-600 to-blue-400'
           ]"
           :style="{
             width: `${progressWidth}%`,
             transition: `width ${props.duration}ms linear`
           }"
      ></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])
const isVisible = ref(false)
const progressWidth = ref(100)

let progressTimer = null

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
    // Запускаем прогресс-бар
    progressWidth.value = 100
    requestAnimationFrame(() => {
      progressWidth.value = 0
    })
  })

  progressTimer = setTimeout(() => {
    isVisible.value = false
    setTimeout(() => {
      emit('close')
    }, 300)
  }, props.duration)
})

onUnmounted(() => {
  if (progressTimer) clearTimeout(progressTimer)
})
</script>