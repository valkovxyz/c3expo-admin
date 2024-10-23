<template>
  <div class="min-h-full bg-gray-900 py-16 px-64">
    <!-- Header with title and language selector -->
    <div class="flex justify-between items-center mb-6">
      <!-- Edit Topic title -->
      <div class="h-8 w-72 bg-gray-800 animate-pulse"></div>

      <!-- Language selector -->
      <div class="h-[38px] w-24 bg-gray-800 border border-gray-700 animate-pulse"></div>
    </div>

    <!-- Main editor container -->
    <div class="bg-gray-800 border border-gray-700">
      <div class="p-6 space-y-4">
        <!-- Title input skeleton -->
        <div class="h-[52px] w-full bg-gray-700 animate-pulse"></div>

        <!-- Toolbar skeleton -->
        <div class="h-[42px] w-full bg-gray-700 animate-pulse"></div>

        <!-- Main content area skeleton -->
        <div class="h-[300px] w-full bg-gray-700 animate-pulse"></div>

        <!-- Save button skeleton -->
        <div class="h-[36px] w-32 bg-gray-700 animate-pulse ml-auto"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>