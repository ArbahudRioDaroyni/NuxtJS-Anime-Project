import type { 
  ReleaseMediaType, 
  ReleaseFormat, 
  ReleaseStatusType, 
  Season
} from './metadata'
import type {
  AnimeStudioRelation,
  AnimeGenreRelation,
  AnimeExternalSiteRelation,
  AnimeRelationRelation,
  AnimeTagRelation,
  AnimeCharacterVoiceActorRelation,
  AnimeStaffRelation
} from './relations'

export interface Anime {
  id: number
  slug?: string
  title_romaji?: string
  title_english?: string
  title_native?: string
  release_media_type_id?: number
  release_format_id?: number
  release_status_type_id?: number
  source_media_type_id?: number
  description?: string
  year?: string
  season_id?: number
  start_date?: string
  end_date?: string
  episodes?: number
  chapters?: string
  volumes?: string
  origin?: string
  duration?: number
  duration_unit?: string
  synonyms?: string
  hashtag?: string
  trailer_url?: string
  picture_image_url?: string
  extra_large_cover_image_url?: string
  large_cover_image_url?: string
  medium_cover_image_url?: string
  thumbnail_image_url?: string
  banner_image_url?: string
  color_image?: string
  arithmetic_geometric_mean_score?: number
  arithmetic_harmonic_mean?: number
  arithmetic_mean_score?: number
  geometric_mean_score?: number
  harmonic_mean_score?: number
  weighted_mean_score?: number
  median_score?: number
  mean_score?: number
  popularity?: number
  trending?: number
  favorites?: number
  is_licensed?: boolean
  is_adult?: boolean
  is_locked?: boolean
}

// Complete Anime details with all relations as returned by API
export interface AnimeDetails extends Anime {
  // Related entities
  media_type?: ReleaseMediaType
  release_format?: ReleaseFormat
  status_type?: ReleaseStatusType
  source_media_type?: ReleaseMediaType
  season?: Season
  
  // Relations arrays
  anime_studio_relations?: AnimeStudioRelation[]
  anime_genre_relations?: AnimeGenreRelation[]
  anime_external_site_relations?: AnimeExternalSiteRelation[]
  anime_relation_relations_as_anime?: AnimeRelationRelation[]
  anime_relation_relations_as_reference_anime?: AnimeRelationRelation[]
  anime_tag_relations?: AnimeTagRelation[]
  anime_characters_voice_actor_relations?: AnimeCharacterVoiceActorRelation[]
  anime_staff_relations?: AnimeStaffRelation[]
}

// Input type for creating/updating anime
export interface AnimeCreateInput extends Partial<Omit<Anime, 'id'>> {
  title_romaji: string
  title_english: string
  studio_ids?: number[]
  genre_ids?: number[]
}

export interface AnimeImportCSV extends Partial<Omit<Anime, 'id'>> {
  release_media_type_name?: string
  release_format_name?: string
  release_status_type_name?: string
  source_media_type_name?: string
  season_name?: string
}