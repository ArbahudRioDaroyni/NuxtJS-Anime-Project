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

    const trendingAnime = await prisma.anime.findMany({
      where: {
        ...searchFilter,
        deleted_at: null, // Exclude soft-deleted anime
        trending: { gt: 0 }
      },
      take: safeLimit,
      skip: safeOffset,
      orderBy: [
        { trending: 'desc' },
        { updated_at: 'desc' }
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
        trending: { gt: 0 }
      }
    })

    return {
      success: true,
      code: 200,
      message: 'Trending anime retrieved successfully',
      length: trendingAnime.length,
      data: trendingAnime,
      meta: {
        total: totalCount,
        page: Math.floor(safeOffset / safeLimit) + 1,
        limit: safeLimit,
        totalPages: Math.ceil(totalCount / safeLimit)
      }
    }
  } catch (e: unknown) {
    // event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving trending anime.',
      length: 0,
      data: []
    }
  }
})
