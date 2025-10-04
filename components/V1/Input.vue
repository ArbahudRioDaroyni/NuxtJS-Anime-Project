<template>
  <input
    ref="inputElement"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :class="inputClasses"
    v-bind="$attrs"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  >
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outer' | 'inner' | 'both'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: undefined,
  disabled: false,
  readonly: false,
  required: false,
  size: 'md',
  padding: 'md',
  variant: 'inner',
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputElement = ref<HTMLInputElement>()

// Expose element input to parent
defineExpose({
  focus: () => inputElement.value?.focus(),
  blur: () => inputElement.value?.blur(),
  select: () => inputElement.value?.select(),
  element: inputElement
})

const inputClasses = computed(() => [
  'input',
  `input--${props.variant}`,
  `input--size-${props.size}`,
  `input--padding-${props.padding}`,
  {
    'input--error': props.error,
    'input--disabled': props.disabled
  }
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
  }

  @media (prefers-color-scheme: dark) {
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  // Sizes variants
  &--size {
    &-xs {
      font-size: 0.875rem;
    }
    
    &-sm {
      font-size: 0.875rem;
    }
    
    &-md {
      font-size: 1rem;
    }

    &-lg {
      font-size: 1.25rem;
    }
  }

  // Padding variants
  &--padding {
    &-none {
      padding: 0;
    }
    
    &-sm {
      padding: 0.5rem 1rem;
    }
    
    &-md {
      padding: 0.75rem 1.5rem;
    }

    &-lg {
      padding: 1rem 2rem;
    }

    &-xl {
      padding: 1.5rem 3rem;
    }
  }
  
  // Variants
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
  
  // States
  &--error {
    border-color: #ef4444;
    
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
  
  &--disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
}
</style>