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
  css: ['@/assets/scss/main.scss'],
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
            @use "@/assets/scss/colours.scss" as *;
            @use "@/assets/scss/helpers.scss" as *;
          `
        }
      }
    },
    // ssr: {
    //   noExternal: ['@prisma/client', '.prisma/client'],
    // },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@prisma/nuxt',
    '@nuxt/icon'
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