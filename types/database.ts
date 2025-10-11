// Database Response Types

// Response wrapper types
export interface ResponseType {
  success: boolean
  code: number
  message?: string
  length: number
  data: unknown[]
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
    hasNext?: boolean
    hasPrev?: boolean
    nextPage?: number | null
    prevPage?: number | null
    nextLink?: string | null
    prevLink?: string | null
    season?: string
    year?: string
    searchSuggestions?: string[]
    [key: string]: unknown
  }
}

// Query parameters
export interface QueryType {
  search?: string | number
  limit?: number
  offset?: number
  page?: number
  perPage?: number
  season?: string
  year?: string
  genre?: string
  status?: string
  sort?: string
  order?: 'asc' | 'desc'
  fields?: string
}

// Pagination
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  success: boolean
  code: number
  message?: string
  data: T[]
  meta: PaginationMeta
}
