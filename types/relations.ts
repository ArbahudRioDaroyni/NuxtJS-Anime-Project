// Relation Types from Prisma Schema
import type { 
  Studio, 
  Genre, 
  ExternalSite, 
  RelationType, 
  Tag,
  Character,
  VoiceActor,
  CharacterRole,
  Staff,
  StaffRole 
} from './metadata'
import type { Anime } from './anime'

// Studio Relations
export interface AnimeStudioRelation {
  id: number
  anime_id: number
  studio_id: number
  is_main: boolean
  anime?: Anime
  studio?: Studio
}

// Genre Relations
export interface AnimeGenreRelation {
  id: number
  anime_id: number
  genre_id: number
  anime?: Anime
  genre?: Genre
}

// External Site Relations
export interface AnimeExternalSiteRelation {
  id: number
  anime_id: number
  external_site_id: number
  url: string
  anime?: Anime
  external_site?: ExternalSite
}

// Anime Relations (sequels, prequels, etc.)
export interface AnimeRelationRelation {
  id: number
  anime_id: number
  reference_anime_id: number
  reference_type_id: number
  anime?: Anime
  reference_anime?: Anime
  reference_type?: RelationType
}

// Tag Relations
export interface AnimeTagRelation {
  id: number
  anime_id: number
  tag_id: number
  rank?: number
  is_spoiler: boolean
  anime?: Anime
  tag?: Tag
}

// Character and Voice Actor Relations
export interface AnimeCharacterVoiceActorRelation {
  id: number
  anime_id: number
  character_id: number
  character_role_id?: number
  voice_actor_id: number
  anime?: Anime
  character?: Character
  character_role?: CharacterRole
  voice_actor?: VoiceActor
}

// Staff Relations
export interface AnimeStaffRelation {
  id: number
  anime_id: number
  staff_id: number
  staff_role_id?: number
  language?: string
  version?: string
  episodes?: string
  openings?: string
  endings?: string
  promotions?: string
  additional_info?: string
  anime?: Anime
  staff?: Staff
  staff_role?: StaffRole
}
