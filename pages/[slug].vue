<template>
  <UMain>
    <UPageHero v-if="anime?.banner_image_url" as="figure">
      <NuxtImg
        :src="anime.banner_image_url"
        alt="Banner Image"
        class="absolute inset-0 h-full w-full object-cover"
        :sizes="`(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px`"
        :lazy="true"
        :priority="true"
        :quality="80"
      />
    </UPageHero>
    <UContainer as="section" :class="[anime?.banner_image_url ? 'mt-8 mb-[7rem]' : 'my-[7rem]']">
      <UPage :ui="{ root: 'lg:grid-cols-12', left: 'lg:col-span-3', center: 'lg:col-span-9' }">
        <template #left>
          <MediaAnimeSidebar :anime="anime" />
        </template>

        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1 py-7 pt-0" />
        <NuxtPage :data="anime" :idx="anime?.id" />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import type { ResponseType } from '~/types/database'
import type { AnimeDetails } from '~/types/anime'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const links = [[{
  label: 'Overview',
  icon: 'i-lucide-user',
  to: `/${slug.value}/`,
  exact: true
}, {
  label: 'Watch',
  icon: 'i-lucide-play-circle',
  to: `/${slug.value}/watch`
}, {
//   label: 'Social',
//   icon: 'i-lucide-message-square',
//   to: `/${slug.value}/social`
// }, {
  label: 'Staffs',
  icon: 'i-lucide-briefcase',
  to: `/${slug.value}/staffs`
}, {
  label: 'Characters',
  icon: 'i-lucide-users',
  to: `/${slug.value}/characters`
}]] satisfies NavigationMenuItem[][]

const { data: response, pending, error } = await useFetch<ResponseType>(
  `/api/anime/${slug.value}?search-by=slug`,
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
</script>