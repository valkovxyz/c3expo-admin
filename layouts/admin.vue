<template>
  <div class="flex h-screen bg-gray-900 text-gray-100">
      <TheSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
        <TheHeader />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800">
        <div class="h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const TheSidebar = defineAsyncComponent(() =>
    import('~/components/TheSidebar.vue')
)
const TheHeader = defineAsyncComponent(() =>
    import('~/components/TheHeader.vue')
)
</script>

<style scoped>
/* Стилизация скроллбара для Firefox */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #1a202c;
}

/* Стилизация скроллбара для Chrome/Safari/Edge */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1a202c;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
</style>