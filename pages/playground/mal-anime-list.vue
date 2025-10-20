<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top Search & Filter Section -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <UContainer class="py-4">
        <div class="space-y-4">
          <!-- Search Bar -->
          <div class="flex gap-3">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search anime..."
              size="lg"
              class="flex-1"
              @keyup.enter="handleSearch"
            />
            <UButton
              label="Search"
              icon="i-lucide-search"
              size="lg"
              color="primary"
              :loading="pending"
              @click="handleSearch"
            />
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap gap-3">
            <USelect
              v-model="selectedType"
              :items="animeTypes"
              placeholder="All Types"
              size="md"
              class="w-40"
            />
            <USelect
              v-model="selectedStatus"
              :items="animeStatus"
              placeholder="All Status"
              size="md"
              class="w-40"
            />
            <USelect
              v-model="selectedRating"
              :items="animeRatings"
              placeholder="All Ratings"
              size="md"
              class="w-40"
            />
            <USelect
              v-model="selectedOrderBy"
              :items="orderByOptions"
              placeholder="Sort By"
              size="md"
              class="w-40"
            />
            <UButton
              label="Reset Filters"
              variant="outline"
              color="neutral"
              size="md"
              icon="i-lucide-x"
              @click="resetFilters"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-6">
      <!-- Results Info -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Anime Database
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ totalItems }} anime found
            <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
          </p>
        </div>
        
        <!-- View Toggle -->
        <div class="flex gap-2">
          <UButton
            :variant="viewMode === 'grid' ? 'solid' : 'outline'"
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            icon="i-lucide-grid-2x2"
            size="sm"
            @click="viewMode = 'grid'"
          />
          <UButton
            :variant="viewMode === 'list' ? 'solid' : 'outline'"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            icon="i-lucide-list"
            size="sm"
            @click="viewMode = 'list'"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <UCard v-for="i in 20" :key="i" class="animate-pulse">
          <div class="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div class="mt-3 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </UCard>
      </div>

      <!-- Anime Grid View -->
      <div
        v-else-if="viewMode === 'grid' && animeList.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        <UCard
          v-for="anime in animeList"
          :key="anime.mal_id"
          class="group cursor-pointer hover:shadow-lg transition-all duration-200"
          @click="navigateToAnime(anime)"
        >
          <div class="space-y-3">
            <!-- Anime Image -->
            <div class="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
              <img
                v-if="anime.images?.jpg?.large_image_url"
                :src="anime.images.jpg.large_image_url"
                :alt="anime.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-lucide-image-off" class="w-12 h-12 text-gray-400" />
              </div>

              <!-- Score Badge -->
              <div v-if="anime.score" class="absolute top-2 right-2">
                <UBadge
                  :label="`★ ${anime.score}`"
                  color="warning"
                  variant="solid"
                  size="sm"
                />
              </div>

              <!-- Type Badge -->
              <div v-if="anime.type" class="absolute top-2 left-2">
                <UBadge
                  :label="anime.type"
                  color="primary"
                  variant="solid"
                  size="sm"
                />
              </div>
            </div>

            <!-- Anime Info -->
            <div class="space-y-1">
              <h3 class="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
                {{ anime.title }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span v-if="anime.episodes">{{ anime.episodes }} eps</span>
                <span v-if="anime.year">• {{ anime.year }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Anime List View -->
      <div
        v-else-if="viewMode === 'list' && animeList.length > 0"
        class="space-y-3"
      >
        <UCard
          v-for="anime in animeList"
          :key="anime.mal_id"
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="navigateToAnime(anime)"
        >
          <div class="flex gap-4">
            <!-- Image -->
            <div class="w-24 h-36 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                v-if="anime.images?.jpg?.image_url"
                :src="anime.images.jpg.image_url"
                :alt="anime.title"
                class="w-full h-full object-cover"
                loading="lazy"
              >
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-1">
                    {{ anime.title }}
                  </h3>
                  <p v-if="anime.title_japanese" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ anime.title_japanese }}
                  </p>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <UBadge
                    v-if="anime.score"
                    :label="`★ ${anime.score}`"
                    color="warning"
                    variant="solid"
                  />
                  <UBadge
                    v-if="anime.status"
                    :label="anime.status"
                    :color="anime.status === 'Finished Airing' ? 'success' : 'info'"
                    variant="soft"
                  />
                </div>
              </div>

              <!-- Synopsis -->
              <p
                v-if="anime.synopsis"
                class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3"
              >
                {{ anime.synopsis }}
              </p>

              <!-- Meta Info -->
              <div class="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div v-if="anime.type" class="flex items-center gap-1">
                  <UIcon name="i-lucide-tv" class="w-4 h-4" />
                  {{ anime.type }}
                </div>
                <div v-if="anime.episodes" class="flex items-center gap-1">
                  <UIcon name="i-lucide-film" class="w-4 h-4" />
                  {{ anime.episodes }} episodes
                </div>
                <div v-if="anime.year" class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                  {{ anime.year }}
                </div>
                <div v-if="anime.rating" class="flex items-center gap-1">
                  <UIcon name="i-lucide-shield" class="w-4 h-4" />
                  {{ anime.rating }}
                </div>
              </div>

              <!-- Genres -->
              <div v-if="anime.genres && anime.genres.length > 0" class="mt-2 flex flex-wrap gap-1">
                <UBadge
                  v-for="genre in anime.genres.slice(0, 5)"
                  :key="genre.mal_id"
                  :label="genre.name"
                  color="neutral"
                  variant="soft"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div v-else-if="!pending && animeList.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-search-x" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No anime found
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <UPagination
          v-model:page="currentPage"
          :total="totalItems"
          :items-per-page="itemsPerPage"
          show-edges
          :sibling-count="1"
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
interface JikanAnimeItem {
  mal_id: number
  title: string
  title_japanese?: string
  images?: {
    jpg?: {
      image_url?: string
      large_image_url?: string
    }
  }
  type?: string
  episodes?: number
  status?: string
  score?: number
  year?: number
  rating?: string
  synopsis?: string
  genres?: Array<{ mal_id: number; name: string }>
}

interface JikanResponse {
  data: JikanAnimeItem[]
  pagination: {
    last_visible_page: number
    has_next_page: boolean
    items: {
      count: number
      total: number
      per_page: number
    }
  }
}

// Page Meta
definePageMeta({
  layout: 'blank',
})

// Filter Options
const animeTypes = ['TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music']
const animeStatus = ['airing', 'complete', 'upcoming']
const animeRatings = ['g', 'pg', 'pg13', 'r17', 'r', 'rx']
const orderByOptions = [
  { label: 'Score', value: 'score' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'Title', value: 'title' },
  { label: 'Start Date', value: 'start_date' },
  { label: 'End Date', value: 'end_date' },
]

// State
const searchQuery = ref('')
const selectedType = ref<string>()
const selectedStatus = ref<string>()
const selectedRating = ref<string>()
const selectedOrderBy = ref('score')
const currentPage = ref(1)
const viewMode = ref<'grid' | 'list'>('grid')
const itemsPerPage = 25

// Reactive Data
const animeList = ref<JikanAnimeItem[]>([])
const totalItems = ref(0)
const totalPages = ref(1)
const pending = ref(false)

// Computed
const apiUrl = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  params.append('limit', itemsPerPage.toString())
  
  if (searchQuery.value) params.append('q', searchQuery.value)
  if (selectedType.value) params.append('type', selectedType.value)
  if (selectedStatus.value) params.append('status', selectedStatus.value)
  if (selectedRating.value) params.append('rating', selectedRating.value)
  if (selectedOrderBy.value) params.append('order_by', selectedOrderBy.value)
  params.append('sort', 'desc')
  
  return `https://api.jikan.moe/v4/anime?${params.toString()}`
})

// Methods
async function fetchAnime() {
  pending.value = true
  try {
    const response = await $fetch<JikanResponse>(apiUrl.value)
    animeList.value = response.data
    totalItems.value = response.pagination.items.total
    totalPages.value = response.pagination.last_visible_page
  } catch (error) {
    console.error('Error fetching anime:', error)
    animeList.value = []
    totalItems.value = 0
    totalPages.value = 1
  } finally {
    pending.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchAnime()
}

function resetFilters() {
  searchQuery.value = ''
  selectedType.value = undefined
  selectedStatus.value = undefined
  selectedRating.value = undefined
  selectedOrderBy.value = 'score'
  currentPage.value = 1
  fetchAnime()
}

function navigateToAnime(anime: JikanAnimeItem) {
  // Open MAL page in new tab
  window.open(`https://myanimelist.net/anime/${anime.mal_id}`, '_blank')
}

// Watch for page changes
watch(currentPage, () => {
  fetchAnime()
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Watch for filter changes
watch([selectedType, selectedStatus, selectedRating, selectedOrderBy], () => {
  currentPage.value = 1
  fetchAnime()
})

// Initial fetch
onMounted(() => {
  fetchAnime()
})
</script>
