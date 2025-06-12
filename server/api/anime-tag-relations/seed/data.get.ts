import { getAll } from '@/server/db/index';
import { defineEventHandler } from 'h3'

interface queryType {
	search?: string | number;
	fields?: string;
	limit?: number;
	offset?: number;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as queryType;
  const { search, fields, limit, offset } = query;

  // Sanitize inputs
  // Ensure search is a string, fields is a string, limit is a number between 1 and 100, and offset is a number
  const safeSearch = search?.toString().trim() || '';
  const safeFields = fields?.toString() || '*';
  // const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100000)); // Seed
  const safeOffset = Number(offset) || 0;
  
  
  return getAll(safeSearch, safeFields, safeLimit, safeOffset, 'anime_tag_relations')
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      return {
      data: [],
        length: 0,
        status: 400,
        message: 'Error fetching data. Please try again later.'
      };
    });
})