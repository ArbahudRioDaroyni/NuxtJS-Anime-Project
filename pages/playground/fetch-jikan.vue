<script setup lang="ts">
// This is a playground page for testing Jikan API fetches
interface JikanAnimeResponse {
  data: {
    title: string
    title_japanese: string
    images?: { jpg?: { large_image_url?: string } }
    status: string
    score: number
    episodes: number
    rating: string
    synopsis: string
    type: string
    source: string
    duration: string
    aired?: { string?: string }
    season?: string
    year?: number
    scored_by?: number
    rank?: number
    popularity?: number
    members?: number
    favorites?: number
    genres: { mal_id: number; name: string }[]
    themes?: { mal_id: number; name: string }[]
    demographics?: { mal_id: number; name: string }[]
    studios: { mal_id: number; name: string }[]
    producers: { mal_id: number; name: string }[]
  }
}
const typeEnum = ['TV', 'TV_SHORT', 'Theatrical', 'Movie', 'OVA', 'Special', 'Web', 'ONA', 'Music'] as const
// Fetch anime data from Jikan API
const start = 20;

const { data: animeData, pending, error } = await useFetch<JikanAnimeResponse>(`https://api.jikan.moe/v4/anime/${start}/full`)

// Read anime-database.json and log to browser console
const animeDB = await useAnimeReadJSON()
if (import.meta.dev) {
  useHead({ 
    script: [
      { innerHTML: `console.log(${JSON.stringify(animeDB, null, 2)})` }
    ]
  })
}
const slug = computed(() => generateSlug(animeData.value?.data?.title || 'unknown', animeData.value?.data?.type || 'Unknown', animeData.value?.data?.year || 0))
const { data: anime } = useFetch('/api/anime/' + slug.value + '?search-by=slug', {
  key: `anime-${slug.value}`,
  default: () => ({ success: false, code: 404, message: 'Not found', length: 0, data: [] }),
  server: false,
  lazy: true,
})
function generateSlug(title: string, type: string = 'Unknown', year: number = 0) {
  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const typeSlug = typeEnum.includes(type as typeof typeEnum[number]) ? type.toLowerCase().replace(/_/g, '-') : 'Unknown';
  return `${titleSlug}-${typeSlug}-${year}`;
}

definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <UContainer>
    <div class="py-8 space-y-6">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold">
          Fetch Jikan Data Playground
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Testing Jikan API v4 - Anime ID: 20 (Naruto)
        </p>
        
        <!-- Database Status -->
        <UBadge 
          v-if="animeDB" 
          :label="`✅ Anime Database Loaded (${animeDB.data.length} items) - Check Console`" 
          color="success"
          variant="soft"
          size="lg"
        />
      </div>

      <!-- Loading State -->
      <UCard v-if="pending">
        <div class="flex items-center justify-center p-8">
          <div class="text-center space-y-3">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mx-auto" />
            <p class="text-gray-600 dark:text-gray-400">
              Loading anime data...
            </p>
          </div>
        </div>
      </UCard>

      <!-- Error State -->
      <UCard v-else-if="error">
        <div class="p-8 text-center">
          <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">
            Error Fetching Data
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {{ error.message }}
          </p>
        </div>
      </UCard>

      <!-- Data Display -->
      <template v-else-if="animeData?.data">
        <!-- Anime Card -->
        <UCard hidden>
          <template #header>
            <div class="flex items-start gap-4">
              <img 
                :src="animeData.data.images?.jpg?.large_image_url" 
                :alt="animeData.data.title"
                class="w-32 h-48 object-cover rounded-lg shadow-lg"
              >
              <div class="flex-1 space-y-2">
                <h2 class="text-2xl font-bold">
                  {{ animeData.data.title }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ animeData.data.title_japanese }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <UBadge 
                    :label="animeData.data.status" 
                    :color="animeData.data.status === 'Finished Airing' ? 'success' : 'info'"
                    variant="soft"
                  />
                  <UBadge 
                    :label="`${animeData.data.score} ⭐`" 
                    color="warning"
                    variant="solid"
                  />
                  <UBadge 
                    :label="`${animeData.data.episodes} Episodes`" 
                    color="neutral"
                    variant="outline"
                  />
                  <UBadge 
                    :label="animeData.data.rating" 
                    color="error"
                    variant="soft"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Synopsis -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold">
              Synopsis
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ animeData.data.synopsis }}
            </p>
          </div>
        </UCard>

        <!-- Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" hidden>
          <!-- Basic Info -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">
                📋 Basic Information
              </h3>
            </template>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Slug:</span>
                <span class="font-medium">{{ slug }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Type:</span>
                <span class="font-medium">{{ animeData.data.type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Source:</span>
                <span class="font-medium">{{ animeData.data.source }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Episodes:</span>
                <span class="font-medium">{{ animeData.data.episodes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Duration:</span>
                <span class="font-medium">{{ animeData.data.duration }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Aired:</span>
                <span class="font-medium">{{ animeData.data.aired?.string }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Season:</span>
                <span class="font-medium capitalize">{{ animeData.data.season }} {{ animeData.data.year }}</span>
              </div>
            </div>
          </UCard>

          <!-- Stats -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">
                📊 Statistics
              </h3>
            </template>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Score:</span>
                <span class="font-medium text-yellow-600">{{ animeData.data.score }} ⭐</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Scored By:</span>
                <span class="font-medium">{{ animeData.data.scored_by?.toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Rank:</span>
                <span class="font-medium">#{{ animeData.data.rank }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Popularity:</span>
                <span class="font-medium">#{{ animeData.data.popularity }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Members:</span>
                <span class="font-medium">{{ animeData.data.members?.toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Favorites:</span>
                <span class="font-medium">{{ animeData.data.favorites?.toLocaleString('id-ID') }}</span>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Genres & Themes -->
        <UCard hidden>
          <template #header>
            <h3 class="text-xl font-semibold">
              🏷️ Genres & Themes
            </h3>
          </template>

          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Genres
              </h4>
              <div class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="genre in animeData.data.genres" 
                  :key="genre.mal_id"
                  :label="genre.name"
                  color="primary"
                  variant="soft"
                />
              </div>
            </div>

            <div v-if="animeData.data.themes?.length">
              <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Themes
              </h4>
              <div class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="theme in animeData.data.themes" 
                  :key="theme.mal_id"
                  :label="theme.name"
                  color="secondary"
                  variant="soft"
                />
              </div>
            </div>

            <div v-if="animeData.data.demographics?.length">
              <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Demographics
              </h4>
              <div class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="demo in animeData.data.demographics" 
                  :key="demo.mal_id"
                  :label="demo.name"
                  color="info"
                  variant="soft"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Studios & Producers -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" hidden>
          <!-- Studios -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">
                🎬 Studios
              </h3>
            </template>
            
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="studio in animeData.data.studios" 
                :key="studio.mal_id"
                :label="studio.name"
                color="gradient-disco"
                variant="solid"
              />
            </div>
          </UCard>

          <!-- Producers -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">
                🎥 Producers
              </h3>
            </template>
            
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="producer in animeData.data.producers" 
                :key="producer.mal_id"
                :label="producer.name"
                color="neutral"
                variant="outline"
                size="sm"
              />
            </div>
          </UCard>
        </div>

        <!-- Raw JSON Data -->
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">
              📦 Raw JSON Response
            </h3>
          </template>

          <!-- <UCodeBlock
            :code="JSON.stringify(animeData, null, 2)"
            lang="json"
            class="max-h-96 overflow-auto"
          /> -->

          <details>
            <summary class="cursor-pointer text-blue-600 dark:text-blue-400 underline mb-3">
              Original Data
            </summary>
            <code>
              <pre>{{ JSON.stringify(anime, null, 2) }}</pre>
            </code>
          </details>
          <details>
            <summary class="cursor-pointer text-blue-600 dark:text-blue-400 underline mb-3">
              API Jikan Anime Full Data
            </summary>
            <code>
              <pre>{{ JSON.stringify(animeData, null, 2) }}</pre>
            </code>
          </details>
        </UCard>
      </template>
    </div>
  </UContainer>
</template>