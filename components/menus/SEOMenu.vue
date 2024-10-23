<!-- components/menus/SEOMenu.vue -->
<template>
  <div>
    <div v-for="item in menuItems" :key="item"
         @click="navigateTo(item.toLowerCase())"
         :class="{ 'bg-teal-500': isActiveRoute(`/seo/${item.toLowerCase()}`) }"
         class="px-4 py-2 cursor-pointer hover:bg-gray-700 transition-all duration-200 ease-in-out hover-effect">
      {{ item }}
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const props = defineProps(['menuItems'])
const router = useRouter()
const route = useRoute()

const navigateTo = (path) => {
  router.push(`/seo/${path}`)
}

const isActiveRoute = (path) => {
  return route.path === path
}
</script>