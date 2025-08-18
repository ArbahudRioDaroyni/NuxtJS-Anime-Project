<!-- Base Input Component -->
<template>
  <div class="base-input-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="base-input-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="base-input-container">
      <div v-if="$slots.prepend" class="base-input-prepend">
        <slot name="prepend" />
      </div>
      
      <input
        :id="inputId"
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
      
      <div v-if="$slots.append || loading" class="base-input-append">
        <Icon v-if="loading" name="loader" class="animate-spin" size="16" />
        <slot v-else name="append" />
      </div>
    </div>
    
    <div v-if="error || helperText" class="base-input-helper">
      <span v-if="error" class="text-red-500 text-sm">{{ error }}</span>
      <span v-else-if="helperText" class="text-gray-500 text-sm">{{ helperText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'filled'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  label: undefined,
  placeholder: undefined,
  error: undefined,
  helperText: undefined,
  disabled: false,
  readonly: false,
  required: false,
  loading: false,
  size: 'md',
  variant: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const wrapperClasses = computed(() => [
  'base-input-wrapper',
  {
    'base-input-wrapper--error': props.error,
    'base-input-wrapper--disabled': props.disabled
  }
])

const inputClasses = computed(() => [
  'base-input',
  `base-input--${props.variant}`,
  `base-input--${props.size}`,
  {
    'base-input--error': props.error,
    'base-input--disabled': props.disabled
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
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.base-input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  // Sizes
  &--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  &--md {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
  
  &--lg {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  
  // Variants
  &--default {
    background-color: white;
  }
  
  &--outlined {
    background-color: transparent;
    border-width: 2px;
  }
  
  &--filled {
    background-color: #f9fafb;
    border: none;
    
    &:focus {
      background-color: white;
      border: 1px solid #3b82f6;
    }
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

.base-input-prepend,
.base-input-append {
  position: absolute;
  display: flex;
  align-items: center;
  color: #6b7280;
  z-index: 1;
}

.base-input-prepend {
  left: 0.75rem;
}

.base-input-append {
  right: 0.75rem;
}

.base-input-helper {
  min-height: 1.25rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
