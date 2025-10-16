<template>
  <div class="space-y-6">
    <MediaRelationCard :data="relations" />
    <MediaCharacterCard :data="characters" />
    <MediaStaffCard :data="staffs" />
    <section v-if="trailerUrl">
      <h2 class="overview-title">Trailer</h2>
      <UCard variant="neumorphic-inner">
      <iframe
          class="w-full aspect-video rounded-md"
          :src="trailerUrl"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'
import type { AnimeRelationRelation, AnimeCharacterVoiceActorRelation, AnimeStaffRelation } from '~/types/relations'

interface Props {
  data?: AnimeDetails
}

const props = defineProps<Props>()

const relations = computed(() => {
  return props.data?.anime_relation_relations_as_anime as AnimeRelationRelation[] || []
})

const characters = computed(() => {
  return props.data?.anime_characters_voice_actor_relations as AnimeCharacterVoiceActorRelation[] || []
})

const staffs = computed(() => {
  return props.data?.anime_staff_relations as AnimeStaffRelation[] || []
})

const trailerUrl = computed(() => {
  const url = props.data?.trailer_url
  const idYoutube = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([a-zA-Z0-9_-]{11})/)
  return url && idYoutube && idYoutube[1] ? `https://www.youtube.com/embed/${idYoutube[1]}` : null
})
</script>