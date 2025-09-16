<template>
  <div class="anime-search-wrapper">
    <div class="search-container">
      <BaseInput
        ref="searchInput"
        v-model="searchQuery"
        placeholder="Search anime by title... (typo-tolerant)"
        type="text"
        size="md"
        variant="default"
        :loading="loading"
        @input="handleInput"
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
      />
      
      <div v-if="loading" class="search-indicator">
        <div class="loading-spinner">⟳</div>
      </div>
      
      <div v-if="searchQuery.length > 0 && !loading" class="search-clear">
        <button class="clear-btn" @click="clearSearch">×</button>
      </div>
    </div>
    
    <!-- Suggestions dropdown with conditional rendering -->
    <div 
      v-if="showSuggestions && (suggestions.length > 0 || searchQuery.length >= 2)"
      class="suggestions-dropdown"
    >
      <!-- Search suggestions - only show if not applied -->
      <div v-if="searchSuggestions.length > 0 && !appliedSuggestion" class="search-suggestions">
        <p class="suggestions-title">Did you mean:</p>
        <div class="suggestion-chips">
          <button
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            class="suggestion-chip"
            @mousedown.prevent="applySuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
      
      <!-- Typo correction - only show if not applied -->
      <div v-if="correctedQuery && correctedQuery !== searchQuery && !appliedSuggestion" class="typo-correction">
        <p class="correction-text">
          Did you mean: 
          <button class="correction-btn" @mousedown.prevent="applySuggestion(correctedQuery)">
            "{{ correctedQuery }}"
          </button>
        </p>
      </div>
      
      <!-- Search stats -->
      <div v-if="searchStats && suggestions.length > 0" class="search-stats">
        <small>
          Found: {{ searchStats.matched || 0 }} matches in
          {{ searchStats.totalScanned || 0 }} scanned animes.
        </small>
      </div>
      
      <!-- Algorithm info for debugging -->
      <div v-if="showDebugInfo && algorithmInfo.length > 0" class="algorithm-info">
        <small>Algorithms used: {{ algorithmInfo.join(', ') }}</small>
      </div>
      
      <!-- No results message -->
      <div v-if="searchQuery.length >= 2 && suggestions.length === 0 && !loading" class="no-results">
        <p>No anime found matching "{{ searchQuery }}"</p>
        <p class="no-results-hint">Try checking spelling or use fewer words</p>
      </div>
      
      <!-- Suggestions list -->
      <div v-else-if="suggestions.length > 0" class="suggestions-list">
        <div
          v-for="anime in suggestions"
          :key="anime.id"
          class="suggestion-item"
          @mousedown.prevent="selectAnime(anime)"
        >
          <div class="anime-thumbnail">
            <img
              v-if="anime.medium_cover_image_url"
              :src="anime.medium_cover_image_url"
              :alt="anime.title_romaji"
              class="thumbnail-img">
            <div v-else class="thumbnail-placeholder">📺</div>
          </div>
          
          <div class="anime-info">
            <h4 class="anime-title">{{ anime.title_romaji }}</h4>
            <p v-if="anime.title_english" class="anime-subtitle">{{ anime.title_english }}</p>
            <div class="anime-meta">
              <span v-if="anime.year" class="year">{{ anime.year }}</span>
              <span v-if="anime.episodes" class="episodes">{{ anime.episodes }} eps</span>
              <span v-if="anime.popularity" class="popularity">❤️ {{ anime.popularity }}</span>
            </div>
          </div>
        </div>
        
        <!-- Show more results indicator -->
        <div v-if="hasMore" class="show-more">
          <button class="show-more-btn" @mousedown.prevent="viewAllResults">
            View all results for "{{ searchQuery }}"
          </button>
        </div>
      </div>
      
      <!-- Minimum length message -->
      <div v-else-if="searchQuery.length > 0 && searchQuery.length < 2" class="min-length-hint">
        <p>Type at least 2 characters to search</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AnimeSearchResult {
  id: number
  slug: string
  title_romaji: string
  title_english?: string
  title_native?: string
  year: string
  popularity: number
  episodes?: number
  medium_cover_image_url?: string
}

interface SearchResponse {
  success: boolean
  data: AnimeSearchResult[]
  meta?: {
    hasMore: boolean
    originalQuery: string
    correctedQuery?: string
    searchSuggestions?: string[]
    algorithms?: string[]
    searchStats?: {
      totalScanned: number
      matched: number
      highConfidence: number
      exactMatches?: number
      partialMatches?: number
      fuzzyMatches?: number
    }
  }
}

const emit = defineEmits<{
  select: [anime: AnimeSearchResult]
}>()

const searchInput = ref<HTMLInputElement>()
const searchQuery = ref<string>('')
const suggestions = ref<AnimeSearchResult[]>([])
const loading = ref(false)
const showSuggestions = ref(false)
const hasMore = ref(false)
const correctedQuery = ref<string>()
const searchSuggestions = ref<string[]>([])
const algorithmInfo = ref<string[]>([])
const showDebugInfo = ref(false)
const searchStats = ref<{
  totalScanned: number
  matched: number
  highConfidence: number
  exactMatches?: number
  partialMatches?: number
  fuzzyMatches?: number
}>()

// Add flag to track if suggestion was applied
const appliedSuggestion = ref(false)

let searchTimeout: NodeJS.Timeout

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  if (searchQuery.value.length < 2) {
    suggestions.value = []
    hasMore.value = false
    correctedQuery.value = undefined
    searchSuggestions.value = []
    algorithmInfo.value = []
    searchStats.value = undefined
    appliedSuggestion.value = false // Reset flag
    return
  }
  
  searchTimeout = setTimeout(async () => {
    await performSearch()
  }, 500)
}

const performSearch = async () => {
  if (searchQuery.value.length < 2) return
  
  loading.value = true
  
  try {
    const response: SearchResponse = await $fetch('/api/anime/search', {
      query: {
        q: searchQuery.value,
        limit: 8,
        threshold: 0.4,
        advanced: 'true'
      }
    })
    
    if (response.success) {
      suggestions.value = response.data
      hasMore.value = response.meta?.hasMore || false
      algorithmInfo.value = response.meta?.algorithms || []
      searchStats.value = response.meta?.searchStats
      
      // Only show suggestions if user hasn't applied a suggestion
      if (!appliedSuggestion.value) {
        correctedQuery.value = response.meta?.correctedQuery
        searchSuggestions.value = response.meta?.searchSuggestions || []
      } else {
        // Clear suggestions since user already applied one
        correctedQuery.value = undefined
        searchSuggestions.value = []
      }
      
      // Show suggestions if we have results
      if (suggestions.value.length > 0 || searchSuggestions.value.length > 0) {
        showSuggestions.value = true
      }
    }
  } catch (error) {
    console.error('Search failed:', error)
    suggestions.value = []
    searchSuggestions.value = []
    algorithmInfo.value = []
    searchStats.value = undefined
    correctedQuery.value = undefined
  } finally {
    loading.value = false
  }
}

const applySuggestion = async (suggestion: string) => {
  console.log('Applying suggestion:', suggestion)
  
  // Set flag to indicate suggestion was applied
  appliedSuggestion.value = true
  
  // Clear timeout to prevent pending searches
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Update query
  searchQuery.value = suggestion
  
  // Clear all suggestions immediately
  searchSuggestions.value = []
  correctedQuery.value = undefined
  
  // Focus input to keep it active
  if (searchInput.value) {
    searchInput.value.focus()
  }
  
  // Perform search with new query
  await performSearch()
  
  // Keep suggestions dropdown open to show results
  showSuggestions.value = true
  
  // Reset flag after search is complete
  setTimeout(() => {
    appliedSuggestion.value = false
  }, 100)
}

const selectAnime = (anime: AnimeSearchResult) => {
  emit('select', anime)
  searchQuery.value = anime.title_romaji
  showSuggestions.value = false
  navigateTo(`/${anime.slug}`)
}

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  showSuggestions.value = false
  hasMore.value = false
  correctedQuery.value = undefined
  searchSuggestions.value = []
  algorithmInfo.value = []
  searchStats.value = undefined
  appliedSuggestion.value = false // Reset flag
  
  if (searchInput.value) {
    searchInput.value.focus()
  }
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const viewAllResults = () => {
  navigateTo(`/anime?search=${encodeURIComponent(searchQuery.value)}`)
  showSuggestions.value = false
}

// Watch for manual changes to searchQuery
watch(searchQuery, (newQuery, oldQuery) => {
  if (newQuery.length === 0) {
    suggestions.value = []
    hasMore.value = false
    correctedQuery.value = undefined
    searchSuggestions.value = []
    algorithmInfo.value = []
    searchStats.value = undefined
    appliedSuggestion.value = false
  } else if (newQuery !== oldQuery) {
    // Skip if suggestion is being applied
    if (!appliedSuggestion.value) {
      handleSearch()
    }
    // Don't trigger search if appliedSuggestion is true
  }
})

// Watch for user input events to detect manual typing
const handleInput = () => {
  // Only reset flag and search if not currently applying suggestion
  if (!appliedSuggestion.value) {
    handleSearch()
  }
}

// Auto-focus input when component mounts
onMounted(() => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
})

// Cleanup saat component unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped>
.anime-search-wrapper {
  position: relative;
  width: 100%;
  max-width: 28rem;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 48px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.search-input.searching {
  padding-right: 64px;
}

.search-indicator {
  position: absolute;
  right: 40px;
  color: #3b82f6;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.search-clear {
  position: absolute;
  right: 12px;
}

.clear-btn {
  padding: 4px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 20px;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #6b7280;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 24rem;
  overflow-y: auto;
  z-index: 50;
}

.suggestions-list {
  border-top: 1px solid #f3f4f6;
}

.suggestions-list > div:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.suggestion-item:hover {
  background-color: #f9fafb;
}

.anime-thumbnail {
  flex-shrink: 0;
  width: 48px;
  height: 64px;
  margin-right: 12px;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 20px;
}

.anime-info {
  flex: 1;
  min-width: 0;
}

.anime-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.anime-subtitle {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.anime-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.popularity {
  color: #ef4444;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #9ca3af;
}

.min-length-hint {
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
}

.show-more {
  padding: 12px;
  border-top: 1px solid #f3f4f6;
}

.show-more-btn {
  width: 100%;
  background: none;
  border: none;
  font-size: 14px;
  color: #3b82f6;
  cursor: pointer;
  transition: color 0.2s;
}

.show-more-btn:hover {
  color: #1d4ed8;
}

.search-suggestions {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  background-color: #f8fafc;
}

.suggestions-title {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-chip {
  padding: 4px 8px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-chip:hover {
  background-color: #d1d5db;
}

.typo-correction {
  padding: 12px;
  background-color: #fef3c7;
  border-bottom: 1px solid #f3f4f6;
}

.correction-text {
  font-size: 14px;
  color: #92400e;
  margin: 0;
}

.correction-btn {
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.correction-btn:hover {
  color: #1e40af;
}

.search-stats {
  padding: 8px 12px;
  background-color: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
  font-size: 12px;
  color: #6b7280;
}

.algorithm-info {
  padding: 8px 12px;
  font-size: 11px;
  color: #9ca3af;
  background-color: #f9fafb;
}

.no-results-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #374151;
    border-color: #4b5563;
    color: white;
  }
  
  .search-input::placeholder {
    color: #9ca3af;
  }
  
  .suggestions-dropdown {
    background-color: #374151;
    border-color: #4b5563;
  }
  
  .suggestion-item:hover {
    background-color: #4b5563;
  }
  
  .anime-title {
    color: white;
  }
  
  .anime-subtitle {
    color: #d1d5db;
  }
  
  .thumbnail-placeholder {
    background-color: #4b5563;
    color: #9ca3af;
  }
  
  .search-suggestions {
    background-color: #4b5563;
  }
  
  .suggestion-chip {
    background-color: #6b7280;
    color: #f3f4f6;
  }
  
  .suggestion-chip:hover {
    background-color: #9ca3af;
  }
  
  .typo-correction {
    background-color: #451a03;
  }
  
  .correction-text {
    color: #fbbf24;
  }
  
  .search-stats,
  .algorithm-info {
    background-color: #4b5563;
    color: #d1d5db;
  }
}
</style>
