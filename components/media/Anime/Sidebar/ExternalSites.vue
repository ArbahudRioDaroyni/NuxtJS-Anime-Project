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
  <BaseCardNeomorphism v-if="externalSites && externalSites.length" variant="outer">
    <BaseCardNeomorphism 
      v-for="site in externalSites" 
      :key="site.external_site?.id" 
      variant="inner"
    >
      <a 
        :href="site.url" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="external-site-link"
      >
        <BaseImageClickable
          v-if="site.external_site?.icon"
          :src="site.external_site?.icon"
          :alt="site.external_site?.name || 'External Site Logo'"
          :min-width="'18px'"
          :width="18"
          :enable-preview="false"
        />
        <span v-if="site.external_site?.name">
          {{ site.external_site.name }}
        </span>
      </a>
    </BaseCardNeomorphism>
  </BaseCardNeomorphism>
</template>

<style scoped>
.external-site-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
</style>