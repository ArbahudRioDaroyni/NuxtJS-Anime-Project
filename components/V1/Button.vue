<!-- Base Button Component -->
<template>
  <component 
    :is="tag"
    :type="htmlType"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <CommonLoadingSpinner v-if="loading" />
    <Icon v-else-if="icon" :name="icon" :size="iconSize" />
    
    <template v-if="$slots.default">
      <slot />
    </template>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: string
  color?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  htmlType?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  iconSize?: number | string
  block?: boolean
  hover?: 'outer' | 'inner' | 'both' | 'flat'
}
const props = withDefaults(defineProps<Props>(), {
  tag: 'button',
  color: 'primary',
  size: 'md',
  htmlType: 'button',
  disabled: false,
  loading: false,
  icon: undefined,
  iconPosition: 'left',
  iconSize: 16,
  block: false,
  hover: 'inner'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.color}`,
  `base-button--${props.size}`,
  {
    'base-button--block': props.block,
    [`base-button--icon-${props.iconPosition}`]: props.icon,
    [`base-button--hover-${props.hover}`]: props.hover,
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &--primary {
    background-color: hsl(from var(--primary-color) h s 30%);
    color: white;

    &:hover {
      background-color: hsl(from var(--primary-color) h s 40%);
    }
  }

  &--secondary {
    background-color: #f3f4f6;
    color: #111827;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  &--outline {
    border: 1px solid #d1d5db;
    color: #111827;

    &:hover {
      border-color: #9ca3af;
    }
  }

  &--ghost {
    background-color: transparent;
    color: #111827;

    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  }

  &--danger {
    background-color: #ef4444;
    color: white;

    &:hover {
      background-color: #dc2626;
    }
  }

  &--block {
    width: 100%;
  }

  &--loading {
    pointer-events: none;
  }

  &--icon-left {
    flex-direction: row-reverse; // Adjust for icon on the left
  }

  &--icon-right {
    flex-direction: row; // Default for icon on the right
  }
}
</style>