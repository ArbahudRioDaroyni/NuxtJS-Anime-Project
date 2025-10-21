<template>
  <UMain class="mt-[5rem] min-h-screen flex flex-col gap-8">

    <!-- Anime List Carousel Section -->
    <section class="py-6 relative">
      <!-- Background Image -->
      <div 
        class="absolute inset-0 bg-[url('/image/test.jpg')] bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        aria-hidden="true"
      />
      <UContainer v-if="!pending && response.length > 0">
        <!-- Hero Carousel -->
        <RekaAnimeCarousel
          v-if="trending && trending.length > 0"
          :items="trending"
          class="my-12"
          @watch="handleWatch"
          @info="handleInfo"
        />
      </UContainer>
    </section>

    <!-- Popular All Time Section -->
    <section class="relative">
      <UContainer class="mb-6 flex items-center justify-between">
        <!-- Header -->
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Popular All Time
        </h2>
        <!-- View all -->
        <NuxtLink
          to="/explore"
          class="text-sm text-primary hover:underline"
        >
          View All
        </NuxtLink>
      </UContainer>

      <UContainer class="mb-6">
        <!-- Anime Cards Grid -->
        <UPageGrid class="sm:grid-cols-4 lg:grid-cols-6">
          <UCard
            v-for="(card, index) in popularity"
            :key="index"
            v-bind="card"
            variant="neumorphic-inner"
            :ui="{ body: 'p-4!' }"
          >
            <NuxtImg
              :src="card.image"
              :alt="card.title"
              class="w-full h-auto rounded-lg"
              :sizes="`(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw`"
              priority
            />
            <h3 class="mt-2 text-base text-gray-800 dark:text-gray-200">
              {{ card.title }}
            </h3>
          </UCard>
        </UPageGrid>
      </UContainer>
    </section>

    <!-- Most Favorite Section -->
    <section class="relative">
      <UContainer class="mb-6 flex items-center justify-between">
        <!-- Header -->
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Most Favorite
        </h2>
        <!-- View all -->
        <NuxtLink
          to="/explore"
          class="text-sm text-primary hover:underline"
        >
          View All
        </NuxtLink>
      </UContainer>

      <UContainer class="mb-6">
        <!-- Anime Cards Grid -->
        <UPageGrid class="sm:grid-cols-4 lg:grid-cols-6">
          <UCard
            v-for="(card, index) in favorites"
            :key="index"
            v-bind="card"
            variant="neumorphic-inner"
            :ui="{ body: 'p-4!' }"
          >
            <NuxtImg
              :src="card.image"
              :alt="card.title"
              class="w-full h-auto rounded-lg"
              :sizes="`(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw`"
              priority
            />
            <h3 class="mt-2 text-base text-gray-800 dark:text-gray-200">
              {{ card.title }}
            </h3>
          </UCard>
        </UPageGrid>
      </UContainer>
    </section>
  </UMain>
</template>

<script lang="ts" setup>
import type { ResponseType } from '~/types/database'
import type { AnimeDetails } from '~/types/anime'

const { data: response, pending } = await useFetch<ResponseType>(
  `/api/custom/home`, 
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

const trending = computed(() => {
  const meta = response.value?.meta as Record<string, unknown> | undefined
  return (meta?.trending as { data: AnimeDetails[] })?.data
})

const popularity = computed(() => {
  const meta = response.value?.meta as Record<string, unknown> | undefined
  const raw = (meta?.popular as { data: AnimeDetails[] })?.data
  return raw.map(item => ({
    to: item.slug,
    title: item.title_romaji || item.title_english || item.title_native || 'Unknown Title',
    image: item.large_cover_image_url || item.medium_cover_image_url || ''
  }))
})

const favorites = computed(() => {
  const meta = response.value?.meta as Record<string, unknown> | undefined
  const raw = (meta?.favorites as { data: AnimeDetails[] })?.data
  return raw.map(item => ({
    to: item.slug,
    title: item.title_romaji || item.title_english || item.title_native || 'Unknown Title',
    image: item.large_cover_image_url || item.medium_cover_image_url || ''
  }))
})

function handleWatch(data: AnimeDetails) {
  // Navigate to anime detail page
  const anime = trending.value?.find(a => a.id === data.id)
  if (anime) {
    navigateTo(`/${anime.slug}`)
  }
}

function handleInfo(data: AnimeDetails) {
  // Navigate to anime detail page
  const anime = trending.value?.find(a => a.id === data.id)
  if (anime) {
    navigateTo(`/${anime.slug}`)
  }
}
</script>