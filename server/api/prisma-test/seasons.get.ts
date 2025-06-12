import { PrismaClient } from '@prisma/client'
import type { seasons as Seasons } from '@prisma/client'
import type { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  const idParam = getQuery(event).id
  const id = Number(idParam)
  if (!id || isNaN(id)) {
    return { error: 'Missing or invalid id parameter' }
  }

  const result: Seasons | null = await prisma.seasons.findUnique({
    where: { id }
  })

  if (!result) {
    return { error: 'Seasons not found' }
  }

  return result
})