import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const query = getQuery(event)
    const limit = Math.min(Number(query.limit) || 100, 200) // Max 200 for initial load
    const type = (query.type as string || 'popular').toLowerCase()

    let orderBy: Record<string, string> | Record<string, string>[] = { popularity: 'desc' }
    const whereClause: Record<string, unknown> = {
      deleted_at: null,
      popularity: { gt: 0 }
    }

    // Different sorting options
    switch (type) {
      case 'trending':
        orderBy = [
          { trending: 'desc' },
          { popularity: 'desc' }
        ]
        whereClause.trending = { gt: 0 }
        break
      case 'favorites':
        orderBy = { favorites: 'desc' }
        whereClause.favorites = { gt: 0 }
        break
      case 'recent':
        orderBy = { created_at: 'desc' }
        break
      case 'alphabetical':
        orderBy = { title_romaji: 'asc' }
        break
      default: // popular
        orderBy = [
          { popularity: 'desc' },
          { title_romaji: 'asc' }
        ]
    }

    const titles = await prisma.anime.findMany({
      where: whereClause,
      select: {
        id: true,
        slug: true,
        title_romaji: true,
        title_english: true,
        title_native: true,
        year: true,
        popularity: true,
        favorites: true,
        trending: true,
        episodes: true,
        thumbnail_image_url: true
      },
      take: limit,
      orderBy
    })

    return {
      success: true,
      code: 200,
      message: `Retrieved ${titles.length} ${type} anime titles`,
      length: titles.length,
      data: titles,
      meta: {
        type,
        limit,
        total: titles.length,
        sortedBy: type,
        availableTypes: ['popular', 'trending', 'favorites', 'recent', 'alphabetical']
      }
    }
  } catch (e: unknown) {
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'Failed to retrieve titles',
      length: 0,
      data: [],
      meta: {
        error: 'Internal server error'
      }
    }
  }
})
