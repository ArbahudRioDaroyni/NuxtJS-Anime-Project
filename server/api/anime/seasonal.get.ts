import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const { safeLimit = 10, safeOffset = 0 } = event.context
    const query = getQuery(event)
    const season = query.season as string
    const year = query.year as string
    
    if (!season || !year) {
      return {
        success: false,
        code: 400,
        message: 'Both season and year parameters are required',
        length: 0,
        data: []
      }
    }

    const seasonRecord = await prisma.seasons.findUnique({
      where: { name: season }
    })

    if (!seasonRecord) {
      return {
        success: false,
        code: 404,
        message: 'Season not found',
        length: 0,
        data: []
      }
    }

    const seasonalAnime = await prisma.anime.findMany({
      where: {
        season_id: seasonRecord.id,
        year: year,
        deleted_at: null
      },
      take: safeLimit,
      skip: safeOffset,
      orderBy: [
        { popularity: 'desc' },
        { title_romaji: 'asc' }
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
        season_id: seasonRecord.id,
        year: year,
        deleted_at: null
      }
    })

    return {
      success: true,
      code: 200,
      message: `${season} ${year} anime retrieved successfully`,
      length: seasonalAnime.length,
      data: seasonalAnime,
      meta: {
        total: totalCount,
        page: Math.floor(safeOffset / safeLimit) + 1,
        limit: safeLimit,
        totalPages: Math.ceil(totalCount / safeLimit),
        season: season,
        year: year
      }
    }
  } catch (e: unknown) {
    // event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving seasonal anime.',
      length: 0,
      data: []
    }
  }
})
