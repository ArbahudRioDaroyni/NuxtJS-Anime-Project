<!-- Loading Spinner Component -->
<template>
  <div class="loading-spinner">
    <!-- From Uiverse.io by barisdogansutcu -->
    <svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.loading-spinner {
  display: inline-block;

  svg {
    width: 100%;
    height: 100%;
    transform-origin: center;
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: #3b82f6;
    stroke-width: 8;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}
</style>
