<template>
  <UContainer as="section" class="my-6 p0">
    <h2>{{ heading }}</h2>
    <UPageGrid class="grid-cols-[repeat(auto-fill,minmax(200px,1fr))]! gap-6">
       <UPageCard
         v-for="(anime, index) in data"
         :key="`relation-${index}`"
         :title="anime?.title_romaji || anime?.title_english || anime?.title_native || 'Unknown Title'"
         :to="anime?.slug"
         orientation="vertical"
         variant="outline"
         class="[--tw-ring-color:var(--color-gray)]"
       >
         <V1Image
           :src="anime?.large_cover_image_url || anime?.medium_cover_image_url || '/image/image-230x345.webp'"
           :alt="anime?.title_romaji || anime?.title_english || anime?.title_native || 'Unknown Title'"
         />
       </UPageCard>
     </UPageGrid>
  </UContainer>
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'

interface Props {
  data?: AnimeDetails[]
  heading?: string
}

const _props = withDefaults(defineProps<Props>(), {
  data: () => [],
  heading: 'Anime List'
})
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}
</style>