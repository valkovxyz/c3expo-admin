<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-teal-400">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    </div>
  </div>
</template>

<script setup>
const dashboardStats = ref([
  { title: 'Total Topics', value: '8', icon: 'DocumentTextIcon' },
  { title: 'Languages', value: '2', icon: 'GlobeAltIcon' },
  { title: 'Last Updated', value: 'Today', icon: 'ClockIcon' }
])

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>