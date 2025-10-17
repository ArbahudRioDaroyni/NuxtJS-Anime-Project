import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'
import { usePagination } from '~/server/utils/pagination'

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
    const pagination = usePagination(
      page,
      limit,
      totalCount,
      `/api/anime/${safeId}/characters`
    )

    return {
      success: true,
      code: 200,
      message: 'Data retrieved successfully',
      length: charactersLenght,
      data: characters,
      pagination,
      meta: {
        anime_id: anime?.id,
        anime_slug: anime?.slug,
        anime_title: anime?.title_romaji
      }
    }
  } catch (e: unknown) {
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving data.',
      length: 0,
      data: []
    }
  }
})
