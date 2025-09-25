<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'
import ExternalSites from './ExternalSites.vue'
import Rankings from './Rankings.vue'

interface DetailItem {
  label: string
  value: string
  fullWidth?: boolean
}

interface Props {
  anime?: AnimeDetails | null
}

const props = defineProps<Props>()

// Utility functions - extracted dan memoized
const formatters = {
  duration: (duration: number | undefined | null, unit: string | undefined | null): string => {
    if (!duration) return 'N/A'
    const unitLabel = unit === 'm' ? 'mins' : 'hours'
    return `${duration} ${unitLabel}`
  },
  
  date: (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },
  
  season: (season: { name?: string } | undefined | null, year: string | undefined | null): string => {
    return season?.name && year ? `${season.name} ${year}` : 'N/A'
  },
  
  score: (score: number | undefined | null): string => {
    return score ? `${Math.round(score)}%` : 'N/A'
  },
  
  studios: (studioRelations: Array<{ is_main?: boolean; studio?: { name?: string } }> | undefined | null): string => {
    if (!studioRelations?.length) return 'N/A'
    
    const mainStudio = studioRelations.find(relation => relation.is_main)
    if (mainStudio?.studio?.name) return mainStudio.studio.name
    
    return studioRelations
      .map(relation => relation.studio?.name)
      .filter(Boolean)
      .join(', ') || 'N/A'
  },
  
  synonyms: (synonymsData: string | undefined | null): string => {
    if (!synonymsData) return 'N/A'
    
    try {
      const parsed = JSON.parse(synonymsData)
      return Array.isArray(parsed) ? parsed.join(', ') : synonymsData
    } catch {
      return synonymsData
    }
  }
}

// Main computed with better structure
const animeDetails = computed<DetailItem[]>(() => {
  const anime = props.anime
  if (!anime) return []

  return [
    { label: 'Format', value: anime.release_format?.name || 'N/A' },
    { label: 'Episode Duration', value: formatters.duration(anime.duration, anime.duration_unit) },
    { label: 'Status', value: anime.status_type?.name ? startCase(anime.status_type.name) : 'Unknown' },
    { label: 'Start Date', value: formatters.date(anime.start_date) },
    { label: 'Season', value: formatters.season(anime.season, anime.year) },
    { label: 'Average Score', value: formatters.score(anime.mean_score) },
    { label: 'Mean Score', value: formatters.score(anime.mean_score) },
    { label: 'Popularity', value: formatNumber(anime.popularity) },
    { label: 'Favorites', value: formatNumber(anime.favorites) },
    { label: 'Studios', value: formatters.studios(anime.anime_studio_relations) },
    { label: 'Source', value: anime.source_media_type?.name || 'Original' },
    { label: 'Hashtag', value: anime.hashtag || 'N/A' },
    { label: 'Genres', value: 'N/A' }, // TODO: Implement genres
    { label: 'Romaji', value: anime.title_romaji || 'N/A' },
    { label: 'English', value: anime.title_english || 'N/A' },
    { label: 'Native', value: anime.title_native || 'N/A' },
    { label: 'Synonyms', value: formatters.synonyms(anime.synonyms), fullWidth: true }
  ].filter(item => item.value !== 'N/A' || ['Format', 'Genres'].includes(item.label)) // Filter empty values
})

// Optimized countdown - cached and only computed when needed
const nextEpisodeCountdown = computed(() => {
  const anime = props.anime
  if (!anime?.status_type?.name || !anime.episodes) return null
  
  const status = startCase(anime.status_type.name)
  if (status !== 'RELEASING') return null
  
  // TODO: Calculate real countdown from next_airing_at if available
  return `Airing Ep ${anime.episodes + 1}: 12d 10h 4m`
})

// Memoized external sites to prevent unnecessary re-renders
const externalSites = computed(() => props.anime?.anime_external_site_relations)
</script>

<template>
  <aside v-if="props.anime" class="sidebar-container">
    <!-- Search Component -->
    <CommonSearch />

    <!-- Rankings -->
    <Rankings />

    <!-- Main Details Card -->
    <BaseCardNeomorphism variant="outer" class="card-details">
      <!-- Next Episode Countdown -->
      <BaseCardNeomorphism v-if="nextEpisodeCountdown" variant="inner" class="countdown">
        {{ nextEpisodeCountdown }}
      </BaseCardNeomorphism>

      <!-- Anime Details Grid -->
      <div class="details-grid">
        <BaseCardNeomorphism 
          v-for="(detail, index) in animeDetails" 
          :key="`${detail.label}-${index}`"
          variant="inner"
          class="detail-item"
          :class="{ 'full-col': detail.fullWidth }"
        >
          <span class="label">{{ detail.label }}</span>
          <span class="value">{{ detail.value }}</span>
        </BaseCardNeomorphism>
      </div>
    </BaseCardNeomorphism>

    <ExternalSites :external-sites="externalSites" class="card-details" />
  </aside>
  <aside v-else class="sidebar-container">
    <div class="no-data">No anime data available</div>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar-container {
  display: grid;
  gap: 1.5rem;
  // contain: layout style paint; // CSS containment for performance
}

.loading-placeholder {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary, #6b7280);
  font-size: 0.875rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.no-data {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary, #6b7280);
  font-style: italic;
}

.card-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
  padding: 0.5rem;
}

.countdown {
  margin-bottom: 1rem;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  background: var(--accent-color, #f3f4f6);
  border-radius: 0.5rem;
  will-change: transform; // Optimize for animations
}

.details-grid {
  display: grid;
  gap: 0.75rem;
  // Use content-visibility for better performance with many items
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

.detail-item {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 0.5rem;
  align-items: center;

  &.full-col {
    grid-template-columns: 1fr;
  }
}

.label {
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  font-size: 0.875rem;
  // Prevent text selection for better UX
  user-select: none;
}

.value {
  color: var(--text-primary, #111827);
  font-size: 0.875rem;
  word-break: break-word;
  // Allow text selection for copying
  user-select: text;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar-container {
    gap: 1rem;
  }
  
  .detail-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
  
  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .value {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
}

/* Dark mode support with system preference */
@media (prefers-color-scheme: dark) {
  .label {
    color: var(--text-secondary-dark, #9ca3af);
  }
  
  .value {
    color: var(--text-primary-dark, #f9fafb);
  }
  
  .countdown {
    background: var(--accent-color-dark, #374151);
  }
  
  .loading-placeholder {
    color: var(--text-secondary-dark, #9ca3af);
  }
  
  .no-data {
    color: var(--text-secondary-dark, #9ca3af);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .label {
    font-weight: 700;
  }
  
  .countdown {
    border: 2px solid currentColor;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .loading-placeholder {
    animation: none;
  }
  
  .countdown {
    will-change: auto;
  }
}
</style>