<!-- components/menus/TopicsMenu.vue -->
<template>
  <div>
    <div v-for="topic in topics" :key="topic.name"
         @click="navigateToTopic(topic.name)"
         :class="{ 'bg-teal-500': isActiveRoute(`/topics/${topic.name}`) }"
         class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition-all duration-200 ease-in-out hover-effect">
      <i :class="getTopicIcon(topic.name)" class="mr-2"></i>
      <span>{{ topic.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const topics = ref([
  {name: 'our-mission'},
  {name: 'our-vision'},
  {name: 'heritage'},
  {name: 'ceo-statement'},
  {name: 'our-expertise'},
  {name: 'world-wide-network'},
  {name: 'exhibition-booth'},
  {name: 'references'}
])

const navigateToTopic = (topicName) => {
  router.push(`/topics/${topicName}`)
}

const isActiveRoute = (path) => {
  return route.path === path
}

const getTopicIcon = (topicName) => {
  const icons = {
    'our-mission': 'fas fa-bullseye',
    'our-vision': 'fas fa-eye',
    'heritage': 'fas fa-landmark',
    'ceo-statement': 'fas fa-user-tie',
    'our-expertise': 'fas fa-briefcase',
    'world-wide-network': 'fas fa-globe',
    'exhibition-booth': 'fas fa-booth-curtain',
    'references': 'fas fa-quote-right'
  }
  return icons[topicName] || 'fas fa-file'
}
</script>