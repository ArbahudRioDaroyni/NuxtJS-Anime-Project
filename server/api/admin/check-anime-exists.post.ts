import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const body = await readBody(event)
    const { slugs } = body

    if (!slugs || !Array.isArray(slugs)) {
      return {
        success: false,
        code: 400,
        message: 'Invalid slugs parameter',
        length: 0,
        data: []
      }
    }

    // Fetch existing anime with matching slugs
    const existingAnime = await prisma.anime.findMany({
      where: {
        slug: {
          in: slugs
        }
      }
    })

    return {
      success: true,
      code: 200,
      message: 'Checked anime existence successfully',
      length: 0,
      data: existingAnime
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
