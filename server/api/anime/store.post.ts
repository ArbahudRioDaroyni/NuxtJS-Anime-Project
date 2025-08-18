import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import type { AnimeCreateInput } from '~/types/anime'
import { getPrismaClient } from '~/server/utils/prisma'
import { validateAnimeCreate, sanitizeInput } from '~/server/utils/animeValidation'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const rawBody = await readBody(event)
    const body: AnimeCreateInput = sanitizeInput(rawBody)
    
    // Validate input data
    const validation = validateAnimeCreate(body)
    if (!validation.isValid) {
      // event.node.res.statusCode = 400
      return {
        success: false,
        code: 400,
        message: `Validation failed: ${validation.errors.join(', ')}`,
        length: 0,
        data: []
      }
    }

    // Generate slug from title
    const slug = (body.slug || body.title_romaji || body.title_english || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingAnime = await prisma.anime.findUnique({
      where: { slug }
    })

    if (existingAnime) {
      // event.node.res.statusCode = 409
      return {
        success: false,
        code: 409,
        message: 'Anime with this slug already exists',
        length: 0,
        data: []
      }
    }

    const newAnime = await prisma.anime.create({
      data: {
        ...body,
        slug,
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        media_type: true,
        release_format: true,
        status_type: true,
        source_media_type: true,
        season: true
      }
    })

    // event.node.res.statusCode = 200
    return {
      success: true,
      code: 200,
      message: 'Anime created successfully',
      length: 1,
      data: [newAnime]
    }
  } catch (e: unknown) {
    // event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while creating anime.',
      length: 0,
      data: []
    }
  }
})
