<!-- Loading Skeleton Component -->
<template>
  <div class="loading-skeleton">
    <div class="skeleton-line" />
    <div class="skeleton-line" />
    <div class="skeleton-line short" />
  </div>
</template>

<style lang="scss" scoped>
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 0.25rem;
  
  &.short {
    width: 60%;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
