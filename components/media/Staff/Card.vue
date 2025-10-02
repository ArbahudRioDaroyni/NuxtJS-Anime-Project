<template>
  <V1Grid tag="ul" gap="1rem">
    <V1Card
      v-for="(staff, index) in orderedStaffs"
      :key="`staff-${index}`"
      :title="staff?.name"
      variant="both"
      clickable
      :href="staff?.slug || '#'"
      tag="li"
      @click="trackClick"
    >
      <V1Image
        :src="staff?.image"
        :alt="staff?.name"
        :width="72"
        :height="88"
      />
      <div>
        <NuxtLink :to="staff?.slug || '#'">
          {{ staff?.name }}
        </NuxtLink>
        <span class="card-subtitle">
          {{ staff?.role }}
        </span>
      </div>
    </V1Card>
  </V1Grid>
</template>

<script setup lang="ts">
import type { AnimeStaffRelation } from '~/types/relations'

const props = defineProps<{
  data?: AnimeStaffRelation[]
  countShow?: number
}>()

const trackClick = () => {
  // console.log('Card interaction tracked')
}

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
    .map(relation => {
      const staff = relation.staff;
      return {
        id: staff?.id || null,
        name: staff?.name || 'Anonymous',
        image: staff?.medium_image_url || '/image/image-230x345.webp',
        role: relation.staff_role?.name || 'Not specified',
        slug: `/staff/${staff?.id}-${staff?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
      }
  })
})
</script>