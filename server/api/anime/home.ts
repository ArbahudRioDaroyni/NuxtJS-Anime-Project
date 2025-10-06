import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

function generatePaginationURLs(baseURL: string, page: number, perPage: number, totalCount: number) {
  const hasNext = (page * perPage) < totalCount;
  const hasPrev = page > 1;
  const nextPage = hasNext ? page + 1 : null;
  const prevPage = hasPrev ? page - 1 : null;
  const nextURL = hasNext ? `${baseURL}?page=${nextPage}&perPage=${perPage}` : null;
  const prevURL = hasPrev ? `${baseURL}?page=${prevPage}&perPage=${perPage}` : null;
  return { nextURL, prevURL, hasNext, hasPrev, nextPage, prevPage };
}

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const { safePerPage, safePage } = event.context
    const limit = Math.max(1, Math.min(Number(safePerPage), 100))
    const offset = (Math.max(1, Number(safePage)) - 1) * limit
    const whereClause: Record<string, unknown> = {
      deleted_at: null,
      trending: { gt: 0 }
    }

    const totalCount = await prisma.anime.count({
      where: whereClause
    })

    if (totalCount === 0) {
      throw new Error('No anime found.', { cause: 404 })
    }

    // Get trending anime
    const trendingAnime = await prisma.anime.findMany({
      where: {
        deleted_at: null,
        trending: { gt: 0 }
      },
      take: limit,
      skip: offset,
      orderBy: [
        { trending: 'desc' },
        { updated_at: 'desc' }
      ],
      select: {
        slug: true,
        title_romaji: true,
        title_english: true,
        title_native: true,
        medium_cover_image_url: true,
        large_cover_image_url: true
      }
    });

    if (trendingAnime.length === 0) {
      throw new Error('No anime found.', { cause: 404 })
    }

    // Get favorites anime
    const favoritesAnime = await prisma.anime.findMany({
      where: {
        deleted_at: null,
        favorites: { gt: 0 }
      },
      take: limit,
      orderBy: [
        { favorites: 'desc' },
        { updated_at: 'desc' }
      ],
      select: {
        slug: true,
        title_romaji: true,
        title_english: true,
        title_native: true,
        medium_cover_image_url: true,
        large_cover_image_url: true
      }
    });

    // Get popular anime
    const popularAnime = await prisma.anime.findMany({
      where: {
        deleted_at: null,
        popularity: { gt: 0 }
      },
      take: limit,
      orderBy: [
        { popularity: 'desc' },
        { updated_at: 'desc' }
      ],
      select: {
        slug: true,
        title_romaji: true,
        title_english: true,
        title_native: true,
        medium_cover_image_url: true,
        large_cover_image_url: true
      }
    });

    const baseURL = '/api/anime/home';
    const pagination = generatePaginationURLs(
      baseURL,
      Number(safePage),
      limit,
      totalCount
    );

    return {
      success: true,
      code: 200,
      message: 'Home anime data retrieved successfully',
      length: trendingAnime.length + favoritesAnime.length + popularAnime.length,
      meta: {
        total: totalCount,
        page: Number(safePage),
        totalPages: Math.ceil(totalCount / limit),
        perPage: limit,
        ...pagination,
        trending: {
          count: trendingAnime.length,
          data: trendingAnime
        },
        favorites: {
          count: favoritesAnime.length,
          data: favoritesAnime
        },
        popular: {
          count: popularAnime.length,
          data: popularAnime
        }
      },
      data: []
    }
  } catch (e: unknown) {
    event.node.res.statusCode = e instanceof Error && typeof e.cause === 'number' ? e.cause : 500
    return {
      success: false,
      code: e instanceof Error && typeof e.cause === 'number' ? e.cause : 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving home anime data.',
      length: 0,
      data: []
    }
  }
})
