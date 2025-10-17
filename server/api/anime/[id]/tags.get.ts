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

    // Get tags for the anime
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
            anime_tag_relations: true
          }
        },
        anime_tag_relations: {
          select: {
            is_spoiler: true,
            rank: true,
            tag: {
              select: {
                id: true,
                description: true,
                name: true,
                is_general_spoiler: true,
                tag_category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          take: limit,
          skip: offset
        }
      }
    })

    const staff = anime?.anime_tag_relations || []
    const staffLenght = staff?.length || 0
    const totalCount = anime?._count.anime_tag_relations || 0
    const pagination = usePagination(
      page,
      limit,
      totalCount,
      `/api/anime/${safeId}/tags`
    )

    return {
      success: true,
      code: 200,
      message: 'Data retrieved successfully',
      length: staffLenght,
      data: staff,
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
