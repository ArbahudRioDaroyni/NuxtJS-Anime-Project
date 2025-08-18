import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

// const sanitizeText = (text) => {
//   return text
//     .replace(/&/g, '-&-')
//     .replace(/[^a-zA-Z0-9!.\s_-]/g, '')
//     .replace(/_/g, '-')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
//     .toLowerCase()
//     .trim();
// };

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const slug = getRouterParam(event, 'slug')
    
    if (!slug) {
      return {
        success: false,
        code: 400,
        message: 'Slug parameter is required',
        length: 0,
        data: []
      }
    }

    // Validate slug format (should be URL-safe)
    if (!/^[a-z0-9!.\s_-]+(?:-[a-z0-9!.\s_-]+)*$/.test(slug)) {
      return {
        success: false,
        code: 400,
        message: 'Invalid slug format. Slug should contain only lowercase letters, numbers, and hyphens',
        length: 0,
        data: []
      }
    }

    const anime = await prisma.anime.findFirst({
      where: {
        slug: slug,
        deleted_at: null
      },
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
                source_media_type : { omit: { id: true } },
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
                medium_image_url: true
              }
            },
            voice_actor: {
              select: {
                id: true,
                name: true,
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
            staff: {
              select: {
                name: true,
                medium_image_url: true
              }
            },
            staff_role: { select: { name: true } }
          },
          // take: 10
        },
      }
    })

    if (!anime) {
      return {
        success: false,
        code: 404,
        message: `Anime with slug "${slug}" not found`,
        length: 0,
        data: []
      }
    }

    return {
      success: true,
      code: 200,
      message: `Anime "${anime.title_romaji}" retrieved successfully`,
      length: 1,
      data: [anime],
      meta: {
        slug: slug,
        retrievedAt: new Date().toISOString(),
        includesRelations: true
      }
    }

  } catch (e: unknown) {
    console.error('Error fetching anime by slug:', e)
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'Failed to retrieve anime',
      length: 0,
      data: []
    }
  }
})
