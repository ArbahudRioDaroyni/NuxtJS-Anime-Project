/**
 * Generate pagination object for API responses
 * 
 * @param page - Current page number
 * @param limit - Items per page
 * @param totalCount - Total count of items
 * @param baseUrl - Base URL for pagination links (e.g., '/api/anime/1/external-sites')
 * @returns Pagination object with links and metadata
 */
import type { Pagination } from '~/types/database'
export function usePagination(
  page: number,
  limit: number,
  totalCount: number,
  baseUrl: string
): Pagination {
  const totalPages = Math.ceil(totalCount / limit)
  
  const pagination = {
    total: totalCount,
    page,
    limit,
    totalPages: totalPages,
    // Previous page
    ...(page > 1
      ? {
          hasPrev: true,
          prevPage: page - 1,
          prevLink: `${baseUrl}?page=${page - 1}&limit=${limit}`
        }
      : { hasPrev: false }
    ),
    // Next page
    ...(page < totalPages
      ? {
          hasNext: true,
          nextPage: page + 1,
          nextLink: `${baseUrl}?page=${page + 1}&limit=${limit}`
        }
      : { hasNext: false }
    )
  }

  return pagination
}
