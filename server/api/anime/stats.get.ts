import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (_event: H3Event): Promise<ResponseType> => {
  try {
    // Get basic counts
    const totalAnime = await prisma.anime.count({
      where: { deleted_at: null }
    })

    const totalDeletedAnime = await prisma.anime.count({
      where: { deleted_at: { not: null } }
    })

    // Get counts by status
    const statusCounts = await prisma.anime.groupBy({
      by: ['release_status_type_id'],
      where: { deleted_at: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // Get counts by media type
    const mediaTypeCounts = await prisma.anime.groupBy({
      by: ['release_media_type_id'],
      where: { deleted_at: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // Get counts by season
    const seasonCounts = await prisma.anime.groupBy({
      by: ['season_id'],
      where: { deleted_at: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // Get counts by year
    const yearCounts = await prisma.anime.groupBy({
      by: ['year'],
      where: { 
        deleted_at: null,
        year: { not: null }
      },
      _count: { id: true },
      orderBy: { year: 'desc' }
    })

    // Get top rated anime
    const topRated = await prisma.anime.findMany({
      where: { 
        deleted_at: null,
        mean_score: { gt: 0 }
      },
      take: 10,
      orderBy: { mean_score: 'desc' },
      select: {
        id: true,
        title_romaji: true,
        title_english: true,
        mean_score: true,
        popularity: true
      }
    })

    // Get most popular anime
    const mostPopular = await prisma.anime.findMany({
      where: { 
        deleted_at: null,
        popularity: { gt: 0 }
      },
      take: 10,
      orderBy: { popularity: 'desc' },
      select: {
        id: true,
        title_romaji: true,
        title_english: true,
        mean_score: true,
        popularity: true
      }
    })

    // Get average scores
    const avgScores = await prisma.anime.aggregate({
      where: { 
        deleted_at: null,
        mean_score: { gt: 0 }
      },
      _avg: {
        mean_score: true,
        popularity: true,
        favorites: true,
        trending: true
      },
      _max: {
        mean_score: true,
        popularity: true,
        favorites: true,
        trending: true
      },
      _min: {
        mean_score: true,
        popularity: true,
        favorites: true,
        trending: true
      }
    })

    // Get recent additions
    const recentAdditions = await prisma.anime.findMany({
      where: { deleted_at: null },
      take: 10,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title_romaji: true,
        title_english: true,
        created_at: true,
        year: true
      }
    })

    const statistics = {
      overview: {
        totalAnime,
        totalDeletedAnime,
        activeAnime: totalAnime
      },
      distribution: {
        byStatus: statusCounts,
        byMediaType: mediaTypeCounts,
        bySeason: seasonCounts,
        byYear: yearCounts.slice(0, 10) // Last 10 years
      },
      topLists: {
        topRated,
        mostPopular,
        recentAdditions
      },
      averages: {
        meanScore: avgScores._avg.mean_score,
        popularity: avgScores._avg.popularity,
        favorites: avgScores._avg.favorites,
        trending: avgScores._avg.trending
      },
      extremes: {
        highestScore: avgScores._max.mean_score,
        lowestScore: avgScores._min.mean_score,
        mostPopular: avgScores._max.popularity,
        leastPopular: avgScores._min.popularity,
        mostFavorited: avgScores._max.favorites,
        mostTrending: avgScores._max.trending
      }
    }

    return {
      success: true,
      code: 200,
      message: 'Anime statistics retrieved successfully',
      length: 1,
      data: [statistics]
    }
  } catch (e: unknown) {
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving anime statistics.',
      length: 0,
      data: []
    }
  }
})
