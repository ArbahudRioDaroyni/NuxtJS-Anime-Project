import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
import type { PrismaClient } from '@prisma/client'
// import type { AnimeImportCSV } from '~/types/anime'
import { getPrismaClient } from '~/server/utils/prisma'
import { validateRecordAgainstModel } from '~/server/utils/validation'

const prisma = getPrismaClient()

export default defineEventHandler(async (event: H3Event): Promise<ResponseType> => {
  try {
    const body = await readBody(event)
    const { records } = body

    if (!records || !Array.isArray(records)) {
      return {
        success: false,
        code: 400,
        message: 'Invalid records parameter',
        length: 0,
        data: [],
      }
    }

    const model = (prisma as PrismaClient)['anime' as keyof PrismaClient]?.fields;
    const validRecords: Record<string, unknown>[] = []
    const invalidFields: string[] = []
    const _recordCount = records.length
    let successCount = 0

    for (const record of records) {
      const { valid, data, errors } = validateRecordAgainstModel(record, model)
      if (!valid) {
        invalidFields.push(...errors)
      }

      validRecords.push(data)
    }

    for (const field of validRecords) {
      const _anime = await prisma.anime.upsert({
        where: { slug: String(field.slug) },
        create: {
          slug: String(field.slug),
          title_romaji: String(field.title_romaji),
          title_english: field.title_english ? String(field.title_english) : null,
          title_native: field.title_native ? String(field.title_native) : null,
          release_format_id: field.release_format_id ? parseFloat(String(field.release_format_id)) : null,
          source_media_type_id: field.source_media_type_id ? parseFloat(String(field.source_media_type_id)) : null,
          year: field.year != null && field.year !== '' ? String(field.year) : null,
          season_id: field.season_id ? parseFloat(String(field.season_id)) : null,
          score: field.score != null && field.score !== '' ? parseFloat(String(field.score)) : null,
          rank: field.rank != null && field.rank !== '' ? parseInt(String(field.rank), 10) : null,
          episodes: field.episodes != null && field.episodes !== '' ? parseInt(String(field.episodes), 10) : null,
          duration: field.duration != null && field.duration !== '' ? Number(field.duration) : null,
          duration_unit: 'm',
          created_at: new Date(),
        },
        update: {
          title_romaji: String(field.title_romaji),
          title_english: field.title_english ? String(field.title_english) : null,
          title_native: field.title_native ? String(field.title_native) : null,
          release_format_id: field.release_format_id ? parseFloat(String(field.release_format_id)) : null,
          source_media_type_id: field.source_media_type_id ? parseFloat(String(field.source_media_type_id)) : null,
          year: field.year != null && field.year !== '' ? String(field.year) : null,
          season_id: field.season_id ? parseFloat(String(field.season_id)) : null,
          score: field.score != null && field.score !== '' ? parseFloat(String(field.score)) : null,
          rank: field.rank != null && field.rank !== '' ? parseInt(String(field.rank), 10) : null,
          episodes: field.episodes != null && field.episodes !== '' ? parseInt(String(field.episodes), 10) : null,
          duration: field.duration != null && field.duration !== '' ? Number(field.duration) : null,
          duration_unit: 'm',
          updated_at: new Date(),
        }
      })

      successCount++
    }

    return {
      success: true,
      code: 200,
      message: 'Import validation completed.',
      length: successCount,
      data: records,
      meta: {
        model: model,
        validRecords,
        // invalidRecords,
        invalidFields: [...new Set(invalidFields)],
      }
    }
  } catch (e: unknown) {
    event.node.res.statusCode = 500
    return {
      success: false,
      code: 500,
      message: e instanceof Error ? e.message : 'An error occurred during import.',
      length: 0,
      data: [],
    }
  }
})