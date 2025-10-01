<template>
  <component :is="tag" :class="badgeClasses" :style="badgeStyles" v-bind="$attrs">
    <template v-if="$slots.default">
      <slot />
    </template>
    <span v-else>{{ text }}</span>
  </component>
</template>

<script setup lang="ts">
export interface Badge {
  tag?: keyof HTMLElementTagNameMap
  text?: string
  variant?: 'megatron' | 'tranquil' | 'oceanic' | 'maldives' | 'martini' | 'arctic' | 'cloudy' | 'sky' | 'margo' | 'limeade' | 'apple' | 'delicate' | 'blossom' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  color?: string
  backgroundColor?: string
  customClass?: string
}

const props = withDefaults(defineProps<Badge>(), {
  text: 'default badge',
  variant: 'cloudy',
  size: 'sm',
  rounded: 'sm',
  tag: 'span',
  color: undefined,
  backgroundColor: undefined,
  customClass: undefined
})

// Generate badge classes
const badgeClasses = computed(() => [
  'badge',
  `badge--${props.variant}`,
  `badge--size-${props.size}`,
  `badge--rounded-${props.rounded}`,
  props.customClass
])

// Dynamic styles for custom colors
const badgeStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.color) {
    styles.color = `rgb(from ${props.color} r g b / 0%)`
  }

  if (props.backgroundColor) {
    styles.backgroundColor = `rgb(from ${props.backgroundColor} r g b / 0%)`
  }

  return styles
})
</script>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: capitalize;
  white-space: nowrap;
  transition: all 0.2s ease;

  // Size variants
  &--size {
    &-xs {
      font-size: 0.625rem;
      padding: 0.0625rem 0.375rem;
      min-height: 1rem;
    }

    &-sm {
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      min-height: 1.25rem;
    }

    &-md {
      font-size: 0.875rem;
      padding: 0.25rem 0.75rem;
      min-height: 1.5rem;
    }

    &-lg {
      font-size: 1rem;
      padding: 0.375rem 1rem;
      min-height: 2rem;
    }
  }

  // Rounded variants
  &--rounded {
    &-none {
      border-radius: 0;
    }
    &-sm {
      border-radius: 0.25rem;
    }
  
    &-md {
      border-radius: 0.375rem;
    }
  
    &-lg {
      border-radius: 0.5rem;
    }
  
    &-full {
      border-radius: 50%;
    }
  }


  // Gradient variants
  &--megatron {
    color: var(--color-black, #000000);
    background: var(--gradient-megatron);
  }

  &--tranquil {
    color: var(--color-black, #000000);
    background: var(--gradient-tranquil);
  }

  &--oceanic {
    color: var(--color-black, #000000);
    background: var(--gradient-oceanic);
  }

  &--maldives {
    color: var(--color-black, #000000);
    background: var(--gradient-maldives);
  }

  &--martini {
    color: var(--color-black, #000000);
    background: var(--gradient-martini);
  }

  &--arctic {
    color: var(--color-black, #000000);
    background: var(--gradient-arctic);
  }

  &--cloudy {
    color: var(--color-black, #000000);
    background: var(--gradient-cloudy);
  }

  &--sky {
    color: var(--color-black, #000000);
    background: var(--gradient-sky);
  }

  &--margo {
    color: var(--color-black, #000000);
    background: var(--gradient-margo);
  }

  &--limeade {
    color: var(--color-black, #000000);
    background: var(--gradient-limeade);
  }

  &--apple {
    color: var(--color-black, #000000);
    background: var(--gradient-apple);
  }

  &--delicate {
    color: var(--color-black, #000000);
    background: var(--gradient-delicate);
  }

  &--blossom {
    color: var(--color-black, #000000);
    background: var(--gradient-blossom);
  }

  // Status variants
  &--success {
    color: var(--color-white, #ffffff);
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  }

  &--warning {
    color: var(--color-black, #000000);
    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
  }

  &--danger {
    color: var(--color-white, #ffffff);
    background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
  }

  &--info {
    color: var(--color-white, #ffffff);
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  }

  // Neutral variants
  &--light {
    color: var(--color-level-10);
    background: var(--color-level-95);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
      background: var(--color-level-20);
    }
  }

  &--dark {
    color: var(--color-level-90);
    background: var(--color-level-10);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-10);
      background: var(--color-level-90);
    }
  }
}
</style>