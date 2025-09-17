import type { AnimeCreateInput } from '~/types/anime'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateAnimeCreate(data: AnimeCreateInput): ValidationResult {
  const errors: string[] = []

  // Required fields validation
  if (!data.title_romaji && !data.title_english) {
    errors.push('At least one title (title_romaji or title_english) is required')
  }

  // Title length validation
  if (data.title_romaji && data.title_romaji.length > 255) {
    errors.push('title_romaji must be 255 characters or less')
  }
  
  if (data.title_english && data.title_english.length > 255) {
    errors.push('title_english must be 255 characters or less')
  }
  
  if (data.title_native && data.title_native.length > 255) {
    errors.push('title_native must be 255 characters or less')
  }

  // Year validation
  if (data.year) {
    const yearRegex = /^\d{4}$/
    if (!yearRegex.test(data.year)) {
      errors.push('year must be a 4-digit year (e.g., 2023)')
    }
    
    const yearNum = parseInt(data.year)
    const currentYear = new Date().getFullYear()
    if (yearNum < 1900 || yearNum > currentYear + 10) {
      errors.push(`year must be between 1900 and ${currentYear + 10}`)
    }
  }

  // Episodes validation
  if (data.episodes !== undefined) {
    if (data.episodes < 0 || data.episodes > 10000) {
      errors.push('episodes must be between 0 and 10000')
    }
  }

  // Duration validation
  if (data.duration !== undefined) {
    if (data.duration < 0 || data.duration > 1000) {
      errors.push('duration must be between 0 and 1000 minutes')
    }
  }

  // Duration unit validation
  if (data.duration_unit && !['s', 'm', 'h'].includes(data.duration_unit)) {
    errors.push('duration_unit must be one of: s (seconds), m (minutes), h (hours)')
  }

  // Date format validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (data.start_date && !dateRegex.test(data.start_date)) {
    errors.push('start_date must be in YYYY-MM-DD format')
  }
  
  if (data.end_date && !dateRegex.test(data.end_date)) {
    errors.push('end_date must be in YYYY-MM-DD format')
  }

  // Date logic validation
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    if (startDate > endDate) {
      errors.push('start_date must be before or equal to end_date')
    }
  }

  // Score validation
  const scoreFields = [
    'arithmetic_geometric_mean_score',
    'arithmetic_harmonic_mean',
    'arithmetic_mean_score',
    'geometric_mean_score',
    'harmonic_mean_score',
    'weighted_mean_score',
    'median_score',
    'mean_score'
  ]

  scoreFields.forEach(field => {
    const value = data[field as keyof AnimeCreateInput] as number
    if (value !== undefined && (value < 0 || value > 10)) {
      errors.push(`${field} must be between 0 and 10`)
    }
  })

  // Popularity, trending, favorites validation
  const countFields = ['popularity', 'trending', 'favorites']
  countFields.forEach(field => {
    const value = data[field as keyof AnimeCreateInput] as number
    if (value !== undefined && value < 0) {
      errors.push(`${field} must be a positive number`)
    }
  })

  // URL validation
  const urlFields = [
    'trailer_url',
    'picture_image_url',
    'extra_large_cover_image_url',
    'large_cover_image_url',
    'medium_cover_image_url',
    'thumbnail_image_url',
    'banner_image_url'
  ]

  const urlRegex = /^https?:\/\/.+/
  urlFields.forEach(field => {
    const value = data[field as keyof AnimeCreateInput] as string
    if (value && !urlRegex.test(value)) {
      errors.push(`${field} must be a valid HTTP or HTTPS URL`)
    }
  })

  // Color validation (hex format)
  if (data.color_image && !/^#[0-9A-Fa-f]{6}$/.test(data.color_image)) {
    errors.push('color_image must be a valid hex color (e.g., #FFFFFF)')
  }

  // Origin validation (2-letter country code)
  if (data.origin && data.origin.length !== 2) {
    errors.push('origin must be a 2-letter country code (e.g., JP, US)')
  }

  // Boolean validation
  const booleanFields = ['is_licensed', 'is_adult', 'is_locked']
  booleanFields.forEach(field => {
    const value = data[field as keyof AnimeCreateInput]
    if (value !== undefined && typeof value !== 'boolean') {
      errors.push(`${field} must be a boolean value (true or false)`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateAnimeUpdate(data: Partial<AnimeCreateInput>): ValidationResult {
  // For updates, we don't require any fields, but validate what's provided
  return validateAnimeCreate(data as AnimeCreateInput)
}

export function validateIds(data: { [key: string]: number | undefined }): ValidationResult {
  const errors: string[] = []
  
  Object.keys(data).forEach(key => {
    const value = data[key]
    if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
      errors.push(`${key} must be a positive integer`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function sanitizeInput(data: Record<string, unknown>): AnimeCreateInput {
  const sanitized: Record<string, unknown> = {}
  
  // Only allow valid fields
  const allowedFields = [
    'slug', 'title_romaji', 'title_english', 'title_native',
    'release_media_type_id', 'release_format_id', 'release_status_type_id',
    'source_media_type_id', 'description', 'year', 'season_id',
    'start_date', 'end_date', 'episodes', 'chapters', 'volumes',
    'origin', 'duration', 'duration_unit', 'synonyms', 'hashtag',
    'trailer_url', 'picture_image_url', 'extra_large_cover_image_url',
    'large_cover_image_url', 'medium_cover_image_url', 'thumbnail_image_url',
    'banner_image_url', 'color_image', 'arithmetic_geometric_mean_score',
    'arithmetic_harmonic_mean', 'arithmetic_mean_score', 'geometric_mean_score',
    'harmonic_mean_score', 'weighted_mean_score', 'median_score', 'mean_score',
    'popularity', 'trending', 'favorites', 'is_licensed', 'is_adult', 'is_locked'
  ]

  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      sanitized[field] = data[field]
    }
  })

  // Trim string fields
  const stringFields = [
    'slug', 'title_romaji', 'title_english', 'title_native',
    'description', 'year', 'start_date', 'end_date', 'chapters',
    'volumes', 'origin', 'duration_unit', 'synonyms', 'hashtag',
    'trailer_url', 'picture_image_url', 'extra_large_cover_image_url',
    'large_cover_image_url', 'medium_cover_image_url', 'thumbnail_image_url',
    'banner_image_url', 'color_image'
  ]

  stringFields.forEach(field => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].trim()
      // Remove empty strings
      if (sanitized[field] === '') {
        sanitized[field] = undefined
      }
    }
  })

  return sanitized
}
