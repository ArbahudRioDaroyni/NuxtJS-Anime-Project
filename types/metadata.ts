// Metadata Types from Prisma Schema

export interface ReleaseMediaType {
  id: number
  name: string
  description?: string
}

export interface ReleaseFormat {
  id: number
  name: string
  stands_for?: string
  description?: string
}

export interface ReleaseStatusType {
  id: number
  name: string
  description?: string
}

export interface Season {
  id: number
  name: string
  description?: string
}

export interface Studio {
  id: number
  name: string
  favorites: number
  is_animation_studio: boolean
}

export interface Genre {
  id: number
  name: string
  description?: string
  slug: string
}

export interface ExternalSite {
  id: number
  name: string
  icon?: string
  language?: string
  base_url?: string
}

export interface RelationType {
  id: number
  name: string
  description?: string
}

export interface Tag {
  id: number
  name: string
  description?: string
  tag_category_id?: number
  is_general_spoiler: boolean
}

export interface TagCategory {
  id: number
  name: string
}

// Character and Staff related types
export interface Character {
  id: number
  name: string
  name_native?: string
  large_image_url?: string
  medium_image_url?: string
  description?: string
  gender?: string
  date_of_birth?: string
  age?: string
  home_town?: string
  favorites: number
}

export interface VoiceActor {
  id: number
  name: string
  name_native?: string
  large_image_url?: string
  medium_image_url?: string
  description?: string
  gender?: string
  date_of_birth?: string
  age?: string
  home_town?: string
  favorites: number
}

export interface CharacterRole {
  id: number
  name: string
  description?: string
}

export interface Staff {
  id: number
  name: string
  name_native?: string
  large_image_url?: string
  medium_image_url?: string
  description?: string
  gender?: string
  date_of_birth?: string
  age?: string
  home_town?: string
  favorites: number
}

export interface StaffRole {
  id: number
  name: string
  description?: string
}

export interface AnimeMetadata {
  mediaTypes: ReleaseMediaType[]
  releaseFormats: ReleaseFormat[]
  statusTypes: ReleaseStatusType[]
  seasons: Season[]
  studios: Studio[]
  genres: Genre[]
}