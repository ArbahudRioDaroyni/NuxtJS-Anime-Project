import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const voiceActorId = getRouterParam(event, 'id')

    if (!voiceActorId) {
      return {
        success: false,
        code: 400,
        message: 'Voice actor ID parameter is required',
        length: 0,
        data: []
      }
    }

    if (isNaN(Number(voiceActorId))) {
      return {
        success: false,
        code: 400,
        message: 'Invalid voiceActor ID format. Voice actor ID should be a number',
        length: 0,
        data: []
      }
    }

    const voiceActor = await prisma.voice_actors.findUnique({
      where: {
        id: parseInt(voiceActorId)
      },
    })

    if (!voiceActor) {
      return {
        success: false,
        code: 404,
        message: `Voice actor member with ID "${voiceActorId}" not found`,
        length: 0,
        data: []
      }
    }

    return {
      success: true,
      code: 200,
      message: 'Voice actor member fetched successfully',
      length: 1,
      data: [voiceActor]
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