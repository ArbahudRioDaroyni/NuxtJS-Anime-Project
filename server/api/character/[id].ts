import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const characterId = getRouterParam(event, 'id')

    if (!characterId) {
      return {
        success: false,
        code: 400,
        message: 'Character ID parameter is required',
        length: 0,
        data: []
      }
    }

    if (isNaN(Number(characterId))) {
      return {
        success: false,
        code: 400,
        message: 'Invalid character ID format. Character ID should be a number',
        length: 0,
        data: []
      }
    }

    const character = await prisma.characters.findUnique({
      where: {
        id: parseInt(characterId)
      },
      include: {
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
            },
            anime: {
              select: {
                id: true,
                slug: true,
                title_romaji: true,
                medium_cover_image_url: true,
                extra_large_cover_image_url: true,
              }
            }
          },
          // take: 15
        },
      }
    })

    if (!character) {
      return {
        success: false,
        code: 404,
        message: `Character member with ID "${characterId}" not found`,
        length: 0,
        data: []
      }
    }

    return {
      success: true,
      code: 200,
      message: 'Character member fetched successfully',
      length: 1,
      data: [character]
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
