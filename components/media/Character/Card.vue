<template>
  <section class="card-character-list">
    <div class="character-grid">
      <BaseCardGeneric
        v-for="(character, index) in convertedCharacters"
        :key="`character-${index}`"
        :items="character"
        :aria-label="`Anime character: ${character[0]?.name}, Role: ${character[0]?.subtitle}`"
        min-height="140px"
      />
    </div>
    <!-- <template v-for="(character, index) in orderedCharacters" :key="`character-detail-${index}`">
      <MediaCharacterDetail
        :character="character.character"
        :loading="!character.character"
      />
    </template> -->
  </section>
</template>

<script setup lang="ts">
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'

const props = defineProps<{
  data?: AnimeCharacterVoiceActorRelation[]
  countShow?: number
}>()

const getGradientBadgeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'MAIN':
      return 'megatron'
    case 'SUPPORTING':
      return 'arctic'
    default:
      return 'cloudy'
  }
}

const orderedCharacters = computed(() => {
  if (!props.data) return []
  
  return Object.values(props.data)
    .sort((a, b) => {
      // Priority order: Main -> Supporting -> Other roles
      const roleOrder = {
        'Main': 1,
        'Supporting': 2
      }

      const aRole = a.character_role?.name || 'Other'
      const bRole = b.character_role?.name || 'Other'
      const aOrder = roleOrder[aRole as keyof typeof roleOrder] || 3
      const bOrder = roleOrder[bRole as keyof typeof roleOrder] || 3
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      
      // If same role, sort by character name alphabetically
      const aName = a.character?.name || ''
      const bName = b.character?.name || ''
      return aName.localeCompare(bName)
    })
    .slice(0, props.countShow || Object.values(props.data).length)
})

const convertedCharacters = computed(() => {
  return orderedCharacters.value.map(relation => {
    const character = relation.character;
    const voiceActor = relation.voice_actor;
    // Return an array of CardItem objects as expected by BaseCardGeneric
    return [
      {
        id: character?.id,
        name: character?.name || 'Anonymous',
        image: character?.medium_image_url || '/image/image-230x345.webp',
        subtitle: relation.character_role?.name || 'Not specified',
        slug: character?.id
          ? `/character/${character.id}-${character?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
          : null,
        link: character?.id
          ? { to: `/character/${character.id}-${character?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` }
          : undefined,
        badge: {
          text: relation.character_role?.name || 'Not specified',
          variant: getGradientBadgeColor(relation.character_role?.name || '')
        }
      },
      {
        id: voiceActor?.id,
        name: voiceActor?.name || 'Anonymous',
        image: voiceActor?.medium_image_url || '/image/image-230x345.webp',
        subtitle: voiceActor?.home_town?.split(',').at(-1)?.trim() || 'Unknown',
        slug: voiceActor?.id
          ? `/staff/${voiceActor?.id}-${voiceActor?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
          : null,
        link: voiceActor?.id
          ? { to: `/staff/${voiceActor?.id}-${voiceActor?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` }
          : undefined
      }
    ];
  });
});
</script>

<style scoped lang="scss">
.card-character-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr));
  gap: 1rem;
}
</style>