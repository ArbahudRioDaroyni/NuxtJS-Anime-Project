<script setup lang="ts">
import type { AnimeRelationRelation } from '~/types/relations'
import Relation from './Single.vue'

const props = defineProps<{
  data?: AnimeRelationRelation[]
  countShow?: number
}>()

const relations = computed(() => {
  if (!props.data) return []
  
  return Object.values(props.data)
    .sort((a, b) => {
      // Priority order for relation types: Sequel -> Prequel -> Side Story -> etc.
      const relationOrder = {
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
      const aOrder = relationOrder[aType as keyof typeof relationOrder] || 99
      const bOrder = relationOrder[bType as keyof typeof relationOrder] || 99
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      
      // If same relation type, sort by year (newer first)
      const aYear = a.reference_anime?.year || '0'
      const bYear = b.reference_anime?.year || '0'
      return bYear.localeCompare(aYear)
    })
    .slice(0, props.countShow || Object.values(props.data).length)
})
</script>

<template>
  <section class="card-relation-list">
    <div class="relation-grid">
      <Relation
        v-for="(relation, index) in relations"
        :key="`relation-${index}`"
        :data="relation"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.card-relation-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.relation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 1rem;
}
</style>