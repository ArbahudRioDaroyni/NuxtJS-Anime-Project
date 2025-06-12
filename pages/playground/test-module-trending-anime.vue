<script setup lang="ts">
import type { Ref } from 'vue'

type Anime = {
  mal_id: number
  title: string
  // add other fields as needed
}

type TrendingAnimeResponse = {
  data: Anime[]
}

const { data } = useTrendingAnime() as { data: Ref<TrendingAnimeResponse> }
</script>

<template>
  <div class="container flex flex-col w-full h-full">
    <h2>Trending Anime</h2>
    <ul>
      <li v-for="anime in data?.data" :key="anime.mal_id">
        {{ anime.title }}
      </li>
    </ul>
  </div>
</template>