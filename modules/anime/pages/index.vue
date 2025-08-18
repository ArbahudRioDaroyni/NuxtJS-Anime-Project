<template>
    <div>
      <h1>Anime List</h1>
      <ul>
        <li v-for="anime in store.list" :key="anime.id">
          <NuxtLink :to="`/anime/${anime.slug}`">{{ anime.title }}</NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  const store = useAnimeStore()
  await store.fetchAll()
  </script>
  