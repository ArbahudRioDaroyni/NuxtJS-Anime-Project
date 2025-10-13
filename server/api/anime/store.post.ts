import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import type { AnimeCreateInput } from '~/types/anime'
import { getPrismaClient } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const body = await readBody<AnimeCreateInput>(event)
    
    // Validasi basic
    if (!body.title_romaji && !body.title_english) {
      setResponseStatus(event, 400)
      return {
        success: false,
        code: 400,
        message: 'At least one title (title_romaji or title_english) is required',
        length: 0,
        data: []
      }
    }

    // Generate slug from title
    const slug = (body.slug || body.title_romaji || body.title_english || '')
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingAnime = await prisma.anime.findUnique({
      where: { slug }
    })

    if (existingAnime) {
      setResponseStatus(event, 409)
      return {
        success: false,
        code: 409,
        message: 'Anime with this slug already exists',
        length: 0,
        data: []
      }
    }

    // Extract relation IDs and slug (will be regenerated)
    const { studio_ids, genre_ids, slug: _bodySlug, ...animeData } = body
    
    // Build clean data object without undefined values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanedAnimeData: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(animeData)) {
      if (value !== undefined && value !== null && value !== '') {
        cleanedAnimeData[key] = value
      }
    }

    // Create anime with relations using transaction
    const newAnime = await prisma.$transaction(async (tx) => {
      // Create anime
      const anime = await tx.anime.create({
        data: {
          title_romaji: cleanedAnimeData.title_romaji,
          title_english: cleanedAnimeData.title_english,
          title_native: cleanedAnimeData.title_native,
          description: cleanedAnimeData.description,
          release_media_type_id: cleanedAnimeData.release_media_type_id,
          release_format_id: cleanedAnimeData.release_format_id,
          release_status_type_id: cleanedAnimeData.release_status_type_id,
          source_media_type_id: cleanedAnimeData.source_media_type_id,
          season_id: cleanedAnimeData.season_id,
          year: cleanedAnimeData.year,
          start_date: cleanedAnimeData.start_date,
          end_date: cleanedAnimeData.end_date,
          episodes: cleanedAnimeData.episodes,
          duration: cleanedAnimeData.duration,
          duration_unit: cleanedAnimeData.duration_unit,
          origin: cleanedAnimeData.origin,
          thumbnail_image_url: cleanedAnimeData.thumbnail_image_url,
          medium_cover_image_url: cleanedAnimeData.medium_cover_image_url,
          large_cover_image_url: cleanedAnimeData.large_cover_image_url,
          extra_large_cover_image_url: cleanedAnimeData.extra_large_cover_image_url,
          banner_image_url: cleanedAnimeData.banner_image_url,
          color_image: cleanedAnimeData.color_image,
          is_licensed: cleanedAnimeData.is_licensed,
          is_adult: cleanedAnimeData.is_adult,
          slug,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      
      // Create studio relations
      if (studio_ids && studio_ids.length > 0) {
        await tx.anime_studio_relations.createMany({
          data: studio_ids.map((studio_id, index) => ({
            anime_id: anime.id,
            studio_id,
            is_main: index === 0 // First studio is main
          }))
        })
      }

      // Create genre relations
      if (genre_ids && genre_ids.length > 0) {
        await tx.anime_genre_relations.createMany({
          data: genre_ids.map(genre_id => ({
            anime_id: anime.id,
            genre_id
          }))
        })
      }

      // Fetch complete anime with relations
      return await tx.anime.findUnique({
        where: { id: anime.id },
        include: {
          media_type: true,
          release_format: true,
          status_type: true,
          source_media_type: true,
          season: true,
          anime_studio_relations: {
            include: {
              studio: true
            }
          },
          anime_genre_relations: {
            include: {
              genre: true
            }
          }
        }
      })
    })

    setResponseStatus(event, 201)
    return {
      success: true,
      code: 201,
      message: 'Anime created successfully',
      length: 1,
      data: [newAnime]
    }
  } catch (e: unknown) {
    console.error('❌ Error creating anime:', e)
    
    // Better error message
    let errorMessage = 'An error occurred while creating anime.'
    let statusCode = 500
    
    if (e instanceof Error) {
      console.error('Error stack:', e.stack)
      errorMessage = e.message
      
      // Prisma specific errors
      if (e.message.includes('Unique constraint')) {
        errorMessage = 'This anime already exists (duplicate slug or unique field)'
        statusCode = 409
      } else if (e.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid relation ID provided (media type, format, status, season, studio, or genre)'
        statusCode = 400
      }
    }
    
    setResponseStatus(event, statusCode)
    return {
      success: false,
      code: statusCode,
      message: errorMessage,
      length: 0,
      data: []
    }
  }
})
