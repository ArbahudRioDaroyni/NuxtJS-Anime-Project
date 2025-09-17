import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const id = getRouterParam(event, 'id') // get the id from the route parameter
    const safeId = Number(id)

    if (!safeId || isNaN(Number(safeId)) || Number(safeId) <= 0) {
      throw new Error(`Invalid ID: ${id}. It must be a positive number.`)
    }

    const anime = await prisma.anime.findUnique({
      where: { 
        id: safeId,
        deleted_at: null // Exclude soft-deleted anime
      },
      include: {
        media_type: { omit: { id: true } },
        release_format: { omit: { id: true } },
        status_type: { omit: { id: true } },
        source_media_type: { omit: { id: true } },
        season: true,
        anime_studio_relations: {
          include: {
            studio: {
              omit: { id: true }
            }
          }
        },
        anime_genre_relations: {
          include: { genre: true }
        },
        anime_tag_relations: {
          include: {
            tag: {
              omit: { id: true }
            }
          }
        },
        anime_external_site_relations: {
          select: {
            url: true,
            external_site: {
              omit: { id: true }
            }
          }
        },
        anime_relation_relations_as_anime: {
          include: {
            reference_anime: true,
            reference_type: true
          }
        },
        anime_relation_relations_as_reference_anime: {
          omit: {
            id: true,
            anime_id: true,
            reference_anime_id: true,
            reference_type_id: true,
          },
          include: {
            anime: {
              select: {
                slug: true,
                title_romaji: true,
                title_english: true, title_native: true,
                episodes: true,
                picture_image_url: true,
                extra_large_cover_image_url: true,
                large_cover_image_url: true,
                medium_cover_image_url: true,
                thumbnail_image_url: true,
                banner_image_url: true,
                color_image: true,
                popularity: true,
                trending: true,
                favorites: true,
                is_locked: true,
              }
            },
            reference_type: { omit: { id: true } }
          }
        },
      }
    })

    if (!anime) {
      // event.node.res.statusCode = 404
      return {
        success: false,
        code: 404,
        message: `Anime with ID ${safeId} not found.`,
        length: 0,
        data: [],
      }
    }

    return {
      success: true,
      code: 200,
      message: 'Anime retrieved successfully',
      length: 1,
      data: [anime],
    }
  } catch (e: unknown) {
    // event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving anime.',
      length: 0,
      data: [],
    }
  }
})
