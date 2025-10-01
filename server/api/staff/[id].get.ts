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

    if (isNaN(Number(staffId))) {
      return {
        success: false,
        code: 400,
        message: 'Invalid staff ID format. Staff ID should be a number',
        length: 0,
        data: []
      }
    }

    const staff = await prisma.staff.findUnique({
      where: {
        id: parseInt(staffId)
      },
      include: {
        anime_staff_relations: {
          include: {
            anime: true,
            staff_role: true
          }
        }
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
