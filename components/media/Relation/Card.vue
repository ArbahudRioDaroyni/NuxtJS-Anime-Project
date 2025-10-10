<template>
  <V1Grid tag="ul" template="columns" length="400px">
    <h2 class="col-span-full text-[1.5rem] font-bold">Relations</h2>
    <V1Card
      v-for="(anime, index) in orderedRelations"
      :key="`relation-${index}`"
      :title="anime?.name"
      :aria-label="`Related anime: ${anime?.name}, Relation type: ${anime?.relation_name}`"
      variant="both"
      clickable
      :href="anime?.slug"
      tag="li"
      @click="trackClick"
    >
      <V1Image
        :src="anime?.image"
        :alt="anime?.name"
        :width="72"
      />

      <div>
        <NuxtLink :to="anime?.slug">
          {{ anime?.name }}
        </NuxtLink>
        <V1Badge
          v-if="anime?.relation_type"
          :variant="getGradientBadgeColor(anime?.relation_name)"
          :text="anime?.relation_name"
        />
        <div>
          <span 
            role="note"
            :aria-label="`Source: ${anime?.source_media_type_name}`"
            style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; opacity: 0.8;"
          >
            {{ anime?.source_media_type_name }}
          </span>
          <span 
            role="status"
            :aria-label="`Status: ${anime?.status_type_name}`"
            style="font-weight: 500; font-size: 0.75rem; border-radius: 0.25rem; margin-left: 0.5rem;"
          >
            {{ anime?.status_type_name }}
          </span>
        </div>
      </div>
    </V1Card>
  </V1Grid>
</template>

<script setup lang="ts">
import type { AnimeRelationRelation } from '~/types/relations'
import type { AnimeDetails } from '~/types/anime'

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

const trackClick = () => {
  // console.log('Card interaction tracked')
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
    .map((relation) => {
      const anime = relation?.reference_anime
      
      return {
        id: anime?.slug || Math.random().toString(),
        name: anime?.title_english || anime?.title_romaji || anime?.title_native || 'Unknown Anime',
        image: anime?.medium_cover_image_url || anime?.thumbnail_image_url || '/image/image-230x345.webp',
        slug: `/${anime?.slug || '#'}`,
        relation_type: relation?.reference_type,
        relation_name: relation?.reference_type?.name || 'Unknown',
        status_type_name: (anime as AnimeDetails)?.status_type?.name || 'Unknown',
        source_media_type_name: (anime as AnimeDetails)?.source_media_type?.name || 'Unknown',
      }
    })
})
</script>