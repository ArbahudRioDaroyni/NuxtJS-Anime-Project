/**
 * Custom Badge Theme
 * Added a new color variant 'gradient-*' with gradient styles
 *
 * References: https://ui.nuxt.com/docs/getting-started/theme/components
 */

export default {
  // Slots (Part of the component that can be styled)
  slots: {
    base: 'font-semibold inline-flex items-center',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    trailingIcon: 'shrink-0'
  },

  // Variants - different styles for the component
  variants: {
    // Color variants
    color: {
      primary: '',
      secondary: '',
      success: '',
      info: '',
      warning: '',
      error: '',
      neutral: '',
      // New gradient color variant
      'gradient-disco': '',
      'gradient-megatron': '',
      'gradient-tranquil': '',
      'gradient-oceanic': '',
      'gradient-maldives': '',
      'gradient-martini': '',
      'gradient-arctic': '',
      'gradient-cloudy': '',
      'gradient-sky': '',
      'gradient-cactus': '',
      'gradient-limeade': '',
      'gradient-fresco': '',
      'gradient-delicate': '',
      'gradient-blossom': '',
    },

    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },

    size: {
      xs: {
        base: 'text-[9px]/3 px-1.5 py-0.5 gap-1 rounded',
        leadingIcon: 'size-2.5',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-2.5'
      },
      sm: {
        base: 'text-[10px]/3 px-2 py-1 gap-1 rounded-md',
        leadingIcon: 'size-3',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-3'
      },
      md: {
        base: 'text-xs px-2.5 py-1 gap-1.5 rounded-md',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      lg: {
        base: 'text-sm px-3 py-1.5 gap-1.5 rounded-lg',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'text-base px-3.5 py-2 gap-2 rounded-lg',
        leadingIcon: 'size-6',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-6'
      }
    },

    square: {
      true: ''
    }
  },

  // Compound Variants - specific combinations of props
  compoundVariants: [
    // Default colors with solid variant
    {
      color: 'primary',
      variant: 'solid',
      class: 'bg-primary text-inverted shadow-sm shadow-primary/30'
    },
    {
      color: 'secondary',
      variant: 'solid',
      class: 'bg-secondary text-inverted shadow-sm shadow-secondary/30'
    },
    {
      color: 'success',
      variant: 'solid',
      class: 'bg-success text-inverted shadow-sm shadow-success/30'
    },
    {
      color: 'info',
      variant: 'solid',
      class: 'bg-info text-inverted shadow-sm shadow-info/30'
    },
    {
      color: 'warning',
      variant: 'solid',
      class: 'bg-warning text-inverted shadow-sm shadow-warning/30'
    },
    {
      color: 'error',
      variant: 'solid',
      class: 'bg-error text-inverted shadow-sm shadow-error/30'
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: 'bg-inverted text-inverted'
    },

    // Default colors with outline variant
    {
      color: 'primary',
      variant: 'outline',
      class: 'text-primary ring ring-inset ring-primary/50'
    },
    {
      color: 'secondary',
      variant: 'outline',
      class: 'text-secondary ring ring-inset ring-secondary/50'
    },
    {
      color: 'success',
      variant: 'outline',
      class: 'text-success ring ring-inset ring-success/50'
    },
    {
      color: 'info',
      variant: 'outline',
      class: 'text-info ring ring-inset ring-info/50'
    },
    {
      color: 'warning',
      variant: 'outline',
      class: 'text-warning ring ring-inset ring-warning/50'
    },
    {
      color: 'error',
      variant: 'outline',
      class: 'text-error ring ring-inset ring-error/50'
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: 'ring ring-inset ring-accented text-default bg-default'
    },

    // Default colors with soft variant
    {
      color: 'primary',
      variant: 'soft',
      class: 'bg-primary/10 text-primary'
    },
    {
      color: 'secondary',
      variant: 'soft',
      class: 'bg-secondary/10 text-secondary'
    },
    {
      color: 'success',
      variant: 'soft',
      class: 'bg-success/10 text-success'
    },
    {
      color: 'info',
      variant: 'soft',
      class: 'bg-info/10 text-info'
    },
    {
      color: 'warning',
      variant: 'soft',
      class: 'bg-warning/10 text-warning'
    },
    {
      color: 'error',
      variant: 'soft',
      class: 'bg-error/10 text-error'
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: 'text-default bg-elevated'
    },

    // Default colors with subtle variant
    {
      color: 'primary',
      variant: 'subtle',
      class: 'bg-primary/10 text-primary ring ring-inset ring-primary/25'
    },
    {
      color: 'secondary',
      variant: 'subtle',
      class: 'bg-secondary/10 text-secondary ring ring-inset ring-secondary/25'
    },
    {
      color: 'success',
      variant: 'subtle',
      class: 'bg-success/10 text-success ring ring-inset ring-success/25'
    },
    {
      color: 'info',
      variant: 'subtle',
      class: 'bg-info/10 text-info ring ring-inset ring-info/25'
    },
    {
      color: 'warning',
      variant: 'subtle',
      class: 'bg-warning/10 text-warning ring ring-inset ring-warning/25'
    },
    {
      color: 'error',
      variant: 'subtle',
      class: 'bg-error/10 text-error ring ring-inset ring-error/25'
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class: 'bg-elevated text-default ring ring-inset ring-accented'
    },

    // Custom gradient-disco
    {
      color: 'gradient-disco',
      variant: 'solid',
      class: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg shadow-purple-500/50 dark:shadow-pink-300/50'
    },
    {
      color: 'gradient-disco',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-purple-500/50 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'
    },
    {
      color: 'gradient-disco',
      variant: 'soft',
      class: 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 text-purple-600 dark:text-purple-400'
    },
    {
      color: 'gradient-disco',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 text-purple-600 dark:text-purple-400 ring ring-inset ring-purple-500/25'
    },

    // Custom gradient-megatron
    {
      color: 'gradient-megatron',
      variant: 'solid',
      class: 'bg-gradient-to-r from-green-200 via-yellow-400 to-red-300 text-black shadow-lg shadow-red-300/50 dark:shadow-green-200/50'
    },
    {
      color: 'gradient-megatron',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-green-200/50 text-transparent bg-clip-text bg-gradient-to-r from-green-200 via-yellow-400 to-red-300'
    },
    {
      color: 'gradient-megatron',
      variant: 'soft',
      class: 'bg-gradient-to-r from-green-200/10 via-yellow-400/10 to-red-300/10 text-green-600 dark:text-green-400'
    },
    {
      color: 'gradient-megatron',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-green-200/10 via-yellow-400/10 to-red-300/10 text-green-600 dark:text-green-400 ring ring-inset ring-green-200/25'
    },

    // Custom gradient-tranquil
    {
      color: 'gradient-tranquil',
      variant: 'solid',
      class: 'bg-gradient-to-r from-orange-200 to-pink-500 text-black shadow-lg shadow-pink-500/50 dark:shadow-orange-200/50'
    },
    {
      color: 'gradient-tranquil',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-orange-200/50 text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-pink-500'
    },
    {
      color: 'gradient-tranquil',
      variant: 'soft',
      class: 'bg-gradient-to-r from-orange-200/10 to-pink-500/10 text-orange-600 dark:text-orange-400'
    },
    {
      color: 'gradient-tranquil',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-orange-200/10 to-pink-500/10 text-orange-600 dark:text-orange-400 ring ring-inset ring-orange-200/25'
    },

    // Custom gradient-oceanic
    {
      color: 'gradient-oceanic',
      variant: 'solid',
      class: 'bg-gradient-to-r from-cyan-500 to-violet-950 text-white shadow-lg shadow-violet-950/50 dark:shadow-cyan-500/50'
    },
    {
      color: 'gradient-oceanic',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-cyan-500/50 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-950'
    },
    {
      color: 'gradient-oceanic',
      variant: 'soft',
      class: 'bg-gradient-to-r from-cyan-500/10 to-violet-950/10 text-cyan-600 dark:text-cyan-400'
    },
    {
      color: 'gradient-oceanic',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-cyan-500/10 to-violet-950/10 text-cyan-600 dark:text-cyan-400 ring ring-inset ring-cyan-500/25'
    },

    // Custom gradient-maldives
    {
      color: 'gradient-maldives',
      variant: 'solid',
      class: 'bg-gradient-to-r from-cyan-400 to-cyan-100 text-black shadow-lg shadow-cyan-400/50 dark:shadow-cyan-100/50'
    },
    {
      color: 'gradient-maldives',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-cyan-400/50 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-100'
    },
    {
      color: 'gradient-maldives',
      variant: 'soft',
      class: 'bg-gradient-to-r from-cyan-400/10 to-cyan-100/10 text-cyan-600 dark:text-cyan-400'
    },
    {
      color: 'gradient-maldives',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-cyan-400/10 to-cyan-100/10 text-cyan-600 dark:text-cyan-400 ring ring-inset ring-cyan-400/25'
    },

    // Custom gradient-martini
    {
      color: 'gradient-martini',
      variant: 'solid',
      class: 'bg-gradient-to-r from-yellow-300 to-green-300 text-black shadow-lg shadow-green-300/50 dark:shadow-yellow-300/50'
    },
    {
      color: 'gradient-martini',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-yellow-300/50 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300'
    },
    {
      color: 'gradient-martini',
      variant: 'soft',
      class: 'bg-gradient-to-r from-yellow-300/10 to-green-300/10 text-yellow-600 dark:text-yellow-400'
    },
    {
      color: 'gradient-martini',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-yellow-300/10 to-green-300/10 text-yellow-600 dark:text-yellow-400 ring ring-inset ring-yellow-300/25'
    },

    // Custom gradient-arctic
    {
      color: 'gradient-arctic',
      variant: 'solid',
      class: 'bg-gradient-to-r from-blue-300 to-violet-400 text-black shadow-lg shadow-violet-400/50 dark:shadow-blue-300/50'
    },
    {
      color: 'gradient-arctic',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-blue-300/50 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-400'
    },
    {
      color: 'gradient-arctic',
      variant: 'soft',
      class: 'bg-gradient-to-r from-blue-300/10 to-violet-400/10 text-blue-600 dark:text-blue-400'
    },
    {
      color: 'gradient-arctic',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-blue-300/10 to-violet-400/10 text-blue-600 dark:text-blue-400 ring ring-inset ring-blue-300/25'
    },

    // Custom gradient-cloudy
    {
      color: 'gradient-cloudy',
      variant: 'solid',
      class: 'bg-gradient-to-r from-slate-200 to-blue-200 text-black shadow-lg shadow-slate-200/50 dark:shadow-blue-200/50'
    },
    {
      color: 'gradient-cloudy',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-slate-200/50 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-blue-200'
    },
    {
      color: 'gradient-cloudy',
      variant: 'soft',
      class: 'bg-gradient-to-r from-slate-200/10 to-blue-200/10 text-slate-600 dark:text-slate-400'
    },
    {
      color: 'gradient-cloudy',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-slate-200/10 to-blue-200/10 text-slate-600 dark:text-slate-400 ring ring-inset ring-slate-200/25'
    },

    // Custom gradient-sky
    {
      color: 'gradient-sky',
      variant: 'solid',
      class: 'bg-gradient-to-r from-sky-400 to-blue-300 text-black shadow-lg shadow-sky-400/50 dark:shadow-blue-300/50'
    },
    {
      color: 'gradient-sky',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-sky-400/50 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300'
    },
    {
      color: 'gradient-sky',
      variant: 'soft',
      class: 'bg-gradient-to-r from-sky-400/10 to-blue-300/10 text-sky-600 dark:text-sky-400'
    },
    {
      color: 'gradient-sky',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-sky-400/10 to-blue-300/10 text-sky-600 dark:text-sky-400 ring ring-inset ring-sky-400/25'
    },

    // Custom gradient-cactus
    {
      color: 'gradient-cactus',
      variant: 'solid',
      class: 'bg-gradient-to-r from-yellow-200 to-amber-600 text-black shadow-lg shadow-amber-600/50 dark:shadow-yellow-200/50'
    },
    {
      color: 'gradient-cactus',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-yellow-200/50 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-600'
    },
    {
      color: 'gradient-cactus',
      variant: 'soft',
      class: 'bg-gradient-to-r from-yellow-200/10 to-amber-600/10 text-amber-600 dark:text-amber-400'
    },
    {
      color: 'gradient-cactus',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-yellow-200/10 to-amber-600/10 text-amber-600 dark:text-amber-400 ring ring-inset ring-yellow-200/25'
    },

    // Custom gradient-limeade
    {
      color: 'gradient-limeade',
      variant: 'solid',
      class: 'bg-gradient-to-r from-teal-200 to-orange-100 text-black shadow-lg shadow-orange-100/50 dark:shadow-teal-200/50'
    },
    {
      color: 'gradient-limeade',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-teal-200/50 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-orange-100'
    },
    {
      color: 'gradient-limeade',
      variant: 'soft',
      class: 'bg-gradient-to-r from-teal-200/10 to-orange-100/10 text-teal-600 dark:text-teal-400'
    },
    {
      color: 'gradient-limeade',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-teal-200/10 to-orange-100/10 text-teal-600 dark:text-teal-400 ring ring-inset ring-teal-200/25'
    },

    // Custom gradient-fresco
    {
      color: 'gradient-fresco',
      variant: 'solid',
      class: 'bg-gradient-to-r from-amber-700 to-violet-700 text-white shadow-lg shadow-violet-700/50 dark:shadow-amber-700/50'
    },
    {
      color: 'gradient-fresco',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-amber-700/50 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-violet-700'
    },
    {
      color: 'gradient-fresco',
      variant: 'soft',
      class: 'bg-gradient-to-r from-amber-700/10 to-violet-700/10 text-amber-600 dark:text-amber-400'
    },
    {
      color: 'gradient-fresco',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-amber-700/10 to-violet-700/10 text-amber-600 dark:text-amber-400 ring ring-inset ring-amber-700/25'
    },

    // Custom gradient-delicate
    {
      color: 'gradient-delicate',
      variant: 'solid',
      class: 'bg-gradient-to-r from-violet-400 to-violet-50 text-black shadow-lg shadow-violet-400/50 dark:shadow-violet-50/50'
    },
    {
      color: 'gradient-delicate',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-violet-400/50 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-50'
    },
    {
      color: 'gradient-delicate',
      variant: 'soft',
      class: 'bg-gradient-to-r from-violet-400/10 to-violet-50/10 text-violet-600 dark:text-violet-400'
    },
    {
      color: 'gradient-delicate',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-violet-400/10 to-violet-50/10 text-violet-600 dark:text-violet-400 ring ring-inset ring-violet-400/25'
    },

    // Custom gradient-blossom
    {
      color: 'gradient-blossom',
      variant: 'solid',
      class: 'bg-gradient-to-r from-teal-300 via-pink-200 to-red-200 text-black shadow-lg shadow-red-200/50 dark:shadow-teal-300/50'
    },
    {
      color: 'gradient-blossom',
      variant: 'outline',
      class: 'bg-transparent ring ring-inset ring-teal-300/50 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-pink-200 to-red-200'
    },
    {
      color: 'gradient-blossom',
      variant: 'soft',
      class: 'bg-gradient-to-r from-teal-300/10 via-pink-200/10 to-red-200/10 text-teal-600 dark:text-teal-400'
    },
    {
      color: 'gradient-blossom',
      variant: 'subtle',
      class: 'bg-gradient-to-r from-teal-300/10 via-pink-200/10 to-red-200/10 text-teal-600 dark:text-teal-400 ring ring-inset ring-teal-300/25'
    },

    // Default square variants
    {
      size: 'xs',
      square: true,
      class: 'p-0.5'
    },
    {
      size: 'sm',
      square: true,
      class: 'p-1'
    },
    {
      size: 'md',
      square: true,
      class: 'p-1'
    },
    {
      size: 'lg',
      square: true,
      class: 'p-1'
    },
    {
      size: 'xl',
      square: true,
      class: 'p-1'
    }
  ],

  // Set default variants
  defaultVariants: {
    color: 'primary',
    variant: 'soft',
    size: 'sm'
  }
}
