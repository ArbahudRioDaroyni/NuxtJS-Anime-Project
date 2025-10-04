<template>
  <V1Grid tag="ul" template="columns" length="200px">
    <V1Card
      v-for="(anime, index) in data"
      :key="`relation-${index}`"
      :title="anime?.title_romaji || anime?.title_english || anime?.title_native || 'Unknown Title'"
      :aria-label="`Anime: ${anime?.title_romaji || anime?.title_english || anime?.title_native || 'Unknown Title'}`"
      variant="both"
      layout="horizontal"
      clickable
      :href="anime?.slug"
      tag="li"
      @click="trackClick"
    >
      <V1Image
        :src="anime?.medium_cover_image_url || anime?.large_cover_image_url || '/image/image-230x345.webp'"
        :alt="anime?.title_romaji || anime?.title_english || anime?.title_native || 'Unknown Title'"
      />

      <div>
        <NuxtLink :to="anime?.slug">
          {{ anime?.title_romaji || anime?.title_english || anime?.title_native || 'Unknown Title' }}
        </NuxtLink>
      </div>
    </V1Card>
  </V1Grid>
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'

interface Props {
  data?: AnimeDetails[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

const trackClick = () => {
  console.log('Anime card clicked');
}

useHead({ script: [{ innerHTML: `console.log(${JSON.stringify(props.data, null, 2)})` }] })
</script>