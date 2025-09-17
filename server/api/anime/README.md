# Anime API Documentation

## Overview
This is a complete RESTful API for managing anime data in the AniWorld application, following Nuxt.js file-based routing conventions.

## Base URL
```
/api/anime
```

## Authentication
Currently, no authentication is required for these endpoints.

## Endpoints (Nuxt.js File-based Routing)

### GET /api/anime
**File:** `index.get.ts`
Retrieve a list of anime with pagination and search.

#### Query Parameters
- `search` (optional): Search anime by title
- `fields` (optional): Select specific fields to return
- `limit` (optional, default: 10): Number of items per page
- `offset` (optional, default: 0): Number of items to skip

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Anime list retrieved successfully",
  "length": 10,
  "data": [
    {
      "id": 1,
      "slug": "demon-slayer",
      "title_romaji": "Kimetsu no Yaiba",
      "title_english": "Demon Slayer",
      "title_native": "鬼滅の刃",
      "description": "...",
      "year": "2019",
      "episodes": 26,
      "popularity": 95,
      "favorites": 1200,
      "media_type": {...},
      "release_format": {...},
      "status_type": {...},
      "season": {...}
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### GET /api/anime/[id]
**File:** `[id].get.ts`
Retrieve a single anime by ID with full details and relations.

#### Path Parameters
- `id` (required): Anime ID (positive integer)

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Anime retrieved successfully",
  "length": 1,
  "data": [
    { 
      "id": 1,
      "slug": "demon-slayer",
      "title_romaji": "Kimetsu no Yaiba",
      "title_english": "Demon Slayer",
      "title_native": "鬼滅の刃",
      "description": "Tanjiro Kamado, joined with Inosuke Hashibira...",
      "year": "2019",
      "episodes": 26,
      "popularity": 95,
      "favorites": 1200,
      "trending": 8,
      "is_adult": false,
      "is_licensed": true,
      "media_type": {
        "id": 1,
        "name": "TV"
      },
      "release_format": {
        "id": 1,
        "name": "TV Show"
      },
      "status_type": {
        "id": 3,
        "name": "Finished"
      },
      "season": {
        "id": 2,
        "name": "Spring"
      },
      "anime_studio_relations": [
        {
          "studio": {
            "id": 1,
            "name": "Ufotable"
          }
        }
      ]
    }
  ]
}
```

### GET /api/anime/[slug]
**File:** `[slug].get.ts`
Retrieve a single anime by slug with full details and relations.

#### Path Parameters
- `slug` (required): Anime slug (URL-friendly identifier, e.g., "demon-slayer")

#### Slug Format
- Must contain only lowercase letters, numbers, and hyphens
- No spaces or special characters allowed
- Examples: `demon-slayer`, `attack-on-titan`, `naruto-shippuden`

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Anime \"Kimetsu no Yaiba\" retrieved successfully",
  "length": 1,
  "data": [
    {
      "id": 1,
      "slug": "demon-slayer",
      "title_romaji": "Kimetsu no Yaiba",
      "title_english": "Demon Slayer",
      "title_native": "鬼滅の刃",
      "description": "Tanjiro Kamado, joined with Inosuke Hashibira...",
      "year": "2019",
      "episodes": 26,
      "popularity": 95,
      "favorites": 1200,
      "trending": 8,
      "is_adult": false,
      "is_licensed": true,
      "media_type": {
        "id": 1,
        "name": "TV"
      },
      "release_format": {
        "id": 1,
        "name": "TV Show"
      },
      "status_type": {
        "id": 3,
        "name": "Finished"
      },
      "season": {
        "id": 2,
        "name": "Spring"
      },
      "anime_studio_relations": [
        {
          "studio": {
            "id": 1,
            "name": "Ufotable"
          }
        }
      ],
      "anime_characters_voice_actor_relations": [
        {
          "character": {
            "id": 1,
            "name": "Tanjiro Kamado",
            "medium_image_url": "https://..."
          },
          "voice_actor": {
            "id": 1,
            "name": "Natsuki Hanae",
            "medium_image_url": "https://..."
          }
        }
      ],
      "anime_relation_relations_as_anime": [
        {
          "reference_anime": {
            "id": 2,
            "slug": "demon-slayer-movie",
            "title_romaji": "Kimetsu no Yaiba: Mugen Train",
            "title_english": "Demon Slayer: Mugen Train",
            "medium_cover_image_url": "https://..."
          },
          "reference_type": {
            "id": 1,
            "name": "Sequel"
          }
        }
      ]
    }
  ],
  "meta": {
    "slug": "demon-slayer",
    "retrievedAt": "2025-07-03T10:30:00.000Z",
    "includesRelations": true
  }
}
```

### POST /api/anime/store
**File:** `store.post.ts`
Create a new anime entry.

#### Request Body
```json
{
  "title_romaji": "Demon Slayer",
  "title_english": "Demon Slayer: Kimetsu no Yaiba",
  "title_native": "鬼滅の刃",
  "description": "Anime description",
  "year": "2019",
  "episodes": 26,
  "release_media_type_id": 1,
  "release_format_id": 1,
  "release_status_type_id": 1,
  "season_id": 1,
  "is_adult": false,
  "is_licensed": true
}
```

#### Response
```json
{
  "success": true,
  "code": 201,
  "message": "Anime created successfully",
  "length": 1,
  "data": [
    {
      "id": 123,
      "slug": "demon-slayer",
      "title_romaji": "Demon Slayer",
      "title_english": "Demon Slayer: Kimetsu no Yaiba",
      "title_native": "鬼滅の刃",
      "description": "Anime description",
      "year": "2019",
      "episodes": 26,
      "created_at": "2025-07-01T10:30:00.000Z",
      "updated_at": "2025-07-01T10:30:00.000Z"
    }
  ]
}
```

### PUT /api/anime/[id]
**File:** `[id].put.ts`
Update an existing anime (full replacement).

#### Path Parameters
- `id` (required): Anime ID

#### Request Body
Complete anime object with all fields.

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Anime updated successfully",
  "length": 1,
  "data": [
    {
      "id": 1,
      "slug": "updated-anime-slug",
      "title_romaji": "Updated Title",
      "updated_at": "2025-07-01T10:30:00.000Z"
    }
  ]
}
```

### PATCH /api/anime/[id]
**File:** `[id].patch.ts`
Partially update an existing anime.

#### Path Parameters
- `id` (required): Anime ID

#### Request Body
```json
{
  "title_romaji": "Updated Title",
  "episodes": 50
}
```

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Anime updated successfully",
  "length": 1,
  "data": [
    {
      "id": 1,
      "title_romaji": "Updated Title",
      "episodes": 50,
      "updated_at": "2025-07-01T10:30:00.000Z"
    }
  ]
}
```

### DELETE /api/anime/[id]
**File:** `[id].delete.ts`
Delete an anime (soft delete by default).

#### Path Parameters
- `id` (required): Anime ID

#### Query Parameters
- `force` (optional): Set to 'true' for permanent deletion

#### Response (Soft Delete)
```json
{
  "success": true,
  "code": 200,
  "message": "Anime soft deleted successfully",
  "length": 0,
  "data": []
}
```

#### Response (Hard Delete)
```json
{
  "success": true,
  "code": 200,
  "message": "Anime permanently deleted",
  "length": 0,
  "data": []
}
```

### GET /api/anime/popular
**File:** `popular.get.ts`
Retrieve popular anime sorted by popularity.

#### Query Parameters
- `search` (optional): Search anime by title
- `limit` (optional, default: 10): Number of items per page
- `offset` (optional, default: 0): Number of items to skip

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Popular anime retrieved successfully",
  "length": 10,
  "data": [
    {
      "id": 1,
      "title_romaji": "Attack on Titan",
      "popularity": 98,
      "favorites": 5000,
      "media_type": {...},
      "release_format": {...}
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### GET /api/anime/trending
**File:** `trending.get.ts`
Retrieve trending anime.

#### Query Parameters
- `search` (optional): Search anime by title
- `limit` (optional, default: 10): Number of items per page
- `offset` (optional, default: 0): Number of items to skip

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Trending anime retrieved successfully",
  "length": 10,
  "data": [
    {
      "id": 2,
      "title_romaji": "Jujutsu Kaisen",
      "trending": 95,
      "popularity": 92,
      "favorites": 3500
    }
  ],
  "meta": {
    "total": 30,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### GET /api/anime/seasonal
**File:** `seasonal.get.ts`
Retrieve seasonal anime.

#### Query Parameters
- `season` (required): Season name (spring, summer, fall, winter)
- `year` (required): Year (YYYY)
- `search` (optional): Search anime by title
- `limit` (optional, default: 10): Number of items per page
- `offset` (optional, default: 0): Number of items to skip

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Seasonal anime retrieved successfully",
  "length": 15,
  "data": [
    {
      "id": 3,
      "title_romaji": "Spring 2019 Anime",
      "year": "2019",
      "season": {
        "id": 2,
        "name": "Spring"
      }
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "season": "spring",
    "year": "2019"
  }
}
```

### GET /api/anime/search
**File:** `search.get.ts`
Advanced typo-tolerant search with hybrid search strategies for anime titles.

### GET /api/anime/titles
**File:** `titles.get.ts`
Get curated anime titles for different purposes (popular, trending, etc).

#### Query Parameters
- `type` (optional, default: "popular"): Type of titles - `popular`, `trending`, `favorites`, `recent`, `alphabetical`
- `limit` (optional, default: 100, max: 200): Number of titles

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Retrieved 100 popular anime titles",
  "length": 100,
  "data": [
    {
      "id": 1,
      "slug": "attack-on-titan",
      "title_romaji": "Shingeki no Kyojin",
      "title_english": "Attack on Titan",
      "year": "2013",
      "popularity": 98,
      "favorites": 5000,
      "trending": 85,
      "episodes": 25,
      "thumbnail_image_url": "..."
    }
  ],
  "meta": {
    "type": "popular",
    "limit": 100,
    "total": 100,
    "sortedBy": "popular",
    "availableTypes": ["popular", "trending", "favorites", "recent", "alphabetical"]
  }
}
```
**File:** `stats.get.ts`
Retrieve comprehensive anime statistics.

#### Response
```json
{
  "success": true,
  "code": 200,
  "message": "Anime statistics retrieved successfully",
  "length": 1,
  "data": [
    {
      "totalAnime": 1250,
      "totalActiveAnime": 1180,
      "totalDeletedAnime": 70,
      "averagePopularity": 67.5,
      "averageFavorites": 850,
      "averageEpisodes": 24.5,
      "mostPopularAnime": {
        "id": 1,
        "title_romaji": "Attack on Titan",
        "popularity": 98
      },
      "newestAnime": {
        "id": 1250,
        "title_romaji": "Latest Anime",
        "created_at": "2025-07-01T00:00:00.000Z"
      },
      "yearlyStats": [
        {
          "year": "2025",
          "count": 45
        },
        {
          "year": "2024", 
          "count": 120
        }
      ],
      "seasonalStats": [
        {
          "season": "Spring",
          "count": 300
        },
        {
          "season": "Summer",
          "count": 285
        }
      ]
    }
  ]
}
```

## Error Response Format
All endpoints return errors in this consistent format:

```json
{
  "success": false,
  "code": 400,
  "message": "Error message describing what went wrong",
  "length": 0,
  "data": []
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found (anime not found)
- `409` - Conflict (duplicate slug/title)
- `500` - Internal Server Error

## File Structure (Nuxt.js Convention)
```
server/api/anime/
├── index.get.ts          # GET /api/anime
├── [id].get.ts           # GET /api/anime/[id]
├── [slug].get.ts         # GET /api/anime/[slug]
├── store.post.ts         # POST /api/anime/store
├── [id].put.ts           # PUT /api/anime/[id]
├── [id].patch.ts         # PATCH /api/anime/[id]
├── [id].delete.ts        # DELETE /api/anime/[id]
├── popular.get.ts        # GET /api/anime/popular
├── trending.get.ts       # GET /api/anime/trending
├── seasonal.get.ts       # GET /api/anime/seasonal
├── search.get.ts         # GET /api/anime/search
├── titles.get.ts         # GET /api/anime/titles
├── stats.get.ts          # GET /api/anime/stats
├── README.md             # This documentation
├── examples.md           # Usage examples
└── SUMMARY.md            # Complete summary
```

## Nuxt.js Routing Conventions Used

### Method-based Files
- `.get.ts` - Handle GET requests
- `.post.ts` - Handle POST requests  
- `.put.ts` - Handle PUT requests
- `.patch.ts` - Handle PATCH requests
- `.delete.ts` - Handle DELETE requests

### Dynamic Routes
- `[id].get.ts` - Handle GET requests to `/api/anime/:id`
- `[slug].get.ts` - Handle GET requests to `/api/anime/:slug`
- `[id].put.ts` - Handle PUT requests to `/api/anime/:id`
- `[id].patch.ts` - Handle PATCH requests to `/api/anime/:id`
- `[id].delete.ts` - Handle DELETE requests to `/api/anime/:id`

### Named Routes
- `store.post.ts` - Handle POST requests to `/api/anime/store`
- `popular.get.ts` - Handle GET requests to `/api/anime/popular`
- `trending.get.ts` - Handle GET requests to `/api/anime/trending`
- `seasonal.get.ts` - Handle GET requests to `/api/anime/seasonal`
- `stats.get.ts` - Handle GET requests to `/api/anime/stats`

## Features
- ✅ Nuxt.js file-based routing
- ✅ Method-specific handlers
- ✅ Dynamic route parameters
- ✅ Full CRUD operations
- ✅ Advanced search with typo tolerance & fuzzy matching
- ✅ Hybrid search strategies (alphabetical, n-gram, popularity)
- ✅ Real-time autocomplete with "Did you mean?" suggestions
- ✅ Slug-based access for SEO-friendly URLs
- ✅ Soft/hard delete
- ✅ Slug generation
- ✅ Comprehensive error handling
- ✅ TypeScript support with ResponseType
- ✅ Database relations
- ✅ Consistent response format
