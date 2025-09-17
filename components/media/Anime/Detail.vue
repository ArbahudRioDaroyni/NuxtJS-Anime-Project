<template>
  <BaseImageResponsive
    :src="anime?.banner_image_url || '/image/test.jpg'"
    :alt="$route.params.slug"
    :height="200"
    :width="1200"
    class="banner-img"
  />

  <BaseContainer v-if="anime" class="main-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <FeatureAnimeSidebar :anime="anime" />
    </aside>

    <!-- Content Area -->
    <main class="content tabs-wrapper">
      <CommonTabs
        :tabs="animeTabs"
        variant="underline"
        size="md"
        :centered="true"
        @change="onTabChange"
      />
    </main>
  </BaseContainer>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { AnimeDetails } from '~/types/anime'
import type { Tab } from '~/types/components'

interface Props {
  anime?: AnimeDetails | null
}

const props = defineProps<Props>()

const animeTabs = computed(() => [
  {
    label: 'Overview',
    component: defineAsyncComponent(() =>
      import('~/components/media/Anime/DetailSections/Overview.vue')
    ),
    content: props.anime || {},
    icon: 'mdi:information-outline'
  },
  {
    label: 'Watch',
    component: defineAsyncComponent(() =>
      import('~/components/media/Anime/DetailSections/Watch.vue')
    ),
    content: {
      episodes: props.anime?.episodes,
      trailer_url: props.anime?.trailer_url
    }
  },
  {
    label: 'Characters',
    component: defineAsyncComponent(() =>
      import('~/components/media/Character/Card.vue')
    ),
    content: props.anime?.anime_characters_voice_actor_relations || [],
    icon: 'mdi:account-group-outline'
  },
  {
    label: 'Staff',
    component: defineAsyncComponent(() =>
      import('~/components/media/Staff/Card.vue')
    ),
    content: props.anime?.anime_staff_relations || []
  },
  {
    label: 'Stats',
    component: defineAsyncComponent(() =>
      import('~/components/media/Anime/DetailSections/Stats.vue')
    ),
    content: {
      mean_score: props.anime?.mean_score,
      popularity: props.anime?.popularity,
      favorites: props.anime?.favorites,
      trending: props.anime?.trending
    }
  },
  {
    label: 'Social',
    component: defineAsyncComponent(() => import('~/components/media/Anime/DetailSections/Social.vue')),
    content: {
      external_sites: props.anime?.anime_external_site_relations || []
    }
  },
])

const onTabChange = (_index: number, tab: Tab) => {
  console.log('Tab changed:', tab.label)
}
</script>

<style scoped lang="scss">
.banner-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  min-height: 175px;
}

.main-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  /* Mobile First Responsive Design */
  @media (max-width: 480px) {
    padding: 0.125rem;
    gap: 0.5rem;
  }
  @media (max-width: 767px) {
    padding: 0.25rem;
    gap: 0.75rem;
    margin: 0;
    width: 100vw;
    max-width: 100vw;
  }
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
    padding: 2rem;
  }
  @media (min-width: 1024px) {
    gap: 3rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  /* Add any dark mode styles if needed */
}

.sidebar {
  width: 100%;
  order: 2;
  margin-bottom: 1rem;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    width: 320px;
    max-width: 320px;
    flex-shrink: 0;
    order: 1;
    margin-bottom: 0;
  }
  @media (min-width: 1024px) {
    width: 350px;
    max-width: 350px;
  }
  @media (max-width: 767px) {
    margin-bottom: 0.5rem;
    padding: 0;
    
    &:deep(*) {
      max-width: 100% !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
    }
  }
}

.content {
  flex: 1;
  min-height: 400px;
  order: 1;
  width: 100%;
  overflow: hidden;
  max-width: 100%;

  @media (min-width: 768px) {
    order: 2;
    min-height: 600px;
  }
  
  @media (max-width: 767px) {
    min-height: 300px;
    padding: 0;
  }
  
  @media (max-width: 480px) {
    min-height: 250px;
    padding: 0;
  }
}

.tabs-wrapper {
  width: 100%;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 767px) {
    margin: 0;
    padding: 0;
  }
  
  /* Global mobile overflow fix */
  // @media (max-width: 767px) {
  //   &:deep(*) {
  //     max-width: 100% !important;
  //     overflow: hidden !important;
  //     box-sizing: border-box !important;
  //   }
    
  //   &:deep(.tab-content) {
  //     padding: 0.5rem !important;
  //     margin: 0 !important;
  //   }
  // }
}
</style>