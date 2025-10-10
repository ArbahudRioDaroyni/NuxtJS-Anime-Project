<template>
  <section v-if="trailerUrl">
    <h2 class="overview-title">Trailer</h2>
    <V1Card variant="inner">
      <iframe
        width="560"
        height="315"
        :src="trailerUrl"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </V1Card>
  </section>
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'

interface Props {
  data?: AnimeDetails
}

const props = defineProps<Props>()

const trailerUrl = computed(() => {
  const url = props.data?.trailer_url
  const idYoutube = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([a-zA-Z0-9_-]{11})/)
  return url && idYoutube && idYoutube[1] ? `https://www.youtube.com/embed/${idYoutube[1]}` : null
})
</script>