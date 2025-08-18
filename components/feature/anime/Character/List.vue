<script setup lang="ts">
import type { AnimeCharacterVoiceActorRelation } from '~/types/relations'
import Character from './Single.vue'

const props = defineProps<{
  data?: AnimeCharacterVoiceActorRelation[]
  countShow?: number
}>()

const characters = computed(() => {
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
</script>

<template>
  <section class="card-character-list">
    <div class="character-grid">
      <Character
        v-for="(character, index) in characters"
        :key="`character-${index}`"
        :data="character"
      />
    </div>
  </section>
</template>

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