import type { H3Event } from 'h3'
import type { resultType } from '~/server/types/resultType'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<resultType> => {
  try {
    const body = await readBody(event)
    const result = await prisma.staff.createMany({
      data: body,
    })

    if (!result || result.count === 0) {
      throw new Error('No staff members were created. Please check the input data.');
    }

    return {
      data: [result],
      length: result.count || 0,
      status: 200,
      message: 'Staff member(s) created successfully',
    }
  } catch (e: unknown) {
    event.node.res.statusCode = 500;
    return { 
      data: [],
      length: 0,
      status: 500,
      message: e instanceof Error ? e.message : 'An error occurred while creating staff member(s)',
    }
  }
})