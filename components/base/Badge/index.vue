<template>
  <component :is="tag" :class="badgeClasses" :style="badgeStyles" v-bind="$attrs">
    <template v-if="$slots.default">
      <slot />
    </template>
    <span v-else>{{ text }}</span>
  </component>
</template>

<script setup lang="ts">
import type { Badge } from '~/types/components';

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
  `badge__${props.variant}`,
  `badge__size-${props.size}`,
  `badge__rounded-${props.rounded}`,
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
  &__size {
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
  &__rounded {
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
  &__megatron {
    color: var(--color-black, #000000);
    background: var(--gradient-megatron);
  }

  &__tranquil {
    color: var(--color-black, #000000);
    background: var(--gradient-tranquil);
  }

  &__oceanic {
    color: var(--color-black, #000000);
    background: var(--gradient-oceanic);
  }

  &__maldives {
    color: var(--color-black, #000000);
    background: var(--gradient-maldives);
  }

  &__martini {
    color: var(--color-black, #000000);
    background: var(--gradient-martini);
  }

  &__arctic {
    color: var(--color-black, #000000);
    background: var(--gradient-arctic);
  }

  &__cloudy {
    color: var(--color-black, #000000);
    background: var(--gradient-cloudy);
  }

  &__sky {
    color: var(--color-black, #000000);
    background: var(--gradient-sky);
  }

  &__margo {
    color: var(--color-black, #000000);
    background: var(--gradient-margo);
  }

  &__limeade {
    color: var(--color-black, #000000);
    background: var(--gradient-limeade);
  }

  &__apple {
    color: var(--color-black, #000000);
    background: var(--gradient-apple);
  }

  &__delicate {
    color: var(--color-black, #000000);
    background: var(--gradient-delicate);
  }

  &__blossom {
    color: var(--color-black, #000000);
    background: var(--gradient-blossom);
  }

  // Status variants
  &__success {
    color: var(--color-white, #ffffff);
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  }

  &__warning {
    color: var(--color-black, #000000);
    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
  }

  &__danger {
    color: var(--color-white, #ffffff);
    background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
  }

  &__info {
    color: var(--color-white, #ffffff);
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  }

  // Neutral variants
  &__light {
    color: var(--color-level-10);
    background: var(--color-level-95);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-90);
      background: var(--color-level-20);
    }
  }

  &__dark {
    color: var(--color-level-90);
    background: var(--color-level-10);

    @media (prefers-color-scheme: dark) {
      color: var(--color-level-10);
      background: var(--color-level-90);
    }
  }
}
</style>