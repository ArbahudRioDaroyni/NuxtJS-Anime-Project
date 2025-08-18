import type { H3Event } from 'h3'
import type { resultType } from '~/server/types/resultType'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<resultType> => {
  try {
    const { safeSearch = '', safeFields, safeLimit = 10, safeOffset = 0 } = event.context
    
    const select = safeFields ? safeFields : undefined

    const charactersList = await prisma.characters.findMany({
      where: safeSearch ? { name: { contains: safeSearch } } : undefined,
      select,
      take: safeLimit,
      skip: safeOffset,
      orderBy: { name: 'asc' },
    })

    return {
      data: charactersList,
      length: charactersList.length,
      status: 200,
      message: 'Characters retrieved successfully',
    }
  } catch (e: unknown) {
    event.node.res.statusCode = 500;
    return {
      data: [],
      length: 0,
      status: 500,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving characters.',
    }
  }
})
