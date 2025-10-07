<template>
  <component
    :is="props.tag"
    :class="classes"
    role="article"
    @click="handleClick"
  >
    <header v-if="$slots.header">
      <slot name="header" />
    </header>

    <template v-if="$slots.default">
      <slot />
    </template>

    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: keyof HTMLElementTagNameMap
  variant?: 'outer' | 'inner' | 'both',
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full',
  padding?: 'none' | 'sm' | 'md' | 'lg',
  layout?: 'none' | 'default' | 'twin' | 'vertical' | 'horizontal',
  clickable?: boolean
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  variant: 'outer',
  rounded: 'md',
  padding: 'md',
  layout: 'default',
  clickable: false,
  href: undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable || props.href) {
    if (props.href) {
      // Navigate to URL
      navigateTo(props.href)
    }
    // Emit click event
    emit('click', event)
  }
}

const classes = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  `base-card--rounded-${props.rounded}`,
  `base-card--padding-${props.padding}`,
  `base-card--layout-${props.layout}`,
  {
    'base-card--clickable': props.clickable || props.href
  }
])
</script>

<style lang="scss">
@media (prefers-color-scheme: dark) {
  .base-card {
    --color: hsl(from var(--primary-color) h s 90%);
    --background-color: hsl(from var(--primary-color) h s 10%);
    --shadow-color: hsl(from var(--primary-color) h s 4%);
    --light-color: hsl(from var(--primary-color) h s 16%);
  }
}
@media (prefers-color-scheme: light) {
  .base-card {
    --color: hsl(from var(--primary-color) h s 10%);
    --background-color: hsl(from var(--primary-color) h s 97.5%);
    --shadow-color: hsl(from var(--primary-color) h s 96%);
    --light-color: hsl(from var(--primary-color) h s 84%);
  }
}

.base-card {
  width: auto;
  height: auto;
  color: var(--color);
  background: var(--background-color);
  outline: 2.5px solid var(--background-color);
  overflow: hidden;

  // Clickable modifier
  &--clickable {
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      a {
        color: var(--color-primary);
        text-decoration: underline;
      }
    }
    
    &:active {
      filter: brightness(0.95);
    }
  }

  // Variants
  &--outer {
    box-shadow: 8px 8px 12px var(--shadow-color),
      -8px -8px 12px var(--light-color);
  }

  &--inner {
    box-shadow: -4px -4px 4px var(--light-color) inset,
      4px 4px 4px var(--shadow-color) inset;
  }

  &--both {
    box-shadow: 8px 8px 12px var(--shadow-color),
      -8px -8px 12px var(--light-color),
      -4px -4px 4px var(--light-color) inset,
      4px 4px 4px var(--shadow-color) inset;
  }

  // Rounded
  &--rounded {
    &-none {
      border-radius: 0;
    }

    &-sm {
      border-radius: 0.125rem;
    }

    &-md {
      border-radius: 0.375rem;
    }

    &-lg {
      border-radius: 0.5rem;
    }

    &-full {
      border-radius: 100%;
    }
  }

  // Padding
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
      padding: 1.5rem;
    }
  }

  // Layout
  &--layout {
    &-default {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: flex-start;
      gap: 1rem;

      >figure,
      >img {
        cursor: pointer;
        transition: filter 0.2s ease;
        border-radius: var(--radius);
        overflow: hidden;
      }

      >div {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.5rem;
        flex: 1;

        a {
          min-height: 2.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;

          // Multi-line ellipsis - limit to 2 lines
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
          max-height: calc(1.4em * 2); // 2 lines with line-height 1.4

          &:hover {
            color: var(--color-primary);
            text-decoration: underline;
          }
        }
      }
    }

    &-twin {
      display: flex;
      justify-content: space-between;

      > div {
        display: flex;
        gap: 1rem;
        flex: 50%;

        >figure,
        >img {
          transition: filter 0.2s ease;
          border-radius: var(--radius);
          overflow: hidden;
        }

        &:last-child {
          flex-direction: row-reverse;
          div {
            align-items: flex-end;
            text-align: right;
          }
        }

        div {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          justify-content: space-around;
          gap: 1rem;
          flex: 1;

          a {
            min-height: 2.5rem;
            font-weight: 600;
            font-size: 0.875rem;
            text-decoration: none;
            transition: color 0.2s ease;
            cursor: pointer;

            // Multi-line ellipsis - limit to 2 lines
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
            max-height: calc(1.4em * 2); // 2 lines with line-height 1.4

            &:hover {
              color: var(--color-primary);
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
