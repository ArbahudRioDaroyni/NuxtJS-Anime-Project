<template>
  <div>
    <UPageGrid as="ul" class="grid-cols-[repeat(auto-fill,minmax(400px,1fr))]! gap-6">
      <!-- card -->
      <li
        v-for="relation in relations" :key="relation.id"
        :class="[
          'flex items-center flex-row gap-4',
          'p-4',
          'rounded-lg',
          'border border-gray-700',
          'hover:bg-gray-800 light:hover:bg-gray-100',
          'shadow hover:shadow-lg transition-shadow duration-300',
          relation.reference_anime?.is_adult ? 'opacity-50' : ''
        ]"
      >
        <NuxtImg
          :src="relation.reference_anime?.extra_large_cover_image_url || relation.reference_anime?.medium_cover_image_url || '/image/test.jpg'"
          alt="Cover Image"
          width="150"
          height="200"
          class="rounded-lg object-cover h-[100px] w-auto"
        />
        <h2 class="mt-4 text-lg font-semibold text-center">
          {{ relation.reference_anime?.title_romaji || relation.reference_anime?.title_english || relation.reference_anime?.title_native || 'Unknown Title' }}
        </h2>
      </li>
    </UPageGrid>
  </div>
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'
import type { AnimeRelationRelation } from '~/types/relations'

interface Props {
  data?: AnimeDetails
}

const props = defineProps<Props>()

const relations = computed(() => {
  return props.data?.anime_relation_relations_as_anime as AnimeRelationRelation[] || []
})

// if (import.meta.dev) {
//   useHead({ 
//     script: [
//       { innerHTML: `console.log(${JSON.stringify(props.data, null, 2)})` },
//     ]
//   })
// }
</script>