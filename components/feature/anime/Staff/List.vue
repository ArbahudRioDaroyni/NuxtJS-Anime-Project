<script setup lang="ts">
import type { AnimeStaffRelation } from '~/types/relations'
import Staff from './Single.vue'

const props = defineProps<{
  data?: AnimeStaffRelation[]
  countShow?: number
}>()

const staffs = computed(() => {
  if (!props.data) return []
  
  return Object.values(props.data)
    .sort((a, b) => {
      // Priority order for staff roles: Director -> Producer -> Character Design -> etc.
      const roleOrder = { 
        'Director': 1, 
        'Producer': 2, 
        'Character Design': 3,
        'Original Creator': 4,
        'Animation Director': 5,
        'Director of Photography': 6,
        'Animation Producer': 7,
        'Art Design': 8,
        'Art Director': 9,
        'Color Design': 10,
      }
      
      const aRole = a.staff_role?.name || 'OTHER'
      const bRole = b.staff_role?.name || 'OTHER'
      const aOrder = roleOrder[aRole as keyof typeof roleOrder] || 99
      const bOrder = roleOrder[bRole as keyof typeof roleOrder] || 99
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      
      // If same role, sort by staff name alphabetically
      const aName = a.staff?.name || ''
      const bName = b.staff?.name || ''
      return aName.localeCompare(bName)
    })
    .slice(0, props.countShow || Object.values(props.data).length)
})
</script>

<template>
  <section class="card-staff-list">
    <div class="staff-grid">
      <Staff
        v-for="(staff, index) in staffs"
        :key="`staff-${index}`"
        :data="staff"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.card-staff-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>