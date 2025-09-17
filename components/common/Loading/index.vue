<!-- Loading Component -->
<template>
  <div :class="containerClasses">
    <component :is="loadingComponent" :class="componentClasses" />
    <p v-if="message" :class="messageClasses">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './Spinner.vue'
import LoadingDots from './Dots.vue'
import LoadingPulse from './Pulse.vue'
import LoadingSkeleton from './Skeleton.vue'

interface Props {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  overlay?: boolean
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'spinner',
  size: 'md',
  message: undefined,
  overlay: false,
  center: true
})

const loadingComponent = computed(() => {
  switch (props.type) {
    case 'dots': return LoadingDots
    case 'pulse': return LoadingPulse
    case 'skeleton': return LoadingSkeleton
    default: return LoadingSpinner
  }
})

const containerClasses = computed(() => [
  'loading-container',
  {
    'loading-container--overlay': props.overlay,
    'loading-container--center': props.center
  }
])

const componentClasses = computed(() => [
  'loading-spinner',
  `loading-spinner--${props.size}`
])

const messageClasses = computed(() => [
  'loading-message',
  `loading-message--${props.size}`
])
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  
  &--overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    backdrop-filter: blur(20px);
  }
  
  &--center {
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
}

.loading-spinner {
  &--sm { width: 16px; height: 16px; }
  &--md { width: 24px; height: 24px; }
  &--lg { width: 32px; height: 32px; }
  &--xl { width: 48px; height: 48px; }
}

.loading-message {
  color: #6b7280;
  text-align: center;
  
  &--sm { font-size: 0.75rem; }
  &--md { font-size: 0.875rem; }
  &--lg { font-size: 1rem; }
  &--xl { font-size: 1.125rem; }
}
</style>
