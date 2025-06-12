import type { H3Event } from 'h3'
import type { resultType } from '~/server/types/resultType'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<resultType> => {
  try {
    const id = getRouterParam(event, 'id') // get the id from the route parameter
    const safeId = Number(id)

    if (!safeId || isNaN(Number(safeId)) || Number(safeId) <= 0) { // check if id is available, numeric, and greater than 0
      throw new Error(`Invalid ID: ${id}. It must be a positive number.`)
    }

    const result = await prisma.voice_actors.findUnique({
      where: { id: safeId }
    })

    if (!result) {
      throw new Error(`Voice actors member with ID ${safeId} not found.`)
    }

    return {
      data: [result],
      length: 1,
      status: 200,
      message: 'Voice actors retrieved successfully'
    }
  } catch (e: unknown) {
    event.node.res.statusCode = 500;
    return { 
      data: [],
      length: 0,
      status: 500,
      message: e instanceof Error ? e.message : 'An error occurred while creating voice actors member(s)',
    }
  }
})