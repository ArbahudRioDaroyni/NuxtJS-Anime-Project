<script setup lang="ts">
interface Props {
  overallRank?: string
  popularityRank?: string
}

// Default values for props
withDefaults(defineProps<Props>(), {
  overallRank: '#82 highest rated all time',
  popularityRank: '#22 most popular summer 2025'
})
</script>

<template>
  <div class="rankings-container">
    <UBadge color="gradient-tranquil" size="lg" variant="subtle">
      ⭐ {{ overallRank }}
    </UBadge>
    <UBadge color="gradient-disco" size="lg" variant="subtle">
      ❤️ {{ popularityRank }}
    </UBadge>
  </div>
</template>

<style scoped>
.rankings-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>