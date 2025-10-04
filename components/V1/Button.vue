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
  variant?: 'outer' | 'inner' | 'both'
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
  variant: 'outer',
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
  `base-button--${props.size}`,
  `base-button--${props.variant}`,
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
  line-height: 1;
  transition: background-color 0.2s, color 0.2s;

  &--outer {
    box-shadow: 8px 8px 12px hsl(var(--primary-color-code), 4%),
      -8px -8px 12px hsl(var(--primary-color-code), 16%);
      
    &:active {
      box-shadow: inset 4px 4px 4px hsl(var(--primary-color-code), 4%),
        inset -4px -4px 4px hsl(var(--primary-color-code), 16%);
    }
  }

  &--inner {
    box-shadow: -4px -4px 4px hsl(var(--primary-color-code), 16%) inset,
      4px 4px 4px hsl(var(--primary-color-code), 4%) inset;
  }

  &--both {
    box-shadow: 8px 8px 12px hsl(var(--primary-color-code), 4%),
      -8px -8px 12px hsl(var(--primary-color-code), 16%),
      -4px -4px 4px hsl(var(--primary-color-code), 16%) inset,
      4px 4px 4px hsl(var(--primary-color-code), 4%) inset;
  }

  // Size variants
  &--sm {
    padding: 0.5rem;
  }
  &--md {
    padding: 1rem;
  }
  &--lg {
    padding: 1.5rem;
  }
  &--xl {
    padding: 2rem;
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