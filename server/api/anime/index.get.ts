import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const { safeSearch = '', safeFields, safeLimit = 10, safeOffset = 0 } = event.context
    
    // Parallel queries for better performance
    const [animeList, totalCount] = await Promise.all([
      // Main query
      safeFields ? 
        prisma.anime.findMany({
          where: safeSearch ? {
            AND: [
              { deleted_at: null },
              {
                OR: [
                  { title_romaji: { contains: safeSearch, mode: 'insensitive' } },
                  { title_english: { contains: safeSearch, mode: 'insensitive' } },
                  { title_native: { contains: safeSearch, mode: 'insensitive' } }
                ]
              }
            ]
          } : { deleted_at: null },
          select: safeFields,
          take: safeLimit,
          skip: safeOffset,
          orderBy: { title_romaji: 'asc' }
        }) :
        prisma.anime.findMany({
          where: safeSearch ? {
            AND: [
              { deleted_at: null },
              {
                OR: [
                  { title_romaji: { contains: safeSearch, mode: 'insensitive' } },
                  { title_english: { contains: safeSearch, mode: 'insensitive' } },
                  { title_native: { contains: safeSearch, mode: 'insensitive' } }
                ]
              }
            ]
          } : { deleted_at: null },
          take: safeLimit,
          skip: safeOffset,
          orderBy: { title_romaji: 'asc' },
          include: {
            media_type: true,
            release_format: true,
            status_type: true,
            season: true
          }
        }),
      
      // Count query
      prisma.anime.count({
        where: safeSearch ? {
          AND: [
            { deleted_at: null },
            {
              OR: [
                { title_romaji: { contains: safeSearch, mode: 'insensitive' } },
                { title_english: { contains: safeSearch, mode: 'insensitive' } },
                { title_native: { contains: safeSearch, mode: 'insensitive' } }
              ]
            }
          ]
        } : { deleted_at: null }
      })
    ])

    return {
      success: true,
      code: 200,
      message: 'Anime list retrieved successfully',
      data: animeList,
      length: animeList.length,
      meta: {
        total: totalCount,
        page: Math.floor(safeOffset / safeLimit) + 1,
        limit: safeLimit,
        totalPages: Math.ceil(totalCount / safeLimit),
        hasNext: (safeOffset + safeLimit) < totalCount,
        hasPrev: safeOffset > 0,
        searchTerm: safeSearch || null
      }
    }
  } catch (e: unknown) {
    // event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving anime list.',
      length: 0,
      data: [],
    }
  }
})
