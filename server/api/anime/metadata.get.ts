import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (_event: H3Event): Promise<ResponseType>  => {
  try {
    const cache = useStorage('cache')
    const CACHE_KEY = 'metadata-anime'
    const CACHE_DURATION = 24 * 60 * 60 * 1000

    type Cached = { data: unknown; lastUpdated: number } | null
    let cached = await cache.getItem(CACHE_KEY) as Cached
    const now = Date.now()

    if (!cached || now - cached.lastUpdated > CACHE_DURATION) {
      const [
        mediaTypes,
        releaseFormats,
        statusTypes,
        seasons,
        studios,
        genres
      ] = await Promise.all([
        prisma.release_media_types.findMany({
          orderBy: { name: 'asc' }
        }),
        prisma.release_formats.findMany({
          orderBy: { name: 'asc' }
        }),
        prisma.release_status_types.findMany({
          orderBy: { name: 'asc' }
        }),
        prisma.seasons.findMany({
          orderBy: { id: 'asc' }
        }),
        prisma.studios.findMany({
          orderBy: { name: 'asc' }
        }),
        prisma.genres.findMany({
          orderBy: { name: 'asc' }
        })
      ])

      const metadata = {
        mediaTypes,
        releaseFormats,
        statusTypes,
        seasons,
        studios,
        genres
      }
      cached = { data: metadata, lastUpdated: now }
      await cache.setItem(CACHE_KEY, cached)
      console.log('[Trending Cache] Refreshed at', new Date().toISOString())
    } else {
      console.log('[Trending Cache] Using Nitro cache at', new Date().toISOString())
    }

    return {
      success: true,
      code: 200,
      length: 1,
      message: 'Metadata fetched successfully',
      data: [cached.data]
    }
  } catch (e: unknown) {
    return {
      success: false,
      code: 500,
      length: 0,
      message: e instanceof Error ? e.message : 'Failed to fetch metadata',
      data: []
    }
  }
})
