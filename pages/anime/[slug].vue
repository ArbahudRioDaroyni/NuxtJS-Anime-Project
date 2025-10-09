<template>
  <UContainer as="main" class="mt-[5rem]">
    <UPage>
      <template #left>
        <MediaAnimeSidebar :anime="anime" />
      </template>
      <UPageHeader>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UPageHeader>

      <UPageBody>
        <NuxtPage :data="anime" />
      </UPageBody>
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
  to: `/anime/${slug.value}/`,
  exact: true
}, {
  label: 'Characters',
  icon: 'i-lucide-users',
  to: `/anime/${slug.value}/characters`
}, {
  label: 'Notifications',
  icon: 'i-lucide-bell',
  to: '/dashboard/settings/notifications'
}, {
  label: 'Security',
  icon: 'i-lucide-shield',
  to: '/dashboard/settings/security'
}], [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]

const { data: response, pending: _pending, error: _error } = await useFetch<ResponseType>(
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
</script>