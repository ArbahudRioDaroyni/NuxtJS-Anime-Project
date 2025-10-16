<script setup lang="ts">
interface Props {
  overallRank?: string
  popularityRank?: string
}

// Default values for props
withDefaults(defineProps<Props>(), {
  overallRank: '#82 highest rated all time',
  popularityRank: '#12 most popular summer 2025'
})
</script>

<template>
  <div class="rankings-container">
    <UCard variant="neumorphic-outline" class="ranking-card">
      ⭐ {{ overallRank }}
    </UCard>
    <UCard variant="neumorphic-outline" class="ranking-card">
      ❤️ {{ popularityRank }}
    </UCard>
  </div>
</template>

<style scoped>
.rankings-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>