export default defineNuxtConfig({
  // Basic configuration

  ssr: true,

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // Runtime config for environment variables
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    public: {
      apiBase: '/api'
    }
  },
  cookieControl: {
    cookies: {
      necessary: [
        {
          name: 'dashboard_token',
          description: 'Authentication token',
          cookies: ['dashboard_token']
        }
      ]
    }
  },
  routeRules: {
    // Публичные маршруты
    '/login': { index: true },
    // Защищенные маршруты
    '/**': { middleware: ['auth'] }
  },

  // Build configuration
  build: {
    transpile: ['lucide-vue-next']
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Nitro configuration for Vercel
  nitro: {
    preset: 'vercel'
  },

  typescript: {
    strict: true,
    typeCheck: false,
    shim: false
  },

  compatibilityDate: '2024-10-23',
})