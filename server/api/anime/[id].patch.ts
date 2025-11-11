import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import type { AnimeCreateInput } from '~/types/anime'
import { getPrismaClient } from '~/server/utils/prisma'
import { validateAnimeUpdate, sanitizeInput } from '~/server/utils/animeValidation'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  // Require Admin role or higher
  await requireAdmin(event)
  
  try {
    const id = getRouterParam(event, 'id')
    const safeId = Number(id)

    if (!safeId || isNaN(Number(safeId)) || Number(safeId) <= 0) {
      // event.node.res.statusCode = 400
      return {
        success: false,
        code: 400,
        message: `Invalid ID: ${id}. It must be a positive number.`,
        length: 0,
        data: []
      }
    }

    const rawBody = await readBody(event)
    const body: Partial<AnimeCreateInput> = sanitizeInput(rawBody)

    // Validate input data
    const validation = validateAnimeUpdate(body)
    if (!validation.isValid) {
      // event.node.res.statusCode = 400
      return {
        success: false,
        code: 400,
        message: `Validation failed: ${validation.errors.join(', ')}`,
        length: 0,
        data: [],
      }
    }

    // Check if anime exists
    const existingAnime = await prisma.anime.findUnique({
      where: { id: safeId }
    })

    if (!existingAnime) {
      // event.node.res.statusCode = 404
      return {
        success: false,
        code: 404,
        message: `Anime with ID ${safeId} not found.`,
        length: 0,
        data: []
      }
    }

    // Update only provided fields
    const updateData: Partial<AnimeCreateInput> & { updated_at: Date } = { ...body, updated_at: new Date() }

    // Handle slug update if title fields are being updated
    if (body.title_romaji || body.title_english) {
      const newTitle = body.title_romaji || body.title_english || existingAnime.title_romaji || existingAnime.title_english || ''
      const newSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      if (newSlug !== existingAnime.slug) {
        const slugConflict = await prisma.anime.findUnique({
          where: { slug: newSlug }
        })
        
        if (slugConflict) {
          // event.node.res.statusCode = 409
          return {
            success: false,
            code: 409,
            message: 'Anime with this slug already exists',
            length: 0,
            data: []
          }
        }
        
        updateData.slug = newSlug
      }
    }

    const updatedAnime = await prisma.anime.update({
      where: { id: safeId },
      data: updateData,
      include: {
        media_type: true,
        release_format: true,
        status_type: true,
        source_media_type: true,
        season: true
      }
    })

    return {
      success: true,
      code: 200,
      message: 'Anime updated successfully',
      length: 1,
      data: [updatedAnime]
    }
  } catch (e: unknown) {
    // event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred while updating anime.',
      length: 0,
      data: []
    }
  }
})
