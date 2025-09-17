<template>
  <section class="card-staff-list">
    <div class="staff-grid">
      <BaseCardGeneric
        v-for="(staff, index) in convertedStaffs"
        :key="`staff-${index}`"
        :items="[staff]"
        :aria-label="`Staff: ${staff.name}, Role: ${staff.id}`"
        min-height="140px"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AnimeStaffRelation } from '~/types/relations'

const props = defineProps<{
  data?: AnimeStaffRelation[]
  countShow?: number
}>()

const orderedStaffs = computed(() => {
  if (!props.data) return []
  
  return Object.values(props.data)
    .sort((a, b) => {
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

const convertedStaffs = computed(() => {
  return orderedStaffs.value.map(relation => {
    const staff = relation.staff;
    return {
      id: staff?.id,
      name: staff?.name || 'Anonymous',
      image: staff?.medium_image_url || '/image/image-230x345.webp',
      subtitle: relation.staff_role?.name || 'Not specified',
      slug: `/staff/${staff?.id}-${staff?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
      link: staff?.id
        ? { to: `/staff/${staff.id}-${staff?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` }
        : undefined,
    }
  })
})
</script>

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