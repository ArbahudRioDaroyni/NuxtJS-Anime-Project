import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

function generatePaginationURLs(baseURL: string, page: number, perPage: number, totalCount: number, search?: string, fields?: string) {
  const hasNext = (page * perPage) < totalCount;
  const hasPrev = page > 1;
  const nextPage = hasNext ? page + 1 : null;
  const prevPage = hasPrev ? page - 1 : null;
  const nextURL = hasNext ? `${baseURL}?page=${nextPage}&perPage=${perPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${fields ? `&fields=${encodeURIComponent(fields)}` : ''}` : null;
  const prevURL = hasPrev ? `${baseURL}?page=${prevPage}&perPage=${perPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${fields ? `&fields=${encodeURIComponent(fields)}` : ''}` : null;
  return { nextURL, prevURL, hasNext, hasPrev, nextPage, prevPage };
}

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const { safeSearch, safePerPage, safePage, safeFields } = event.context
    const query = getQuery(event);
    const limit = Math.max(1, Math.min(Number(safePerPage), 100))
    const offset = (Math.max(1, Number(safePage)) - 1) * limit
    const whereClause: Record<string, unknown> = safeSearch
      ? {
        AND: [
          {
            deleted_at: null,
            trending: { gt: 0 }
          },
          {
            OR: [
              { title_romaji: { contains: safeSearch.toString(), mode: 'insensitive' } },
              { title_english: { contains: safeSearch.toString(), mode: 'insensitive' } },
              { title_native: { contains: safeSearch.toString(), mode: 'insensitive' } }
            ]
          }
        ]
      }
      : {
        deleted_at: null,
        trending: { gt: 0 }
      }

    const totalCount = await prisma.anime.count({
      where: whereClause
    })

    if (totalCount === 0) {
      throw new Error('No trending anime found.', { cause: 404 })
    }

    let trendingAnime;
    if (safeFields) {
      trendingAnime = await prisma.anime.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: [
          { trending: 'desc' },
          { updated_at: 'desc' }
        ],
        select: safeFields
      });
    } else {
      trendingAnime = await prisma.anime.findMany({
        where: whereClause,
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
      });
    }

    if (trendingAnime.length === 0) {
      throw new Error('No trending anime found.', { cause: 404 })
    }

    const baseURL = '/api/anime/trending';
    const pagination = generatePaginationURLs(
      baseURL,
      Number(safePage),
      limit,
      totalCount,
      safeSearch ? safeSearch.toString() : undefined,
      query.fields ? (query.fields as string) : undefined
    );

    return {
      success: true,
      code: 200,
      message: 'Trending anime retrieved successfully',
      length: trendingAnime.length,
      meta: {
        total: totalCount,
        page: Number(safePage),
        totalPages: Math.ceil(totalCount / limit),
        perPage: limit,
        ...pagination
      },
      data: trendingAnime
    }
  } catch (e: unknown) {
    event.node.res.statusCode = e instanceof Error && typeof e.cause === 'number' ? e.cause : 500
    return {
      success: false,
      code: e instanceof Error && typeof e.cause === 'number' ? e.cause : 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving trending anime.',
      length: 0,
      data: []
    }
  }
})
