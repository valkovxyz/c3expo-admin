<template>
  <aside class="w-64 bg-gray-900 text-gray-100 h-screen overflow-y-auto transition-all duration-300 ease-in-out border-r border-gray-800">
    <div class="h-16 px-6 border-b border-gray-800 flex items-center">
      <h1 class="text-xl font-semibold text-teal-400 flex items-center">
        <ClientOnly>
          <LayoutDashboard class="w-5 h-5 mr-2" />
        </ClientOnly>
        Dashboard
      </h1>
    </div>
    <nav class="mt-2">
      <div v-for="(menu, index) in mainMenu" :key="menu.title" class="mb-2">
        <div @click="toggleDropdown(index)"
             class="flex items-center justify-between px-6 py-2 cursor-pointer hover:bg-gray-800 transition-all duration-200 ease-in-out group">
          <div class="flex items-center">
            <ClientOnly>
              <component
                  :is="menu.icon"
                  class="w-5 h-5 mr-2 text-gray-400 group-hover:text-teal-400 transition-colors duration-200"
              />
            </ClientOnly>
            <span class="font-medium group-hover:text-teal-400">{{ menu.title }}</span>
          </div>
          <ClientOnly>
            <ChevronDown
                class="w-4 h-4 transition-transform duration-200 text-gray-400 group-hover:text-teal-400"
                :class="{ 'transform rotate-180': menu.isOpen }"
            />
          </ClientOnly>
        </div>
        <div v-show="menu.isOpen"
             class="overflow-hidden transition-all duration-300"
             :class="{'max-h-[1000px] opacity-100': menu.isOpen, 'max-h-0 opacity-0': !menu.isOpen}">
          <div class="py-2">
            <template v-if="menu.title === 'Topics'">
              <NuxtLink
                  v-for="topic in topics"
                  :key="topic.name"
                  :to="`/topics/${topic.name.toLowerCase()}`"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center group relative"
                  :class="getLinkClasses(topic.name)"
              >
                <div
                    v-if="isActiveRoute(`/topics/${topic.name.toLowerCase()}`)"
                    class="absolute left-0 top-0 bottom-0 w-1 bg-teal-400"
                />
                <ClientOnly>
                  <component
                      :is="getTopicIcon(topic.name)"
                      class="w-4 h-4 mr-2 text-current"
                  />
                </ClientOnly>
                <span class="truncate">{{ formatTopicName(topic.name) }}</span>
              </NuxtLink>
            </template>
            <template v-else-if="menu.title === 'Files'">
              <NuxtLink
                  to="/files"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center relative"
                  :class="getLinkClasses('files')"
              >
                <div
                    v-if="isActiveRoute('/files')"
                    class="absolute left-0 top-0 bottom-0 w-1 bg-teal-400"
                />
                <ClientOnly>
                  <Settings class="w-4 h-4 mr-2 text-current" />
                </ClientOnly>
                <span class="truncate">Manage</span>
              </NuxtLink>
            </template>
            <template v-else>
              <div v-for="item in menu.items"
                   :key="item"
                   class="py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer flex items-center text-gray-400 hover:text-teal-400">
                <ClientOnly>
                  <component
                      :is="getMenuItemIcon(item)"
                      class="w-4 h-4 mr-2"
                  />
                </ClientOnly>
                {{ item }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Handshake,
  BookOpen,
  FileText,
  Search,
  Target,
  Eye,
  Building2,
  UserCircle2,
  Brain,
  Globe2,
  Store,
  Quote,
  Settings,
  Tags,
  Map,
  Briefcase,
  ChevronDown
} from 'lucide-vue-next'

const route = useRoute()

const mainMenu = ref([
  {
    title: 'Jobs',
    isOpen: false,
    items: ['Vacancies'],
    icon: Handshake
  },
  {
    title: 'Topics',
    isOpen: true,
    items: [],
    icon: BookOpen
  },
  {
    title: 'Files',
    isOpen: false,
    icon: FileText
  },
  {
    title: 'SEO',
    isOpen: false,
    items: ['Meta Tags', 'Sitemap'],
    icon: Search
  }
])

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

// Функция для получения иконки топика
const getTopicIcon = (topicName) => {
  const iconMap = {
    'our-mission': Target,
    'our-vision': Eye,
    'heritage': Building2,
    'ceo-statement': UserCircle2,
    'our-expertise': Brain,
    'world-wide-network': Globe2,
    'exhibition-booth': Store,
    'references': Quote,
    'default': FileText
  }

  return iconMap[topicName] || iconMap.default
}

// Функция для получения иконки пункта меню
const getMenuItemIcon = (item) => {
  const iconMap = {
    'Manage': Settings,
    'Meta Tags': Tags,
    'Sitemap': Map,
    'Vacancies': Briefcase,
    'default': FileText
  }

  return iconMap[item] || iconMap.default
}

const toggleDropdown = (index) => {
  mainMenu.value[index].isOpen = !mainMenu.value[index].isOpen
}

const formatTopicName = (name) => {
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const getLinkClasses = (name) => {
  const path = name === 'files' ? '/files' : `/topics/${name.toLowerCase()}`
  const isActive = isActiveRoute(path)
  return {
    'bg-gray-800 text-teal-400': isActive,
    'text-gray-400 hover:text-teal-400': !isActive
  }
}

const isActiveRoute = (path) => {
  return route.path === path
}
</script>