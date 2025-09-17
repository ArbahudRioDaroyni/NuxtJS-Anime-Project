<!-- Loading Dots Component -->
<template>
  <div class="loading-dots">
    <div class="dot" />
    <div class="dot" />
    <div class="dot" />
  </div>
</template>

<style lang="scss" scoped>
.loading-dots {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
  
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
  &:nth-child(3) { animation-delay: 0s; }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
