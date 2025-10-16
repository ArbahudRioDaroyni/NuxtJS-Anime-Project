import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const id = getRouterParam(event, 'id')
    const safeId = useNumberValidator(id, NaN, -1)
    const isValidId = !isNaN(safeId) && safeId > 0
   
    if (!isValidId) {
      return {
        success: false,
        code: 400,
        message: 'ID parameter is required and must be a number greater than 0',
        length: 0,
        data: []
      }
    }

    // Get query parameters for pagination
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const offset = (page - 1) * limit

    // Get characters for the anime
    const anime = await prisma.anime.findFirst({
      where: {
        id: safeId,
        deleted_at: null
      },
      select: {
        id: true,
        slug: true,
        title_romaji: true,
        _count: {
          select: {
            anime_characters_voice_actor_relations: true
          }
        },
        anime_characters_voice_actor_relations: {
          select: {
            id: true,
            character: {
              select: {
                id: true,
                name: true,
                name_native: true,
                medium_image_url: true,
                large_image_url: true
              }
            },
            voice_actor: {
              select: {
                id: true,
                name: true,
                name_native: true,
                medium_image_url: true,
                large_image_url: true
              }
            },
            character_role: {
              select: {
                name: true
              }
            }
          },
          take: limit,
          skip: offset
        }
      }
    })

    const characters = anime?.anime_characters_voice_actor_relations || []
    const charactersLenght = characters?.length || 0
    const totalCount = anime?._count.anime_characters_voice_actor_relations || 0
    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      code: 200,
      message: 'Characters retrieved successfully',
      length: charactersLenght,
      data: characters,
      meta: {
        anime_id: anime?.id,
        anime_slug: anime?.slug,
        anime_title: anime?.title_romaji,
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        nextLink: page < totalPages ? `/api/anime/${safeId}/characters?page=${page + 1}&limit=${limit}` : null,
        prevLink: page > 1 ? `/api/anime/${safeId}/characters?page=${page - 1}&limit=${limit}` : null
      }
    }
  } catch (e: unknown) {
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving characters.',
      length: 0,
      data: []
    }
  }
})
