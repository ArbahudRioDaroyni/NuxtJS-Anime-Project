import type { PrismaClient } from '@prisma/client'
import type { ResponseType } from '~/types/database'
import { getPrismaClient, getPrismaModelFieldsFromQuery } from '~/server/utils/prisma'

const prisma = getPrismaClient()

export default defineEventHandler(async (): Promise<ResponseType> => {
  try {
    const tableName = 'anime'
    const fields = await getPrismaModelFieldsFromQuery(tableName)
    const model = (prisma as PrismaClient)[tableName]?.fields;

    // const fieldsFromModel = getPrismaModelFields(tableName)
    return {
      success: true,
      code: 200,
      message: 'Test endpoint is working',
      length: 0,
      data: [],
      meta: {
        fields: fields,
        model: model
      }
    }
  } catch (error) {
    console.error('Error in test endpoint:', error)
    return {
      success: false,
      code: 500,
      message: 'Internal server error',
      length: 0,
      data: []
    }
    
  }
});