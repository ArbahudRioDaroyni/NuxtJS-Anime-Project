<template>
  <component
    :is="props.tag"
    :class="classes"
    v-bind="$attrs"
    role="grid"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: keyof HTMLElementTagNameMap
  gap?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  gap: '1rem'
})

const classes = computed(() => [
  'grid'
])
</script>

<style lang="scss">
.grid {
  display: grid;
  gap: v-bind('gap || "1rem"');
  grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr));
}
</style>