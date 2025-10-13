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
    const fields = event.context.safeFields
    const format = query.format as string | undefined
    const search = query.search as string | undefined
    
    // Calculate offset from page number
    const offset = (page - 1) * limit
    
    // Build where clause
    const whereClause: Record<string, unknown> = { deleted_at: null }
    
    // Add format filter if provided
    if (format) {
      whereClause.release_format = {
        name: format
      }
    }
    
    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { title_romaji: { contains: search, mode: 'insensitive' } },
        { title_english: { contains: search, mode: 'insensitive' } },
        { title_native: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Parallel queries for better performance
    const [animeList, totalCount] = await Promise.all([
      // Main query
      fields ? 
        prisma.anime.findMany({
          where: whereClause,
          select: fields,
          take: limit,
          skip: offset,
          orderBy: { created_at: 'desc' }
        }) :
        prisma.anime.findMany({
          where: whereClause,
          take: limit,
          skip: offset,
          orderBy: { created_at: 'desc' },
          include: {
            media_type: true,
            release_format: true,
            status_type: true,
            season: true
          }
        }),
      
      // Count query
      prisma.anime.count({
        where: whereClause
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
