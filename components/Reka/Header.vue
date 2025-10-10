<template>
  <UHeader
    :class="[
      'fixed top-0 left-0 right-0 transition-all duration-300 z-50',
      isHidden ? 'translate-y-[-100%]' : '',
      isTransparent ? 'bg-transparent backdrop-blur-sm' : 'backdrop-blur-md shadow-lg bg-white/90 dark:bg-gray-900/90'
    ]"
  >
    <template #title>
      <RekaHeaderLogo 
        :is-transparent="isTransparent"
        :is-hidden="isHidden"
        class="h-6 w-auto" 
      />
    </template>

    <UNavigationMenu
      :items="items"
      class="border-none"
    />

    <template #right>
      <UColorModeButton />

      <UButton
        color="neutral"
        variant="ghost"
        to="https://github.com/nuxt/ui"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
      />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Anime',
      children: [
        {
          label: 'Anime Search',
          icon: 'i-lucide-text-search',
          description: 'Search for anime in the database.',
          to: '/'
        },
        {
          label: 'Trending Anime',
          icon: 'i-lucide-trending-up',
          description: 'Find the most trending anime.',
          to: '/'
        },
        {
          label: 'Popular Anime',
          icon: 'i-lucide-trending-up',
          description: 'Find the most popular anime.',
          to: '/'
        },
        {
          label: 'Favorites Anime',
          icon: 'i-lucide-heart',
          description: 'Find your favorite anime.',
          to: '/'
        },
        {
          label: 'Videos',
          icon: 'i-lucide-list-video',
          description: 'Find anime-related videos.',
          to: '/'
        },
        {
          label: 'Recommendations',
          icon: 'i-lucide-thumbs-up',
          description: 'Find anime based on your preferences.',
          to: '/'
        },
      ]
    },
    {
      label: 'Manga',
      to: '/',
      active: true,
      defaultOpen: true,
      children: [
        {
          label: 'Manga Search',
          icon: 'i-lucide-text-search',
          description: 'Search for manga in the database.',
          to: '/'
        },
        {
          label: 'Top Manga',
          icon: 'i-lucide-trending-up',
          description: 'Display a modal within your application.',
          to: '/'
        },
        {
          label: 'Adapted to Anime',
          icon: 'i-lucide-file-text',
          description: 'Display a list of links.',
          to: '/docs/components/navigation-menu'
        },
        {
          label: 'Recommendations',
          icon: 'i-lucide-thumbs-up',
          description: 'Display a list of pages.',
          to: '/docs/components/pagination'
        },
      ]
    },
    {
      label: 'Browse',
      to: '/',
      children: [
        {
          label: 'Staff',
          icon: 'i-lucide-circle-user',
          description: 'Search for staff in the database.',
          to: '/'
        },
        {
          label: 'Character',
          icon: 'i-lucide-users',
          description: 'Find characters in the database.',
          to: '/character/'
        },
        {
          label: 'Voice Actor',
          icon: 'i-lucide-mic',
          description: 'Find voice actors in the database.',
          to: '/'
        },
        {
          label: 'Studio',
          icon: 'i-lucide-house',
          description: 'Find studios in the database.',
          to: '/'
        },
      ]
    },
    {
      label: 'News',
      icon: 'i-lucide-newspaper',
      to: '/'
    },
    {
      label: 'Blog',
      icon: 'i-lucide-book-open-text',
      to: '/'
    },
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      badge: '3.8k',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    },
    {
      label: 'Help',
      icon: 'i-lucide-circle-help',
      badge: { label: 'New', color: 'error', variant: 'solid', size: 'xs' },
      disabled: true
    }
  ]
])


const lastScrollTop = ref(0);
const isHidden = ref(false);
const isTransparent = ref(true);

function headerNavigationOnScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    isTransparent.value = currentScroll === 0;
    isHidden.value = currentScroll > lastScrollTop.value && currentScroll > 0;

    lastScrollTop.value = Math.max(currentScroll, 0);
}

onMounted(() => {
    window.addEventListener('scroll', useThrottle(headerNavigationOnScroll, 300), { passive: true });
});
</script>
