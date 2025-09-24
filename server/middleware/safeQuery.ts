import type { H3Event } from 'h3'
import type { QueryType } from '~/types/database'
import { getPrismaModelFields } from '~/server/utils/prisma'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { search, limit, offset, page, perPage, fields } = getQuery(event) as QueryType;

    event.context.safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
    event.context.safeOffset = Number(offset) || 0;
    event.context.safeSearch = (search ?? '').toString().trim();
    event.context.safePage = Math.max(1, Number(page) || 1);
    event.context.safePerPage = Math.max(1, Math.min(Number(perPage) || 10, 100));

    // Fields
    const url = event.node.req.url ?? '';
    const baseUrl = url.split('?')[0] || '';
    const table = baseUrl.split('/')[2] || '';
    const validFields = getPrismaModelFields(table, fields);
    if (!validFields.isValid) {
      throw new Error(validFields.message);
    }
    event.context.safeFields = validFields.data;
  } catch (error) {
    return {
      data: [],
      length: 0,
      status: 400,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
});
