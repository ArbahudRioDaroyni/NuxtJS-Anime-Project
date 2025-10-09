import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const fields = query.fields as string | undefined
    
    // Calculate offset from page number
    const offset = (page - 1) * limit
    
    // Parse fields if provided
    const safeFields = fields ? JSON.parse(fields) : undefined
    
    // Parallel queries for better performance
    const [animeList, totalCount] = await Promise.all([
      // Main query
      safeFields ? 
        prisma.anime.findMany({
          where: { deleted_at: null },
          select: safeFields,
          take: limit,
          skip: offset,
          orderBy: { title_romaji: 'asc' }
        }) :
        prisma.anime.findMany({
          where: { deleted_at: null },
          take: limit,
          skip: offset,
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
        where: { deleted_at: null }
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
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
        nextPage: page < Math.ceil(totalCount / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        nextLink: page < Math.ceil(totalCount / limit) ? `/api/anime?page=${page + 1}&limit=${limit}` : null,
        prevLink: page > 1 ? `/api/anime?page=${page - 1}&limit=${limit}` : null
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
