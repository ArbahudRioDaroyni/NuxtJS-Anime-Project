import type { H3Event } from 'h3'
import type { ResponseType, QueryType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const { page = 1, perPage = 10, search = '' } = getQuery(event) as QueryType
    const limit = Math.max(1, Math.min(Number(perPage), 100))
    const offset = (Math.max(1, Number(page)) - 1) * limit

    const totalCount = await prisma.anime.count({
      where: search ? {
        AND: [
          {
            deleted_at: null,
            trending: { gt: 0 }
          },
          {
            OR: [
              { title_romaji: { contains: search.toString(), mode: 'insensitive' } },
              { title_english: { contains: search.toString(), mode: 'insensitive' } },
              { title_native: { contains: search.toString(), mode: 'insensitive' } }
            ]
          }
        ]
      } : {
        deleted_at: null,
        trending: { gt: 0 }
      }
    })

    if (totalCount === 0) {
      throw new Error('No trending anime found.', { cause: 404 })
    }
    
    const trendingAnime = await prisma.anime.findMany({
      where: search ? {
        AND: [
          {
            deleted_at: null,
            trending: { gt: 0 }
          },
          {
            OR: [
              { title_romaji: { contains: search.toString(), mode: 'insensitive' } },
              { title_english: { contains: search.toString(), mode: 'insensitive' } },
              { title_native: { contains: search.toString(), mode: 'insensitive' } }
            ]
          }
        ]
      } : {
        deleted_at: null,
        trending: { gt: 0 }
      },
      take: limit,
      skip: offset,
      orderBy: [
        { trending: 'desc' },
        { updated_at: 'desc' }
      ],
      include: {
        media_type: true,
        release_format: true,
        status_type: true,
        source_media_type: true,
        season: true
      }
    })

    if (trendingAnime.length === 0) {
      throw new Error('No trending anime found.', { cause: 404 })
    }

    return {
      success: true,
      code: 200,
      message: 'Trending anime retrieved successfully',
      length: trendingAnime.length,
      meta: {
        total: totalCount,
        page: Number(page),
        perPage: limit,
        hasNext: offset + limit < totalCount,
        hasPrev: offset > 0,
        totalPages: Math.ceil(totalCount / limit)
      },
      data: trendingAnime
    }
  } catch (e: unknown) {
    event.node.res.statusCode = e instanceof Error && e.cause === 404 ? 404 : 500
    return {
      success: false,
      code: e instanceof Error && e.cause === 404 ? 404 : 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving trending anime.',
      length: 0,
      data: []
    }
  }
})
