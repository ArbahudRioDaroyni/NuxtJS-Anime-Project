import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const staffId = getRouterParam(event, 'id')

    if (!staffId) {
      return {
        success: false,
        code: 400,
        message: 'Staff ID parameter is required',
        length: 0,
        data: []
      }
    }

    // Validate staff ID format
    if (isNaN(Number(staffId))) {
      return {
        success: false,
        code: 400,
        message: 'Invalid staff ID format. Staff ID should be a number',
        length: 0,
        data: []
      }
    }

    const staff = await prisma.voice_actors.findUnique({
      where: {
        id: parseInt(staffId)
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
            anime: true
          },
          // take: 15
        },
      }
    })

    if (!staff) {
      return {
        success: false,
        code: 404,
        message: `Staff member with ID "${staffId}" not found`,
        length: 0,
        data: []
      }
    }

    return {
      success: true,
      code: 200,
      message: 'Staff member fetched successfully',
      length: 1,
      data: [staff]
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
