<template>
  <component
    :is="props.tag"
    :class="neomorphismClasses"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: string
  variant?: 'outer' | 'inner' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  variant: 'outer'
})

const neomorphismClasses = computed(() => {
  return {
    'neomorphism': true,
    'neomorphism--outer': props.variant === 'outer',
    'neomorphism--inner': props.variant === 'inner', 
    'neomorphism--both': props.variant === 'both'
  }
})
</script>

<style scoped lang="scss">
.neomorphism {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--primary-color-code), 90%);
  padding: 1rem;
  height: auto;
  outline: 2.5px solid hsl(var(--primary-color-code), 10%);
  border-radius: var(--radius);
  overflow: hidden;
  background: hsl(var(--primary-color-code), 10%);

  &--outer {
    box-shadow: 8px 8px 12px 0px hsl(var(--primary-color-code), 4%),
                -8px -8px 12px 0px hsl(var(--primary-color-code), 16%);
  }

  &--inner {
    box-shadow: -4px -4px 4px 0px hsl(var(--primary-color-code), 16%) inset,
                4px 4px 4px 0px hsl(var(--primary-color-code), 4%) inset;
  }

  &--both {
    box-shadow: 8px 8px 12px 0px hsl(var(--primary-color-code), 4%),
                -8px -8px 12px 0px hsl(var(--primary-color-code), 16%),
                -4px -4px 4px 0px hsl(var(--primary-color-code), 16%) inset,
                4px 4px 4px 0px hsl(var(--primary-color-code), 4%) inset;
  }
}
</style>
