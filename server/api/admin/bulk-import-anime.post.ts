import { readFile } from 'fs/promises'
import { join } from 'path'
import { parse } from 'csv-parse/sync'
import prisma from '~/lib/prisma'

interface CSVAnimeRow {
  anime_id: string
  anime_url: string
  image_url: string
  name: string
  english_name: string
  japanese_names: string
  score: string
  genres: string
  themes: string
  demographics: string
  synopsis: string
  type: string
  episodes: string
  premiered: string
  producers: string
  studios: string
  source: string
  duration: string
  rating: string
  rank: string
  popularity: string
  favorites: string
  scored_by: string
  members: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { batchSize = 50, offset = 0 } = body

    // Read CSV file
    const csvPath = join(process.cwd(), 'database', 'top_15000_anime.csv')
    const fileContent = await readFile(csvPath, 'utf-8')
    
    // Parse CSV
    const records: CSVAnimeRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    // Get batch
    const batch = records.slice(offset, offset + batchSize)
    
    if (batch.length === 0) {
      return {
        success: true,
        message: 'Import completed',
        processed: 0,
        total: records.length,
        hasMore: false
      }
    }

    let successCount = 0
    let errorCount = 0
    const errors: Array<{ anime: string; error: string }> = []

    // Process each anime in batch
    for (const row of batch) {
      try {
        // Generate slug from name
        const slug = row.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        // Parse genres, themes, demographics
        const genresList = row.genres ? row.genres.split(',').map(g => g.trim()) : []
        const themesList = row.themes ? row.themes.split(',').map(t => t.trim()) : []
        const demographicsList = row.demographics ? row.demographics.split(',').map(d => d.trim()) : []
        
        // Combine all tags
        const allTags = [...genresList, ...themesList, ...demographicsList].filter(Boolean)

        // Parse studios
        const studiosList = row.studios ? row.studios.split(',').map(s => s.trim()) : []

        // Parse premiered for season and year
        let season = null
        let year = null
        if (row.premiered) {
          const [seasonPart, yearPart] = row.premiered.split(' ')
          season = seasonPart || null
          year = yearPart || null
        }

        // Parse duration to get minutes
        let duration = null
        let durationUnit = null
        if (row.duration) {
          const durationMatch = row.duration.match(/(\d+)\s*(min|hr|sec)/)
          if (durationMatch) {
            duration = parseInt(durationMatch[1])
            durationUnit = durationMatch[2].charAt(0) // 'm', 'h', or 's'
          }
        }

        // Get or create release media type
        let mediaTypeId = null
        if (row.type) {
          const mediaType = await prisma.release_media_types.upsert({
            where: { name: row.type },
            create: { name: row.type },
            update: {}
          })
          mediaTypeId = mediaType.id
        }

        // Get or create season
        let seasonId = null
        if (season) {
          const seasonRecord = await prisma.seasons.upsert({
            where: { name: season },
            create: { name: season },
            update: {}
          })
          seasonId = seasonRecord.id
        }

        // Upsert anime
        const anime = await prisma.anime.upsert({
          where: { slug },
          create: {
            slug,
            title_romaji: row.name,
            title_english: row.english_name || null,
            title_native: row.japanese_names || null,
            release_media_type_id: mediaTypeId,
            description: row.synopsis || null,
            year: year,
            season_id: seasonId,
            episodes: row.episodes ? parseInt(row.episodes) : null,
            duration: duration,
            duration_unit: durationUnit,
            picture_image_url: row.image_url || null,
            mean_score: row.score ? parseFloat(row.score) : null,
            popularity: row.popularity ? parseInt(row.popularity) : null,
            favorites: row.favorites ? parseInt(row.favorites) : null,
            is_licensed: true,
            is_adult: false,
            is_locked: false
          },
          update: {
            title_romaji: row.name,
            title_english: row.english_name || null,
            title_native: row.japanese_names || null,
            release_media_type_id: mediaTypeId,
            description: row.synopsis || null,
            year: year,
            season_id: seasonId,
            episodes: row.episodes ? parseInt(row.episodes) : null,
            duration: duration,
            duration_unit: durationUnit,
            picture_image_url: row.image_url || null,
            mean_score: row.score ? parseFloat(row.score) : null,
            popularity: row.popularity ? parseInt(row.popularity) : null,
            favorites: row.favorites ? parseInt(row.favorites) : null,
            updated_at: new Date()
          }
        })

        // Handle genres
        for (const genreName of genresList) {
          if (!genreName) continue
          
          const genre = await prisma.genres.upsert({
            where: { name: genreName },
            create: { 
              name: genreName,
              slug: genreName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            },
            update: {}
          })

          // Create relation if not exists
          await prisma.anime_genre_relations.upsert({
            where: {
              id: 0 // Will create new if not found
            },
            create: {
              anime_id: anime.id,
              genre_id: genre.id
            },
            update: {}
          }).catch(() => {
            // Ignore duplicate errors
          })
        }

        // Handle studios
        for (const studioName of studiosList) {
          if (!studioName) continue
          
          const studio = await prisma.studios.upsert({
            where: { name: studioName },
            create: { 
              name: studioName,
              is_animation_studio: true
            },
            update: {}
          })

          // Create relation if not exists
          await prisma.anime_studio_relations.upsert({
            where: {
              id: 0 // Will create new if not found
            },
            create: {
              anime_id: anime.id,
              studio_id: studio.id,
              is_main: true
            },
            update: {}
          }).catch(() => {
            // Ignore duplicate errors
          })
        }

        // Handle tags (themes + demographics)
        for (const tagName of allTags) {
          if (!tagName) continue
          
          const tag = await prisma.tags.upsert({
            where: { name: tagName },
            create: { 
              name: tagName,
              is_general_spoiler: false
            },
            update: {}
          })

          // Create relation if not exists
          await prisma.anime_tag_relations.upsert({
            where: {
              id: 0 // Will create new if not found
            },
            create: {
              anime_id: anime.id,
              tag_id: tag.id,
              is_spoiler: false
            },
            update: {}
          }).catch(() => {
            // Ignore duplicate errors
          })
        }

        successCount++
      } catch (error) {
        errorCount++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push({
          anime: row.name,
          error: errorMessage
        })
      }
    }

    const newOffset = offset + batchSize
    const hasMore = newOffset < records.length

    return {
      success: true,
      processed: successCount,
      failed: errorCount,
      total: records.length,
      currentOffset: offset,
      nextOffset: newOffset,
      hasMore,
      errors: errors.length > 0 ? errors : undefined,
      progress: Math.round((newOffset / records.length) * 100)
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Bulk import error:', error)
    return {
      success: false,
      error: errorMessage
    }
  }
})
