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
  template?: 'none' | 'columns' | 'rows'
  layout?: 'none' | 'horizontal' | 'vertical'
  flow?: 'none' | 'row' | 'column'
  length?: '1fr' | string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  gap: '1rem',
  template: 'none',
  layout: 'none',
  flow: 'none',
  length: '1fr'
})

const classes = computed(() => [
  'base-grid',
  props.template !== 'none' ? `base-grid--template-${props.template}` : '',
  props.layout !== 'none' ? `base-grid--layout-${props.layout}` : '',
  props.flow !== 'none' ? `base-grid--flow-${props.flow}` : '',
])
</script>

<style lang="scss">
.base-grid {
  display: grid;
  gap: v-bind('gap || "1rem"');

  &--template {
    &-columns {
      grid-template-columns: repeat(auto-fill, minmax(min(v-bind('length'), 100%), 1fr));
    }

    &-rows {
      grid-template-rows: repeat(auto-fill, minmax(min(v-bind('length'), 100%), 1fr));
    }
  }

  &--layout {
    &-horizontal {
      grid-auto-flow: column;
      grid-auto-columns: v-bind('length');
      overflow-x: auto;
      scroll-snap-type: x mandatory;

      & > * {
        scroll-snap-align: start;
      }
    }

    &-vertical {
      grid-auto-flow: row;
      grid-auto-rows: v-bind('length');
      overflow-y: auto;
      scroll-snap-type: y mandatory;

      & > * {
        scroll-snap-align: start;
      }
    }
  }

  &--flow {
    &-row {
      grid-template-columns: v-bind('length');
      grid-auto-flow: row;

      @media screen and (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-auto-rows: v-bind('length');
        grid-auto-flow: unset;
      }
    }

    &-column {
      grid-template-rows: v-bind('length');
      grid-auto-flow: column;

      @media screen and (max-width: 767px) {
        grid-template-rows: 1fr;
        grid-auto-columns: v-bind('length');
        grid-auto-flow: unset;
      }
    }
  }
}
</style>