<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending">
      <CommonLoadingSpinner />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error">
      <CommonError :error="error" />
    </div>
    
    <!-- Content -->
    <FeatureAnime v-else :anime="anime" />
  </div>
</template>

<script setup lang="ts">
import type { ResponseType } from '~/types/database'
import type { AnimeDetails } from '~/types/anime'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: response, pending, error } = await useFetch<ResponseType>(
  `/api/anime/slug/${slug.value}`, 
  {
    key: `anime-${slug.value}`,
    server: true,
    default: () => ({ success: false, code: 404, message: 'Not found', length: 0, data: [] }),
    retry: 3,
    retryDelay: 1000,
    timeout: 10000,
  }
)

const anime = computed(() => response.value?.data?.[0] as AnimeDetails | undefined)

watchEffect(() => {
  if (!pending.value) {
    if (error.value) {
      console.error('API Error:', error.value)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load anime data'
      })
    }
    
    if (!anime.value || !response.value?.success) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Anime not found'
      })
    }
  }
})

const { seoMeta } = useAnimeSeo(anime)
useSeoMeta(seoMeta.value)

if (import.meta.dev) {
  useHead({ 
    script: [
      { innerHTML: `console.log(${JSON.stringify(anime.value, null, 2)})` },
      { innerHTML: `console.log(${JSON.stringify(seoMeta.value, null, 2)})` }
    ]
  })
}
</script>