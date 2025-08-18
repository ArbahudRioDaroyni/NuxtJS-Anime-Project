import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const { safeSearch = '', safeLimit = 10, safeOffset = 0 } = event.context
    
    const searchFilter = safeSearch ? {
      OR: [
        { title_romaji: { contains: safeSearch } },
        { title_english: { contains: safeSearch } },
        { title_native: { contains: safeSearch } }
      ]
    } : undefined

    const popularAnime = await prisma.anime.findMany({
      where: {
        ...searchFilter,
        deleted_at: null, // Exclude soft-deleted anime
        popularity: { gt: 0 }
      },
      take: safeLimit,
      skip: safeOffset,
      orderBy: [
        { popularity: 'desc' },
        { favorites: 'desc' }
      ],
      include: {
        media_type: true,
        release_format: true,
        status_type: true,
        season: true
      }
    })

    const totalCount = await prisma.anime.count({
      where: {
        ...searchFilter,
        deleted_at: null,
        popularity: { gt: 0 }
      }
    })

    return {
      success: true,
      code: 200,
      message: 'Popular anime retrieved successfully',
      length: popularAnime.length,
      data: popularAnime,
      meta: {
        total: totalCount,
        page: Math.floor(safeOffset / safeLimit) + 1,
        limit: safeLimit,
        totalPages: Math.ceil(totalCount / safeLimit)
      }
    }
  } catch (e: unknown) {
    const error = e as { statusCode?: number; message?: string }
    return {
      success: false,
      code: error.statusCode || 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving popular anime.',
      length: 0,
      data: []
    }
  }
})
