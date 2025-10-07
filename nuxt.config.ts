// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  image: {
    provider: 'ipx',
    dir: 'public'
  },
  css: [
    '@/assets/css/main.css',
  ],
  nitro: {
    externals: {
      inline: [],
    },
    moduleSideEffects: [],
    preset: 'node-server',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/theme.scss" as *;
            @use "@/assets/scss/helpers.scss" as *;
          `
        }
      }
    },
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@prisma/nuxt'
  ],
  alias: {
    '@anime': '/modules/anime',
    '@blog': '/modules/blog',
    '@forum': '/modules/forum'
  },
  runtimeConfig: {
    databasePath: './database/anime.sqlite'
  }
})