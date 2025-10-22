import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { slugs } = body

    if (!slugs || !Array.isArray(slugs)) {
      return {
        status: 400,
        message: 'Invalid slugs parameter',
        data: null
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
      status: 200,
      message: 'Success',
      data: existingAnime
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Check anime exists error:', error)
    return {
      status: 500,
      message: errorMessage,
      data: null
    }
  }
})
