<template>
  <V1Grid tag="ul" template="columns" length="400px">
    <h2 class="col-span-full text-2xl font-bold">Staffs</h2>
    <UCard
      v-for="(staff, index) in orderedStaffs"
      :key="`staff-${index}`"
      :aria-label="`Anime staff: ${staff?.name}, Role: ${staff?.role}`"
      variant="neumorphic-outline"
      as="li"
      :ui="{ body: 'flex flex-row gap-4 h-full' }"
      class="group hover:cursor-pointer transition duration-300 ease-in-out hover:translate-0.5"
      @click="$router.push(staff?.slug || '#')"
    >
      <V1Image
        :src="staff?.image"
        :alt="staff?.name"
        :width="72"
        :height="88"
        class="basis-1/6 overflow-hidden rounded-md"
      />
      <div class="basis-5/6 flex flex-col justify-between">
        <NuxtLink :to="staff?.slug || '#'" class="transition duration-300 ease-in-out group-hover:text-primary">
          {{ staff?.name }}
        </NuxtLink>
        <span class="text-sm opacity-80">
          {{ staff?.role }}
        </span>
      </div>
    </UCard>
  </V1Grid>
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