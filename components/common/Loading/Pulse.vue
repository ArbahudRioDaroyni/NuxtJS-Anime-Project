<!-- Loading Pulse Component -->
<template>
  <div class="loading-pulse" />
</template>

<style lang="scss" scoped>
.loading-pulse {
  border-radius: 50%;
  background-color: #3b82f6;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
