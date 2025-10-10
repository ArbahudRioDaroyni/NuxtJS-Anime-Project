// This module provides a server-side API endpoint for fetching trending data
import { createResolver, defineNuxtModule, addImportsDir, addServerHandler } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'Trending Cache',
    configKey: 'trendingCache',
    compatibility: {
      nuxt: '^4.0.0'
    }
  },
  setup () {
    const resolver = createResolver(import.meta.url)
    addImportsDir(__dirname + '/runtime/composables') // Register composables directory

    // Add an API route
    addServerHandler({
      route: '/api/trending',
      handler: resolver.resolve('./runtime/server/api/trending')
    })
  }
})