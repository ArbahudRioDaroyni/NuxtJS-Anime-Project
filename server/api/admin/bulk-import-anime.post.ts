import type { H3Event } from 'h3'
import type { ResponseType } from '~/types/database'
// import type { AnimeImportCSV } from '~/types/anime'
import { getPrismaClient } from '~/server/utils/prisma'
import type { PrismaClient } from '@prisma/client'

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
    const invalidRecords: Array<{ record: Record<string, unknown>; error: string }> = []
    for (const record of records) {
      const validRecord: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(record)) {
        if (model && key in model) {
          validRecord[key] = value
        } else {
          invalidRecords.push({ record, error: key })
        }
      }
      validRecords.push(validRecord)
    }

    return {
      success: true,
      code: 200,
      message: 'Import validation completed.',
      length: 0,
      data: records,
      meta: {
        model: model,
        validRecords,
        invalidRecords: invalidRecords,
        invalidFields: [...new Set(invalidRecords.map(ir => ir.error))],
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