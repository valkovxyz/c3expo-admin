<template>
  <aside class="w-64 bg-gray-900 text-gray-100 h-screen overflow-y-auto transition-all duration-300 ease-in-out border-r border-gray-800">
    <!-- Header -->
    <div class="h-16 px-6 border-b border-gray-800 flex items-center">
      <h1 class="text-xl font-semibold text-teal-400 flex items-center">
        <ClientOnly>
          <LayoutDashboard class="w-5 h-5 mr-2" />
        </ClientOnly>
        Dashboard
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="mt-2">
      <div v-for="(menu, index) in mainMenu" :key="menu.title" class="mb-2">
        <!-- Menu Header -->
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

        <!-- Dropdown Content -->
        <div v-show="menu.isOpen"
             class="overflow-hidden transition-all duration-300"
             :class="{'max-h-[1000px] opacity-100': menu.isOpen, 'max-h-0 opacity-0': !menu.isOpen}">
          <div class="py-2">
            <!-- Topics Section -->
            <template v-if="menu.title === 'Topics'">
              <NuxtLink
                  v-for="topic in topics"
                  :key="topic.name"
                  :to="`/topics/${topic.name.toLowerCase()}`"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center group relative"
                  :class="getLinkClasses(`/topics/${topic.name.toLowerCase()}`)"
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

            <!-- Files Section -->
            <template v-else-if="menu.title === 'Files'">
              <NuxtLink
                  to="/files"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center relative"
                  :class="getLinkClasses('/files')"
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

            <!-- Jobs Section -->
            <template v-else-if="menu.title === 'Jobs'">
              <NuxtLink
                  to="/vacancies"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center relative"
                  :class="getLinkClasses('/vacancies')"
              >
                <div
                    v-if="isActiveRoute('/vacancies')"
                    class="absolute left-0 top-0 bottom-0 w-1 bg-teal-400"
                />
                <ClientOnly>
                  <Briefcase class="w-4 h-4 mr-2 text-current" />
                </ClientOnly>
                <span class="truncate">Vacancies</span>
              </NuxtLink>
            </template>

            <!-- SEO Section -->
            <template v-else-if="menu.title === 'SEO'">
              <NuxtLink
                  v-for="item in menu.items"
                  :key="item"
                  :to="getItemRoute(item)"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center relative"
                  :class="getLinkClasses(getItemRoute(item))"
              >
                <div
                    v-if="isActiveRoute(getItemRoute(item))"
                    class="absolute left-0 top-0 bottom-0 w-1 bg-teal-400"
                />
                <ClientOnly>
                  <component
                      :is="getMenuItemIcon(item)"
                      class="w-4 h-4 mr-2 text-current"
                  />
                </ClientOnly>
                <span class="truncate">{{ item }}</span>
              </NuxtLink>
            </template>

            <!-- Default Section - для будущих разделов -->
            <template v-else>
              <NuxtLink
                  v-for="item in menu.items"
                  :key="item"
                  :to="getItemRoute(item)"
                  class="block py-2 pl-12 pr-6 hover:bg-gray-800 transition-all duration-200 ease-in-out flex items-center relative"
                  :class="getLinkClasses(getItemRoute(item))"
              >
                <div
                    v-if="isActiveRoute(getItemRoute(item))"
                    class="absolute left-0 top-0 bottom-0 w-1 bg-teal-400"
                />
                <ClientOnly>
                  <component
                      :is="getMenuItemIcon(item)"
                      class="w-4 h-4 mr-2 text-current"
                  />
                </ClientOnly>
                <span class="truncate">{{ item }}</span>
              </NuxtLink>
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

// Главное меню
const mainMenu = ref([
  {
    title: 'Jobs',
    isOpen: false,
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

// Топики
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

// Маппинг иконок для топиков
const topicIcons = {
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

// Маппинг иконок для пунктов меню
const menuItemIcons = {
  'Manage': Settings,
  'Meta Tags': Tags,
  'Sitemap': Map,
  'Vacancies': Briefcase,
  'default': FileText
}

// Маппинг маршрутов для пунктов меню
const itemRoutes = {
  'Meta Tags': '/seo/meta-tags',
  'Sitemap': '/seo/sitemap',
  'Vacancies': '/vacancies'
}

// Функции
const toggleDropdown = (index) => {
  mainMenu.value[index].isOpen = !mainMenu.value[index].isOpen
}

const formatTopicName = (name) => {
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const getTopicIcon = (topicName) => {
  return topicIcons[topicName] || topicIcons.default
}

const getMenuItemIcon = (item) => {
  return menuItemIcons[item] || menuItemIcons.default
}

const getItemRoute = (item) => {
  return itemRoutes[item] || `/${item.toLowerCase()}`
}

const isActiveRoute = (path) => {
  return route.path === path
}

const getLinkClasses = (path) => {
  const isActive = isActiveRoute(path)
  return {
    'bg-gray-800 text-teal-400': isActive,
    'text-gray-400 hover:text-teal-400': !isActive
  }
}
</script>