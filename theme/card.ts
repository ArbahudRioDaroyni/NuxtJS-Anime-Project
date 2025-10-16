/**
 * Custom Card Theme for Nuxt UI
 * Added several custom variants for diverse styles
 * 
 * References: 
 * - https://ui.nuxt.com/docs/components/card
 * - https://ui.nuxt.com/docs/getting-started/theme/components
 */

export default {
  // Slots (Part of the component that can be styled)
  slots: {
    root: 'rounded-lg overflow-hidden transition-all duration-200',
    header: 'p-4 sm:px-6',
    body: 'p-4 sm:p-6',
    footer: 'p-4 sm:px-6'
  },

  // Variants - different styles for the component
  variants: {
    variant: {
      // Variant default from Nuxt UI
      solid: {
        root: 'bg-inverted text-inverted'
      },
      outline: {
        root: 'bg-default ring ring-default divide-y divide-default'
      },
      soft: {
        root: 'bg-elevated/50 divide-y divide-default'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default divide-y divide-default'
      },

      // Custom variant - Neumorphic
      'neumorphic-outline': {
        root: 'shadow-[8px_8px_12px_var(--card-shadow-color),_-8px_-8px_12px_var(--card-light-color),_-4px_-4px_4px_var(--card-light-color)_inset,_4px_4px_4px_var(--card-shadow-color)_inset]'
      },
      'neumorphic-inner': {
        root: 'shadow-[-4px_-4px_4px_var(--card-light-color)_inset,_4px_4px_4px_var(--card-shadow-color)_inset]'
      },
      'neumorphic-outer': {
        root: 'shadow-[8px_8px_12px_var(--card-shadow-color),_-8px_-8px_12px_var(--card-light-color)]'
      },
    },
  },

  // Set default variants
  defaultVariants: {
    variant: 'outline'
  }
}
