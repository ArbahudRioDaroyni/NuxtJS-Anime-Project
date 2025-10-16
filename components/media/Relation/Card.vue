<template>
  <V1Grid tag="ul" template="columns" length="400px">
    <h2 class="col-span-full text-2xl font-bold">Relations</h2>
    <UCard
      v-for="(anime, index) in orderedRelations"
      :key="`relation-${index}`"
      :aria-label="`Related anime: ${anime?.name}, Relation type: ${anime?.relation_name}`"
      variant="neumorphic-outline"
      as="li"
      :ui="{ body: 'flex flex-row gap-4 h-full' }"
      class="group hover:cursor-pointer transition duration-300 ease-in-out hover:translate-0.5"
      @click="$router.push(anime?.slug || '#')"
    >
      <V1Image
        :src="anime?.image"
        :alt="anime?.name"
        :width="72"
        class="basis-1/6 rounded-md"
      />

      <div class="basis-5/6 flex flex-col justify-between gap-2">
        <NuxtLink
          :to="anime?.slug"
          class="min-h-10 font-semibold text-sm decoration-none line-clamp-2 text-ellipsis leading-5 max-h-10 transition duration-300 ease-in-out group-hover:text-primary"
        >
          {{ anime?.name }}
        </NuxtLink>
        <UBadge
          v-if="anime?.relation_type"
          :label="anime?.relation_name"
          :color="getGradientBadgeColor(anime?.relation_name)"
          variant="solid"
          size="md"
          class="w-min"
        />
        <div class="flex gap-2 items-center align-middle">
          <span 
            role="note"
            :aria-label="`Source: ${anime?.source_media_type_name}`"
            class="text-tiny uppercase font-medium opacity-80 tracking-wider"
          >
            {{ anime?.source_media_type_name }}
          </span>
          <span 
            role="status"
            :aria-label="`Status: ${anime?.status_type_name}`"
            class="text-tiny font-medium ml-2"
          >
            {{ anime?.status_type_name }}
          </span>
        </div>
      </div>
    </UCard>
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
      return 'gradient-megatron'
    case 'PREQUEL':
      return 'gradient-fresco'
    case 'SIDE_STORY':
      return 'gradient-tranquil'
    case 'SPIN_OFF':
      return 'gradient-maldives'
    case 'ALTERNATIVE':
      return 'gradient-martini'
    case 'SUMMARY':
      return 'gradient-oceanic'
    case 'CHARACTER':
      return 'gradient-blossom'
    case 'ADAPTATION':
      return 'gradient-disco'
    case 'PARENT':
      return 'gradient-sky'
    default:
      return 'gradient-cloudy'
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