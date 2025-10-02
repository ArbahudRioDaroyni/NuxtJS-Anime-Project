<script setup lang="ts">
import type { AnimeExternalSiteRelation } from '~/types/relations'

interface Props {
  externalSites?: AnimeExternalSiteRelation[] | null
}

withDefaults(defineProps<Props>(), {
  externalSites: () => []
})
</script>

<template>
  <V1Card v-if="externalSites && externalSites.length" variant="outer" layout="none">
    <V1Card 
      v-for="site in externalSites" 
      :key="site.external_site?.id" 
      variant="inner"
      layout="none"
      clickable
      :href="site.url"
    >
      <a 
        :href="site.url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="external-site-link"
      >
        <V1Image
          v-if="site.external_site?.icon"
          :src="site.external_site?.icon"
          :alt="site.external_site?.name || 'External Site Logo'"
          :width="18"
          :height="18"
        />
        <span v-if="site.external_site?.name">
          {{ site.external_site.name }}
        </span>
      </a>
    </V1Card>
  </V1Card>
</template>

<style scoped>
.external-site-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
</style>