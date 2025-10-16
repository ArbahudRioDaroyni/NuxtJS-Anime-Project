<template>
  <div>
    <MediaCharacterCard :data="characters" />
    
    <!-- Loading indicator -->
    <div v-if="pending" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
    
    <!-- Load more trigger -->
    <div ref="loadMoreTrigger" class="h-10" />
    
    <!-- End of list message -->
    <div v-if="!hasMore && characters.length > 0" class="text-center py-4 text-muted">
      No more characters to load
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-center py-4 text-error">
      {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResponseType } from '~/types/database'
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'
import type { AnimeDetails } from '~/types/anime'

interface Props {
  data?: AnimeDetails
  idx?: AnimeDetails['id']
}

const props = defineProps<Props>()

// Fetch function for infinite scroll
const fetchCharacters = async (page: number, limit: number) => {
  const response = await $fetch<ResponseType>(`/api/anime/${props.idx}/characters`, {
    query: { page, limit }
  })
  
  return {
    success: response.success,
    data: response.data as AnimeCharacterVoiceActorRelation[],
    meta: response.meta
  }
}

// Use infinite scroll composable
const { data: characters, pending, hasMore, error, loadMoreTrigger } = useInfiniteScroll<AnimeCharacterVoiceActorRelation>(
  fetchCharacters,
  {
    limit: 20,
    rootMargin: '100px'
  }
)
</script>