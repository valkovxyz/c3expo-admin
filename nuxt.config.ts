export default defineNuxtConfig({
  // Basic configuration
  ssr: true,

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // Runtime config for environment variables
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      apiBase: '/api'
    }
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