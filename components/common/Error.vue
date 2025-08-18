<!-- Error Component -->
<template>
  <div :class="containerClasses">
    <div class="error-icon">
      <Icon :name="iconName" :size="iconSize" />
    </div>
    
    <div class="error-content">
      <h3 v-if="title" class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      <p v-if="description" class="error-description">{{ description }}</p>
    </div>
    
    <div v-if="showRetry || $slots.actions" class="error-actions">
      <slot name="actions">
        <BaseButton
          v-if="showRetry"
          variant="primary"
          size="md"
          @click="handleRetry"
        >
          {{ retryText }}
        </BaseButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'error' | 'warning' | 'info' | 'network' | '404' | '500'
  title?: string
  message?: string
  description?: string
  showRetry?: boolean
  retryText?: string
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  title: undefined,
  message: 'Something went wrong',
  description: undefined,
  showRetry: false,
  retryText: 'Try Again',
  center: true
})

const emit = defineEmits<{
  retry: []
}>()

const iconName = computed(() => {
  switch (props.type) {
    case 'warning': return 'alert-triangle'
    case 'info': return 'info'
    case 'network': return 'wifi-off'
    case '404': return 'github'
    case '500': return 'server-x'
    default: return 'alert-circle'
  }
})

const iconSize = computed(() => {
  switch (props.type) {
    case '404':
    case '500': return 64
    default: return 48
  }
})

const containerClasses = computed(() => [
  'error-container',
  `error-container--${props.type}`,
  {
    'error-container--center': props.center
  }
])

const handleRetry = () => {
  emit('retry')
}
</script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  
  &--center {
    justify-content: center;
    min-height: 300px;
  }
  
  &--error .error-icon { color: #ef4444; }
  &--warning .error-icon { color: #f59e0b; }
  &--info .error-icon { color: #3b82f6; }
  &--network .error-icon { color: #6b7280; }
  &--404 .error-icon { color: #6b7280; }
  &--500 .error-icon { color: #ef4444; }
}

.error-icon {
  flex-shrink: 0;
}

.error-content {
  max-width: 400px;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.error-actions {
  margin-top: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  .error-title {
    color: #f9fafb;
  }
  
  .error-message {
    color: #d1d5db;
  }
  
  .error-description {
    color: #9ca3af;
  }
}
</style>
