<template>
  <UContainer as="main" class="mt-[5rem]">
    <UPage>
      <template #left>
        <MediaAnimeSidebar :anime="anime" />
      </template>

      <UNavigationMenu :items="links" highlight class="-mx-1 flex-1 py-7" />
      <KeepAlive>
        <NuxtPage :data="anime" />
      </KeepAlive>
    </UPage>
  </UContainer>
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
  label: 'Characters',
  icon: 'i-lucide-users',
  to: `/${slug.value}/characters`
}, {
  label: 'Staffs',
  icon: 'i-lucide-briefcase',
  to: `/${slug.value}/staffs`
}, {
  label: 'Social',
  icon: 'i-lucide-message-square',
  to: `/${slug.value}/social`
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

// if (import.meta.dev) {
//   useHead({ 
//     script: [
//       { innerHTML: `console.log(${JSON.stringify(anime.value, null, 2)})` },
//       { innerHTML: `console.log(${JSON.stringify(seoMeta.value, null, 2)})` }
//     ]
//   })
// }
</script>