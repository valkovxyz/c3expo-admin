<template>
  <aside class="w-64 bg-gray-900 text-gray-100 h-screen overflow-y-auto transition-all duration-300 ease-in-out border-r border-gray-800">
    <div class="h-16 px-6 border-b border-gray-800 flex items-center">
      <h1 class="text-xl font-semibold text-teal-400 flex items-center">
        <i class="fas fa-chart-line mr-2"></i>
        Dashboard
      </h1>
    </div>
    <nav class="mt-2">
      <div v-for="(menu, index) in mainMenu" :key="index" class="mb-2">
        <div @click="toggleDropdown(index)"
             class="flex items-center justify-between px-6 py-2 cursor-pointer hover:bg-gray-800 transition-all duration-200 ease-in-out group">
          <div class="flex items-center">
            <i :class="[menu.icon, 'mr-2 text-gray-400 group-hover:text-teal-400 transition-colors duration-200']"></i>
            <span class="font-medium group-hover:text-teal-400">{{ menu.title }}</span>
          </div>
          <i :class="[
            menu.isOpen ? 'transform rotate-180' : '',
            'fas fa-chevron-down transition-transform duration-200 text-gray-400 group-hover:text-teal-400'
          ]"></i>
        </div>
        <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[1000px]"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 max-h-[1000px]"
            leave-to-class="opacity-0 max-h-0"
        >
          <div v-show="menu.isOpen" class="overflow-hidden">
            <template v-if="menu.title === 'Topics'">
              <NuxtLink
                  v-for="topic in topics"
                  :key="topic.name"
                  :to="`/topics/${topic.name.toLowerCase()}`"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center group relative"
                  :class="{
                    'bg-gray-800 text-teal-400': isActiveRoute(`/topics/${topic.name.toLowerCase()}`),
                    'text-gray-400 hover:text-teal-400': !isActiveRoute(`/topics/${topic.name.toLowerCase()}`)
                  }"
              >
                <!-- Индикатор активного состояния -->
                <div
                    v-if="isActiveRoute(`/topics/${topic.name.toLowerCase()}`)"
                    class="absolute left-0 top-0 bottom-0 w-1 bg-teal-400"
                ></div>

                <!-- Иконка топика -->
                <i :class="[getTopicIcon(topic.name), 'mr-2 text-current']"></i>

                <span class="truncate">{{ formatTopicName(topic.name) }}</span>
              </NuxtLink>
            </template>
            <template v-else>
              <div v-for="item in menu.items" :key="item"
                   class="py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer flex items-center text-gray-400 hover:text-teal-400">
                <i :class="[getMenuItemIcon(item), 'mr-2']"></i>
                {{ item }}
              </div>
            </template>
          </div>
        </transition>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const mainMenu = ref([
  {
    title: 'Jobs',
    isOpen: false,
    items: ['Vacancies'],
    icon: 'fas fa-handshake-simple'
  },
  {
    title: 'Topics',
    isOpen: true,
    items: [],
    icon: 'fas fa-book'
  },
  {
    title: 'Documents',
    isOpen: false,
    items: ['Upload', 'Manage'],
    icon: 'fas fa-file-alt'
  },
  {
    title: 'SEO',
    isOpen: false,
    items: ['Meta Tags', 'Sitemap'],
    icon: 'fas fa-search'
  }
])

const topics = ref([
  { name: 'our-mission' },
  { name: 'our-vision' },
  { name: 'heritage' },
  { name: 'ceo-statement' },
  { name: 'our-expertise' },
  { name: 'world-wide-network' },
  { name: 'exhibition-booth' },
  { name: 'references' }
])

// Функция для получения иконки топика на основе его имени
const getTopicIcon = (topicName) => {
  const iconMap = {
    'our-mission': 'fas fa-bullseye',
    'our-vision': 'fas fa-eye',
    'heritage': 'fas fa-landmark',
    'ceo-statement': 'fas fa-user-tie',
    'our-expertise': 'fas fa-brain',
    'world-wide-network': 'fas fa-globe',
    'exhibition-booth': 'fa fa-curtain',
    'references': 'fas fa-quote-right',
    // Дефолтная иконка, если нет соответствия
    'default': 'fas fa-file-alt'
  }

  return iconMap[topicName] || iconMap.default
}

// Функция для получения иконки пункта меню
const getMenuItemIcon = (item) => {
  const iconMap = {
    'Upload': 'fas fa-upload',
    'Manage': 'fas fa-cog',
    'Meta Tags': 'fas fa-tags',
    'Sitemap': 'fas fa-sitemap',

    'Vacancies': 'fas fa-file-invoice',
    // Дефолтная иконка
    'default': 'fas fa-circle'
  }

  return iconMap[item] || iconMap.default
}

const toggleDropdown = (index) => {
  mainMenu.value[index].isOpen = !mainMenu.value[index].isOpen
}

const formatTopicName = (name) => {
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const isActiveRoute = (path) => {
  return route.path === path
}
</script>