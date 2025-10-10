<template>
  <MediaCharacterCard :data="characters" />
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'

interface Props {
  data?: AnimeDetails
}

const props = defineProps<Props>()

const characters = computed(() => {
  return props.data?.anime_characters_voice_actor_relations as AnimeCharacterVoiceActorRelation[] || []
})
</script>