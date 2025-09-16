<script setup lang="ts">
interface Props {
  id?: string
  isActive?: boolean
  lazy?: boolean
  keepAlive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  isActive: false,
  lazy: false,
  keepAlive: true
})

const hasBeenActive = ref(false)

watchEffect(() => {
  if (props.isActive) {
    hasBeenActive.value = true
  }
})

const shouldRender = computed(() => {
  if (!props.lazy) return true
  return hasBeenActive.value
})
</script>

<template>
  <div
    v-if="shouldRender"
    :id="id"
    class="tab-panel"
    :class="{
      'tab-panel--active': isActive,
      'tab-panel--hidden': !isActive
    }"
    role="tabpanel"
    :aria-hidden="!isActive"
    :tabindex="isActive ? 0 : -1"
  >
    <div class="tab-panel__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-panel {
  outline: none;
  
  &--hidden {
    display: none;
  }
  
  &--active {
    animation: fadeIn 0.2s ease-in-out;
  }
}

.tab-panel__content {
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Accessibility improvements
@media (prefers-reduced-motion: reduce) {
  .tab-panel--active {
    animation: none;
  }
  
  @keyframes fadeIn {
    from,
    to {
      transform: none;
    }
  }
}
</style>