<script setup lang="ts">
import type { ResponseType } from '~/types/database'
import type { AnimeDetails } from '~/types/anime'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: response, pending, error } = await useFetch<ResponseType>(`/api/anime/slug/${slug.value}`, {
  key: `anime-${slug.value}`,
  server: true,
  default: () => ({ success: false, code: 404, message: 'Not found', length: 0, data: [] })
})

const anime = computed(() => response.value?.data?.[0] as AnimeDetails | undefined)

// Handle 404 errors
watchEffect(() => {
  if (!pending.value && (error.value || !anime.value)) {
    navigateTo('/not-found')
  }
})

const meta = computed(() => {
  const title = anime.value?.title_english || anime.value?.title_romaji || 'Unknown Anime'
  const description = anime.value?.description || 'No description available for this anime.'
  const synonyms = anime.value?.synonyms ? JSON.parse(anime.value.synonyms) : []
  const keywords = [
    anime.value?.title_romaji,
    anime.value?.title_english,
    anime.value?.title_native,
    ...synonyms,
    'anime', 'details', 'watch'
  ].filter(Boolean)
  const image = anime.value?.large_cover_image_url || anime.value?.medium_cover_image_url || '/image/image-230x345.webp'
  
  return {
    title: title,
    description: description ? description.slice(0, 160) + '...' : 'Anime details and information',
    keywords: keywords.join(', ') || 'anime, details, watch',
    image: image,
  }
})

useSeoMeta({
  title: meta.value.title,
  description: meta.value.description,
  keywords: meta.value.keywords,
  ogTitle: meta.value.title,
  ogDescription: meta.value.description,
  ogImage: meta.value.image,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: meta.value.title,
  twitterDescription: meta.value.description,
  twitterImage: meta.value.image
})

// useHead({script: [ { innerHTML: `console.log(${JSON.stringify(anime.value, null, 2)})` } ]})
</script>

<template>
  <BaseContainer class="anime-details-page">
    <!-- Loading State -->
    <div v-if="pending" class="loading-container">
      <div class="loading-spinner">Loading...</div>
    </div>

    <!-- Main Content -->
    <div v-else-if="anime" class="main-layout">
      <FeatureAnime :anime="anime" />
    </div>
  </BaseContainer>
</template>

<style scoped>
.anime-details-page {
  min-height: 100vh;
  margin-top: 4rem !important; /* Adjusted for header height */
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  font-size: 1.125rem;
  color: var(--text-muted, #6b7280);
}

.main-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  .main-layout {
    flex-direction: row;
    padding: 2rem;
  }
}

/* Responsive Design Improvements */
@media (max-width: 480px) {
  .main-layout {
    padding: 1rem 0.5rem;
    gap: 1rem;
  }
  
  .anime-details-page {
    padding: 0;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  /* Add any dark mode styles if needed */
}
</style>