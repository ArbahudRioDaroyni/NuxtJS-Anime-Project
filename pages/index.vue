<template>
  <V1Container tag="main" margin="xl">
    <V1AnimeFilter />
    <h1>Welcome to AniWorld</h1>
    <V1Animes :data="data" />
  </V1Container>
</template>

<script lang="ts" setup>
import type { ResponseType } from '~/types/database'
import type { AnimeDetails } from '~/types/anime'


const { data: response, pending: _pending, error: _error } = await useFetch<ResponseType>(`/api/anime`, {
  key: `anime`,
  server: true,
  default: () => ({ success: false, code: 404, message: 'Not found', length: 0, data: [] }),
  retry: 3,
  retryDelay: 1000,
  timeout: 10000,
})

const data = computed(() => response.value?.data as AnimeDetails[] | undefined)
</script>