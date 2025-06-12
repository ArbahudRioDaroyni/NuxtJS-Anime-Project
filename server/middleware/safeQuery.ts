import type { H3Event } from 'h3'
import { isFields } from '~/server/utils/validation'

interface QueryType {
  search?: string | number;
  fields?: string;
  limit?: number;
  offset?: number;
}

interface ResultType {
  isValid: boolean;
  message: string;
  data?: unknown;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { search, fields, limit, offset } = getQuery(event) as QueryType;

    // Limit
    event.context.safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));

    // Offset
    event.context.safeOffset = Number(offset) || 0;

    // Fields
    const validFields = isFields(event, fields) as ResultType;
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
