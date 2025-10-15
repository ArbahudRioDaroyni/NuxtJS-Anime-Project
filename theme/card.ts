/**
 * Custom Card Theme for Nuxt UI
 * Custom variants dengan styling yang lebih fleksibel
 * 
 * References: 
 * - https://ui.nuxt.com/docs/components/card
 * - https://ui.nuxt.com/docs/getting-started/theme/components
 */

export default {
  // Slots - bagian-bagian dari Card yang bisa di-styling
  slots: {
    root: 'rounded-lg overflow-hidden transition-all duration-200',
    header: 'p-4 sm:px-6',
    body: 'p-4 sm:p-6',
    footer: 'p-4 sm:px-6'
  },

  // Variants - berbagai style Card yang tersedia
  variants: {
    variant: {
      // Variant default dari Nuxt UI
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

      // Custom variant - Glassmorphism
      glass: {
        root: 'bg-white/10 backdrop-blur-lg ring ring-white/20 divide-y divide-white/10 shadow-xl'
      },

      // Custom variant - Gradient Border
      'gradient-border': {
        root: 'bg-default relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-primary before:to-secondary before:-z-10 divide-y divide-default'
      },

      // Custom variant - Elevated (lebih tinggi)
      elevated: {
        root: 'bg-elevated ring ring-default shadow-lg hover:shadow-xl divide-y divide-default'
      },

      // Custom variant - Neon glow effect
      neon: {
        root: 'bg-default ring-2 ring-primary shadow-[0_0_15px_rgba(var(--color-primary-500),0.5)] divide-y divide-default'
      },

      // Custom variant - Flat minimal
      flat: {
        root: 'bg-elevated divide-y divide-default'
      },

      // Custom variant - Bordered dengan shadow
      bordered: {
        root: 'bg-default border-2 border-default shadow-sm hover:shadow-md divide-y divide-default'
      },

      // Custom variant - Gradient background
      'gradient-primary': {
        root: 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/50 divide-y divide-white/10'
      },
      'gradient-secondary': {
        root: 'bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-lg shadow-secondary-500/50 divide-y divide-white/10'
      },
      'gradient-success': {
        root: 'bg-gradient-to-br from-success-400 to-success-600 text-white shadow-lg shadow-success-500/50 divide-y divide-white/10'
      },

      // Custom variant - Dark theme
      dark: {
        root: 'bg-gray-900 text-white ring ring-gray-800 divide-y divide-gray-800'
      },

      // Custom variant - Interactive (hover effects)
      interactive: {
        root: 'bg-default ring ring-default hover:ring-2 hover:ring-primary hover:shadow-lg cursor-pointer divide-y divide-default transition-all duration-200'
      },

      // Custom variant - Neumorphic
      neumorphic: {
        root: 'shadow-[8px_8px_12px_var(--card-shadow-color),_-8px_-8px_12px_var(--card-light-color),_-4px_-4px_4px_var(--card-light-color)_inset,_4px_4px_4px_var(--card-shadow-color)_inset]'
      }
    },
  },

  // Default variants yang akan digunakan jika tidak dispesifikkan
  defaultVariants: {
    variant: 'outline'
  }
}
