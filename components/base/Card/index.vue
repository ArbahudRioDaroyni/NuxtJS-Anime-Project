<template>
  <component 
    :is="tag" 
    :class="cardClasses"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  variant: 'default',
  size: 'md',
  padding: 'md',
  rounded: 'md',
  shadow: 'sm',
  interactive: false
})

const cardClasses = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  `base-card--size-${props.size}`,
  `base-card--padding-${props.padding}`,
  `base-card--rounded-${props.rounded}`,
  `base-card--shadow-${props.shadow}`,
  {
    'base-card--interactive': props.interactive
  }
])
</script>

<style lang="scss" scoped>
.base-card {
  position: relative;
  overflow: hidden;
  
  // Variants
  &--default {
    background-color: white;
    border: 1px solid #e5e7eb;
    
    @media (prefers-color-scheme: dark) {
      background-color: #1f2937;
      border-color: #374151;
    }
  }
  
  &--elevated {
    background-color: white;
    
    @media (prefers-color-scheme: dark) {
      background-color: #1f2937;
    }
  }
  
  &--outlined {
    background-color: transparent;
    border: 2px solid #d1d5db;
    
    @media (prefers-color-scheme: dark) {
      border-color: #4b5563;
    }
  }
  
  &--filled {
    background-color: #f3f4f6;
    border: none;
    
    @media (prefers-color-scheme: dark) {
      background-color: #374151;
    }
  }
  
  // Sizes
  &--size-sm { font-size: 0.875rem; }
  &--size-md { font-size: 1rem; }
  &--size-lg { font-size: 1.125rem; }
  
  // Padding
  &--padding-none { padding: 0; }
  &--padding-sm { padding: 0.75rem; }
  &--padding-md { padding: 1rem; }
  &--padding-lg { padding: 1.5rem; }
  
  // Rounded
  &--rounded-none { border-radius: 0; }
  &--rounded-sm { border-radius: 0.125rem; }
  &--rounded-md { border-radius: 0.375rem; }
  &--rounded-lg { border-radius: 0.5rem; }
  &--rounded-full { border-radius: 9999px; }
  
  // Shadow
  &--shadow-none { box-shadow: none; }
  &--shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
  &--shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
  &--shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
  &--shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
  
  // Interactive
  &--interactive {
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-0.25rem);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}
</style>
