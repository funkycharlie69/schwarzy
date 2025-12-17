// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ssr: false,

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  app: {
    head: {
      title: 'Schwarzy - Gym Companion',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    vue: {
      script: {
        defineModel: false,
        propsDestructure: false
      }
    },
    server: {
      hmr: {
        overlay: false
      }
    }
  },

  devtools: { enabled: true }
})
