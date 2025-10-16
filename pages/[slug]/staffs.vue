<template>
  <div>
    <MediaStaffCard :data="staffs" />
    
    <!-- Loading indicator -->
    <div v-if="pending" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
    
    <!-- Load more trigger -->
    <div ref="loadMoreTrigger" class="h-10" />
    
    <!-- End of list message -->
    <div v-if="!hasMore && staffs.length > 0" class="text-center py-4 text-muted">
      No more staffs to load
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-center py-4 text-error">
      {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResponseType } from '~/types/database'
import type { AnimeStaffRelation } from '~/types/relations'
import type { AnimeDetails } from '~/types/anime'

interface Props {
  data?: AnimeDetails
  idx?: AnimeDetails['id']
}

const props = defineProps<Props>()

// Fetch function for infinite scroll
const fetchStaffs = async (page: number, limit: number) => {
  const response = await $fetch<ResponseType>(`/api/anime/${props.idx}/staff`, {
    query: { page, limit }
  })
  
  return {
    success: response.success,
    data: response.data as AnimeStaffRelation[],
    meta: response.meta
  }
}

// Use infinite scroll composable
const { data: staffs, pending, hasMore, error, loadMoreTrigger } = useInfiniteScroll<AnimeStaffRelation>(
  fetchStaffs,
  {
    limit: 20,
    rootMargin: '100px'
  }
)
</script>