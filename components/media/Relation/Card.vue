<template>
  <section class="card-relation-list">
    <div class="relation-grid">
      <BaseCardGeneric
        v-for="(item, index) in convertedRelations"
        :key="`relation-${index}`"
        :items="[item]"
        :aria-label="`Anime relation: ${item.name}, Type: ${item.badge?.text}`"
        min-height="140px"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AnimeRelationRelation } from '~/types/relations'

const props = defineProps<{
  data?: AnimeRelationRelation[]
  countShow?: number
}>()

const getGradientBadgeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'SEQUEL':
      return 'megatron'
    case 'PREQUEL':
      return 'arctic'
    case 'SIDE_STORY':
      return 'tranquil'
    case 'SPIN_OFF':
      return 'maldives'
    case 'ALTERNATIVE':
      return 'martini'
    case 'SUMMARY':
      return 'oceanic'
    case 'CHARACTER':
      return 'blossom'
    case 'ADAPTATION':
      return 'margo'
    case 'PARENT':
      return 'sky'
    default:
      return 'cloudy'
  }
}

const orderedRelations = computed(() => {
  if (!props.data) return []
  
  return Object.values(props.data)
    .sort((a, b) => {
      const listOrder = {
        'SEQUEL': 1,
        'PREQUEL': 2,
        'SIDE_STORY': 3,
        'SPIN_OFF': 4,
        'ALTERNATIVE': 5,
        'SUMMARY': 6,
        'CHARACTER': 7,
        'ADAPTATION': 8,
        'PARENT': 9,
        'OTHER': 10
      }
      
      const aType = a.reference_type?.name || 'OTHER'
      const bType = b.reference_type?.name || 'OTHER'
      const aOrder = listOrder[aType as keyof typeof listOrder] || 99
      const bOrder = listOrder[bType as keyof typeof listOrder] || 99
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      
      // If same relation type, sort by year (newer first)
      const aYear = a.reference_anime?.year || '0'
      const bYear = b.reference_anime?.year || '0'
      return bYear.localeCompare(aYear)
    })
    .slice(0, props.countShow || Object.values(props.data).length)
})

// Convert to card items
const convertedRelations = computed(() => {
  return orderedRelations.value.map((relation) => {
    const anime = relation?.reference_anime
    
    return {
      id: anime?.slug || Math.random().toString(),
      name: anime?.title_english || anime?.title_romaji || anime?.title_native || 'Unknown Anime',
      image: anime?.medium_cover_image_url || anime?.thumbnail_image_url || '/image/image-230x345.webp',
      subtitle: '',
      slug: anime?.slug || '#',
      badge: {
        text: relation?.reference_type?.name || 'Unknown',
        variant: getGradientBadgeColor(relation?.reference_type?.name || 'Unknown')
      },
      link: anime?.slug
        ? { to: `${anime.slug}` }
        : undefined,
      additionalInfo: `
        <span 
          role="note"
          aria-label="Source: ${(anime as { source_media_type?: { name?: string } })?.source_media_type?.name || 'Unknown'}"
          style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; opacity: 0.8;"
        >
          ${(anime as { source_media_type?: { name?: string } })?.source_media_type?.name || 'Unknown'}
        </span>
        <span 
          role="status"
          aria-label="Status: ${(anime as { status_type?: { name?: string } })?.status_type?.name || 'Unknown'}"
          style="font-weight: 500; font-size: 0.75rem; border-radius: 0.25rem; margin-left: 0.5rem;"
        >
          ${(anime as { status_type?: { name?: string } })?.status_type?.name || 'Unknown'}
        </span>
      `
    }
  })
})
</script>

<style scoped lang="scss">
.card-relation-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.relation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 1rem;
}
</style>