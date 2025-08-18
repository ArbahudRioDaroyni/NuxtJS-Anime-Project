<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { AnimeDetails } from '~/types/anime'

interface Props {
  anime?: AnimeDetails | null
}

const props = defineProps<Props>()

// Define the tabs with their labels and components lazily loaded
const tabs = computed(() => [
  {
    label: 'Overview',
    component: defineAsyncComponent(() => import('~/components/feature/anime/DetailTabs/Overview.vue')),
    content: props.anime || {}
  },
  {
    label: 'Watch',
    component: defineAsyncComponent(() => import('~/components/feature/anime/DetailTabs/Watch.vue')),
    content: {
      episodes: props.anime?.episodes,
      trailer_url: props.anime?.trailer_url
    }
  },
  {
    label: 'Characters',
    component: defineAsyncComponent(() => import('~/components/feature/anime/Character/List.vue')),
    content: props.anime?.anime_characters_voice_actor_relations || []
  },
  {
    label: 'Staff',
    component: defineAsyncComponent(() => import('~/components/feature/anime/Staff/List.vue')),
    content: props.anime?.anime_staff_relations || []
  },
  {
    label: 'Stats',
    component: defineAsyncComponent(() => import('~/components/feature/anime/DetailTabs/Stats.vue')),
    content: {
      mean_score: props.anime?.mean_score,
      popularity: props.anime?.popularity,
      favorites: props.anime?.favorites,
      trending: props.anime?.trending
    }
  },
  {
    label: 'Social',
    component: defineAsyncComponent(() => import('~/components/feature/anime/DetailTabs/Social.vue')),
    content: {
      external_sites: props.anime?.anime_external_site_relations || []
    }
  },
])
</script>

<template>
  <!-- Sidebar -->
  <aside class="sidebar">
    <FeatureAnimeSidebar :anime="anime" />
  </aside>

  <!-- Content Area -->
  <main class="content">
    <CommonTabs :tabs="tabs" />
  </main>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  .main-layout {
    flex-direction: row;
    padding: 2rem;
  }
}

.sidebar {
  width: 100%;
  order: 2;
}

@media (min-width: 768px) {
  .sidebar {
    width: 300px;
    flex-shrink: 0;
    order: 1;
  }
}

.content {
  flex: 1;
  min-height: 600px;
  order: 1;
}

@media (min-width: 768px) {
  .content {
    order: 2;
  }
}

/* Responsive Design Improvements */
@media (max-width: 480px) {
  .main-layout {
    padding: 1rem 0.5rem;
    gap: 1rem;
  }
}
</style>