<template>
  <MediaStaffCard :data="staffs" />
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'
import type { AnimeStaffRelation } from '~/types/relations'

interface Props {
  data?: AnimeDetails
}

const props = defineProps<Props>()

const staffs = computed(() => {
  return props.data?.anime_staff_relations as AnimeStaffRelation[] || []
})
</script>