// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000/api'
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    preset: 'vercel',
  },
  typescript: {
    strict: true,
    typeCheck: false
  },
  public: {
    apiBase: process.env.NODE_ENV === 'production'
        ? 'https://admin.c3expo.de'
        : 'http://localhost:3000'
  },
  build: {
    transpile: ['lucide-vue-next']
  },

  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  nitro: {
    plugins: ['~/server/db/mongoose.js']
  },

  compatibilityDate: '2024-10-22',
})