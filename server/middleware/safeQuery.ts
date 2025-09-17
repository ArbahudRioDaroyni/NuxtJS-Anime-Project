import type { H3Event } from 'h3'
import type { QueryType } from '~/types/database'
import { getPrismaModelFields } from '~/server/utils/prisma'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { search, fields, limit, offset } = getQuery(event) as QueryType;

    // Limit
    event.context.safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));

    // Offset
    event.context.safeOffset = Number(offset) || 0;

    // Fields
    const url = event.node.req.url ?? '';
    const baseUrl = url.split('?')[0] || '';
    const table = baseUrl.split('/')[2] || '';
    const validFields = getPrismaModelFields(table, fields);
    if (!validFields.isValid) {
      throw new Error(validFields.message);
    }
    event.context.safeFields = validFields.data;

    // Search
    event.context.safeSearch = (search ?? '').toString().trim();

  } catch (error) {
    return {
      data: [],
      length: 0,
      status: 400,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
});
