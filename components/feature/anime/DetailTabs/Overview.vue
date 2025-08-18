<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime'

interface Props {
  data?: AnimeDetails
}
const props = defineProps<Props>()

const trailerUrl = computed(() => {
  const url = props.data?.trailer_url
  const idYoutube = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([a-zA-Z0-9_-]{11})/)
  return url && idYoutube && idYoutube[1] ? `https://www.youtube.com/embed/${idYoutube[1]}` : null
})

const relations = computed(() => {
  return props.data?.anime_relation_relations_as_anime ?? []
})

const characters = computed(() => {
  return props.data?.anime_characters_voice_actor_relations ?? []
})

const staffs = computed(() => {
  return props.data?.anime_staff_relations ?? []
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="overview">
      <!-- Relations Section -->
      <section v-if="relations.length">
        <h2 class="overview-title">Relations</h2>
        <FeatureAnimeRelationList :data="data?.anime_relation_relations_as_anime" :count-show="12" />
      </section>

      <!-- Characters Section -->
      <section v-if="characters.length">
        <h2 class="overview-title">Character</h2>
        <FeatureAnimeCharacterList :data="data?.anime_characters_voice_actor_relations" :count-show="6" />
      </section>

      <!-- Staff Section -->
      <section v-if="staffs.length">
        <h2 class="overview-title">Staff</h2>
        <FeatureAnimeStaffList :data="data?.anime_staff_relations" :count-show="6" />
      </section>

      <!-- Trailer Section -->
      <section v-if="trailerUrl">
        <h2 class="overview-title">Trailer</h2>
        <BaseCardNeomorphism variant="inner">
          <iframe
            width="560"
            height="315"
            :src="trailerUrl"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </BaseCardNeomorphism>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.overview-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
