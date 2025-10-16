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
  <UCard
    v-if="externalSites && externalSites.length"
    variant="neumorphic-outer"
    :ui="{ body: 'p-3! grid gap-y-4' }"
  >
    <UCard 
      v-for="site in externalSites" 
      :key="site.external_site?.id" 
      variant="neumorphic-inner"
      as="a"
      :href="site.url"
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      <div class="flex align-middle gap-2">
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
      </div>
    </UCard>
  </UCard>
</template>