import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const key = getRouterParam(event, 'id')
    const query = getQuery(event)
    const searchBySlug = useStringValidator(query['search-by'], '', 255) === 'slug' ? true : false
    const safeId = useNumberValidator(key, NaN, -1)
    const isValidId = !isNaN(safeId) && safeId > 0
    const safeSlug = useSlugValidator(key)
    const whereClause = searchBySlug
      ? { slug: String(safeSlug), deleted_at: null }
      : { id: safeId, deleted_at: null }

    if (!searchBySlug && !isValidId) {
      throw new Error(`Invalid ID: '${key}'. It must greater than 0.`)
    }

    if (searchBySlug && !safeSlug) {
      throw new Error(`Invalid slug: '${key}'. It must be a URL-safe string.`)
    }

    const anime = await prisma.anime.findUnique({
      where: whereClause,
      include: {
        media_type: { omit: { id: true } },
        release_format: { omit: { id: true } },
        status_type: { omit: { id: true } },
        source_media_type: { omit: { id: true } },
        season: true,
        anime_studio_relations: {
          select: {
            studio: { omit: { id: true } },
            is_main: true
          }
        },
        anime_genre_relations: true,
        anime_external_site_relations: {
          select: {
            url: true,
            external_site: { omit: { id: true } }
          }
        },
        anime_relation_relations_as_anime: {
          select: {
            reference_anime: {
              select: {
                id: true,
                slug: true,
                title_romaji: true,
                title_english: true,
                medium_cover_image_url: true,
                source_media_type: { omit: { id: true } },
                status_type: { omit: { id: true } }
              }
            },
            reference_type: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        anime_relation_relations_as_reference_anime: {
          select: {
            reference_anime: {
              select: {
                id: true,
                slug: true,
                title_romaji: true,
                title_english: true,
                medium_cover_image_url: true
              }
            },
            reference_type: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        anime_tag_relations: true,
        anime_characters_voice_actor_relations: {
          select: {
            character: {
              select: {
                id: true,
                name: true,
                name_native: true,
                medium_image_url: true
              }
            },
            voice_actor: {
              select: {
                id: true,
                name: true,
                name_native: true,
                medium_image_url: true,
                home_town: true,
              }
            },
            character_role: {
              select: { name: true }
            }
          },
          // take: 15
        },
        anime_staff_relations: {
          select: {
            staff: true,
            staff_role: { select: { name: true } }
          },
          // take: 10
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
        meta: {
          id: safeId,
          slug: safeSlug
        },
        data: [],
      }
    }

    return {
      success: true,
      code: 200,
      message: 'Anime retrieved successfully',
      length: 1,
      meta: {
        id: safeId,
        slug: safeSlug
      },
      data: [anime],
    }
  } catch (e: unknown) {
    event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving anime.',
      length: 0,
      data: [],
    }
  }
})
