<template>
  <!-- <V1AnimeFilter /> -->
  <UMain>
    <V1Animes :data="trending" heading="Trending" margin="md" class="mt-[5rem]" />
    <V1Animes :data="faforites" heading="Favorites" />
    <V1Animes :data="popular" heading="Popular" />
  </UMain>
</template>

<script lang="ts" setup>
import type { ResponseType } from '~/types/database'
import type { AnimeDetails } from '~/types/anime'

const { data: response, pending: _pending, error: _error } = await useFetch<ResponseType>(
  `/api/anime/home`, 
  {
    key: `anime`,
    server: true,
    default: () => ({ 
      success: false, 
      code: 404, 
      message: 'Not found', 
      length: 0, 
      data: [] 
    }),
    retry: 3,
    retryDelay: 1000,
    timeout: 10000,
  }
)

const trending = computed(() => response.value?.meta?.trending?.data as AnimeDetails[] | undefined)
const faforites = computed(() => response.value?.meta?.favorites?.data as AnimeDetails[] | undefined)
const popular = computed(() => response.value?.meta?.popular?.data as AnimeDetails[] | undefined)
</script>