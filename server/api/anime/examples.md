# API Testing Examples (Nuxt.js File-based Routing)

This file contains example requests for testing the Anime API endpoints using Nuxt.js routing conventions.

## Using cURL

### GET Requests

```bash
# Get all anime (index.get.ts)
curl -X GET "http://localhost:3000/api/anime"

# Get specific anime by ID ([id].get.ts)
curl -X GET "http://localhost:3000/api/anime/1"

# Get specific anime by slug ([slug].get.ts)
curl -X GET "http://localhost:3000/api/anime/demon-slayer"

# Get anime by slug with special characters
curl -X GET "http://localhost:3000/api/anime/attack-on-titan"

# Get anime by slug (URL-encoded if needed)
curl -X GET "http://localhost:3000/api/anime/naruto-shippuden"

# Search anime by title (index.get.ts)
curl -X GET "http://localhost:3000/api/anime?search=naruto"

# Get anime with pagination (index.get.ts)
curl -X GET "http://localhost:3000/api/anime?limit=5&offset=10"

# Get popular anime (popular.get.ts)
curl -X GET "http://localhost:3000/api/anime/popular"

# Get trending anime (trending.get.ts)
curl -X GET "http://localhost:3000/api/anime/trending"

# Get seasonal anime (seasonal.get.ts)
curl -X GET "http://localhost:3000/api/anime/seasonal?season=spring&year=2023"

# Get anime statistics (stats.get.ts)
curl -X GET "http://localhost:3000/api/anime/stats"

# Advanced typo-tolerant search (search.get.ts)
curl -X GET "http://localhost:3000/api/anime/search?q=demon"

# Search with typos (search.get.ts)
curl -X GET "http://localhost:3000/api/anime/search?q=nauto"

# Search with abbreviations (search.get.ts)
curl -X GET "http://localhost:3000/api/anime/search?q=AOT"

# Advanced search with custom threshold (search.get.ts)
curl -X GET "http://localhost:3000/api/anime/search?q=attak%20on%20titan&threshold=0.7&limit=5"

# Search without advanced algorithms (search.get.ts)
curl -X GET "http://localhost:3000/api/anime/search?q=demonslayer&advanced=false"

# Get anime titles for autocomplete (titles.get.ts)
curl -X GET "http://localhost:3000/api/anime/titles?type=popular&limit=50"
```

### POST Requests

```bash
# Create new anime (store.post.ts)
curl -X POST "http://localhost:3000/api/anime/store" \
  -H "Content-Type: application/json" \
  -d '{
    "title_romaji": "Demon Slayer",
    "title_english": "Demon Slayer: Kimetsu no Yaiba",
    "title_native": "鬼滅の刃",
    "description": "A young boy becomes a demon slayer to save his sister",
    "year": "2019",
    "episodes": 26,
    "release_media_type_id": 1,
    "release_format_id": 1,
    "release_status_type_id": 2,
    "season_id": 2,
    "start_date": "2019-04-06",
    "end_date": "2019-09-28",
    "duration": 24,
    "duration_unit": "m",
    "is_adult": false,
    "is_licensed": true,
    "mean_score": 8.7,
    "popularity": 95000,
    "favorites": 25000
  }'
```

### PUT Requests

```bash
# Full update of anime ([id].put.ts)
curl -X PUT "http://localhost:3000/api/anime/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title_romaji": "Updated Demon Slayer",
    "title_english": "Updated Demon Slayer: Kimetsu no Yaiba",
    "title_native": "鬼滅の刃",
    "description": "Updated description",
    "year": "2019",
    "episodes": 44,
    "release_media_type_id": 1,
    "release_format_id": 1,
    "release_status_type_id": 2,
    "season_id": 2,
    "is_adult": false,
    "is_licensed": true
  }'
```

### PATCH Requests

```bash
# Partial update of anime ([id].patch.ts)
curl -X PATCH "http://localhost:3000/api/anime/1" \
  -H "Content-Type: application/json" \
  -d '{
    "episodes": 50,
    "mean_score": 9.0,
    "description": "Partially updated description"
  }'
```

### DELETE Requests

```bash
# Soft delete ([id].delete.ts)
curl -X DELETE "http://localhost:3000/api/anime/1"

# Hard delete with force parameter ([id].delete.ts)
curl -X DELETE "http://localhost:3000/api/anime/1?force=true"
```

## Using JavaScript/Fetch

```javascript
// GET all anime (index.get.ts)
async function getAllAnime() {
  const response = await fetch('/api/anime');
  const data = await response.json();
  console.log(data);
}

// GET anime by ID ([id].get.ts)
async function getAnimeById(id) {
  const response = await fetch(`/api/anime/${id}`);
  const data = await response.json();
  console.log(data);
}

// GET anime by slug ([slug].get.ts)
async function getAnimeBySlug(slug) {
  const response = await fetch(`/api/anime/${slug}`);
  const data = await response.json();
  console.log('Anime details:', data.data[0]);
  console.log('Relations included:', data.meta.includesRelations);
  return data;
}

// POST create new anime (store.post.ts)
async function createAnime(animeData) {
  const response = await fetch('/api/anime/store', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(animeData)
  });
  const data = await response.json();
  console.log(data);
}

// PATCH update anime ([id].patch.ts)
async function updateAnime(id, updates) {
  const response = await fetch(`/api/anime/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });
  const data = await response.json();
  console.log(data);
}

// DELETE anime ([id].delete.ts)
async function deleteAnime(id, force = false) {
  const url = force ? `/api/anime/${id}?force=true` : `/api/anime/${id}`;
  const response = await fetch(url, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log(data);
}

// GET popular anime (popular.get.ts)
async function getPopularAnime() {
  const response = await fetch('/api/anime/popular');
  const data = await response.json();
  console.log(data);
}

// GET seasonal anime (seasonal.get.ts)
async function getSeasonalAnime(season, year) {
  const response = await fetch(`/api/anime/seasonal?season=${season}&year=${year}`);
  const data = await response.json();
  console.log(data);
}

// Advanced search with typo tolerance (search.get.ts)
async function searchAnime(query, options = {}) {
  const params = new URLSearchParams({
    q: query,
    limit: options.limit || 10,
    threshold: options.threshold || 0.5,
    advanced: options.advanced !== false ? 'true' : 'false'
  });
  
  const response = await fetch(`/api/anime/search?${params}`);
  const data = await response.json();
  console.log('Search results:', data.data);
  console.log('Suggestions:', data.meta.searchSuggestions);
  console.log('Search stats:', data.meta.searchStats);
  return data;
}

// Example search queries with typos
async function demonstrateTypoTolerance() {
  // These all should find relevant anime despite typos
  await searchAnime('nauto');           // Should find "Naruto"
  await searchAnime('attak on titan');  // Should find "Attack on Titan"
  await searchAnime('demonslayer');     // Should find "Demon Slayer"
  await searchAnime('AOT');             // Should find "Attack on Titan"
  await searchAnime('demon slayr');     // Should find "Demon Slayer" with suggestions
}

// Get curated anime titles (titles.get.ts)
async function getAnimeTitles(type = 'popular', limit = 100) {
  const response = await fetch(`/api/anime/titles?type=${type}&limit=${limit}`);
  const data = await response.json();
  console.log(`${type} anime titles:`, data.data);
  return data;
}

// Example usage
getAllAnime();
getAnimeById(1);
getAnimeBySlug('demon-slayer');
getAnimeBySlug('attack-on-titan');
createAnime({
  title_romaji: "Attack on Titan",
  title_english: "Attack on Titan",
  episodes: 75,
  year: "2013"
});
updateAnime(1, { episodes: 87 });
deleteAnime(1);
getPopularAnime();
getSeasonalAnime('spring', '2023');
searchAnime('demon slayer');
searchAnime('nauto', { threshold: 0.6 });
demonstrateTypoTolerance();
getAnimeTitles('trending', 50);
```

## Route Mapping

| HTTP Method | URL | File | Description |
|------------|-----|------|-------------|
| GET | `/api/anime` | `index.get.ts` | Get all anime with pagination |
| GET | `/api/anime/1` | `[id].get.ts` | Get anime by ID |
| GET | `/api/anime/demon-slayer` | `[slug].get.ts` | Get anime by slug |
| POST | `/api/anime/store` | `store.post.ts` | Create new anime |
| PUT | `/api/anime/1` | `[id].put.ts` | Full update anime |
| PATCH | `/api/anime/1` | `[id].patch.ts` | Partial update anime |
| DELETE | `/api/anime/1` | `[id].delete.ts` | Delete anime |
| GET | `/api/anime/popular` | `popular.get.ts` | Get popular anime |
| GET | `/api/anime/trending` | `trending.get.ts` | Get trending anime |
| GET | `/api/anime/seasonal` | `seasonal.get.ts` | Get seasonal anime |
| GET | `/api/anime/search` | `search.get.ts` | Advanced typo-tolerant search |
| GET | `/api/anime/titles` | `titles.get.ts` | Get curated anime titles |
| GET | `/api/anime/stats` | `stats.get.ts` | Get anime statistics |

## Search Examples

### Basic Search
```bash
# Simple search
GET /api/anime/search?q=naruto

# Search with custom limit
GET /api/anime/search?q=demon&limit=5
```

### Typo-Tolerant Search
```bash
# These queries demonstrate typo tolerance
GET /api/anime/search?q=nauto           # Finds "Naruto"
GET /api/anime/search?q=attak%20on%20titan  # Finds "Attack on Titan"
GET /api/anime/search?q=demonslayer     # Finds "Demon Slayer"
GET /api/anime/search?q=AOT             # Finds "Attack on Titan"
```

### Advanced Search Options
```bash
# Custom fuzzy matching threshold
GET /api/anime/search?q=demon%20slayr&threshold=0.7

# Disable advanced algorithms for performance
GET /api/anime/search?q=naruto&advanced=false

# Combination of options
GET /api/anime/search?q=attak&threshold=0.6&limit=3&advanced=true
```

### Slug vs ID Access
```bash
# Both methods retrieve the same anime with full relations
GET /api/anime/1                  # Access by ID
GET /api/anime/demon-slayer       # Access by slug

# Advantages of slug-based access:
# - SEO-friendly URLs
# - More readable and memorable
# - Better for sharing and bookmarking
# - No need to remember numeric IDs
```

## Nuxt.js Conventions Used

### File Naming
- `[id].get.ts` - Dynamic route parameter for ID
- `store.post.ts` - Named route for creation
- `index.get.ts` - Default route for the directory
- `.get.ts`, `.post.ts`, `.put.ts`, `.patch.ts`, `.delete.ts` - Method-specific handlers

### Benefits
- ✅ Clear separation of HTTP methods
- ✅ Automatic routing based on file structure
- ✅ Dynamic route parameters
- ✅ Better organization and maintainability
- ✅ Follows Nuxt.js best practices
- ✅ Advanced search with typo tolerance and fuzzy matching
- ✅ Hybrid search strategies for comprehensive results
- ✅ Real-time autocomplete with intelligent suggestions
