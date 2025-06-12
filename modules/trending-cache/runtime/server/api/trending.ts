/** Nuxt 3 module to cache trending anime data from Jikan API
 * This module fetches trending anime data from the Jikan API and caches it for 24 hours.
 * It uses Nuxt's storage system to store the cached data.
 * The cached data is refreshed if it is older than 24 hours.
 * @module trending-cache
 */
export default defineEventHandler(async () => {
  const cache = useStorage('cache') // Use Nuxt's storage for caching
  const CACHE_KEY = 'trending-anime'
  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 1 day

  type CachedTrending = { data: unknown; lastUpdated: number } | null
  let cached = await cache.getItem(CACHE_KEY) as CachedTrending
  const now = Date.now()

  if (!cached || now - cached.lastUpdated > CACHE_DURATION) {
    const res = await $fetch('https://api.jikan.moe/v4/top/anime')
    cached = { data: res, lastUpdated: now }
    await cache.setItem(CACHE_KEY, cached)
    console.log('[Trending Cache] Refreshed at', new Date().toISOString())
  } else {
    console.log('[Trending Cache] Using Nitro cache at', new Date().toISOString())
  }

  return cached.data
})