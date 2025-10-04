<template>
  <component
    :is="tag"
    :class="containerClasses"
    :style="containerStyles"
    v-bind="$attrs"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: keyof HTMLElementTagNameMap
  variant?: 'default' | 'fluid' | 'narrow'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  variant: 'fluid',
  padding: 'none',
  margin: 'md',
  backgroundColor: undefined
})

const containerClasses = computed(() => [
  'base-container',
  `base-container--${props.variant}`,
  `base-container--padding-${props.padding}`,
  `base-container--margin-${props.margin}`
])

const containerStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
  }
  
  return styles
})
</script>

<style lang="scss" scoped>
.base-container {
  display: grid;
  --width: 100%;
  width: var(--width);
  max-width: var(--width);
  margin: 0 auto;
  box-sizing: border-box;

  &--default {
    --width: min(1200px, 90%);
  }

  &--fluid {
    --width: min(1400px, 90%);
  }

  &--narrow {
    --width: min(800px, 90%);
  }

  &--padding {
    &-none {
      padding: 0;
    }
    &-sm {
      padding: 0.5rem;
    }
    &-md {
      padding: 1rem;
    }
  
    &-lg {
      padding: 2rem;
    }

    &-xl {
      padding: 4rem;
    }
  }

  &--margin {
    &-none {
      margin: 0 auto;
    }
    &-sm {
      margin: 1rem auto;
    }

    &-md {
      margin: 2.5rem auto;
    }

    &-lg {
      margin: 5rem auto;
    }

    &-xl {
      margin: 7.5rem auto;
    }
  }
}
</style>