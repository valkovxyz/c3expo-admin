<template>
  <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
  >
    <div v-if="status === 'loading'" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative">
          <div class="w-12 h-12">
            <div class="w-full h-full border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-500 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
  >
    <div v-if="status === 'success'" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-12 h-12 text-teal-500">
          <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'loading',
    validator: (value) => ['loading', 'success', 'error'].includes(value)
  }
})
</script>