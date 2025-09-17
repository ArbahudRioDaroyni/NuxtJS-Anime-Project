<template>
  <component
    :is="props.tag"
    class="card card-neomorphism card-neomorphism--both"
    :style="cardStyles"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  >
    <!-- Use slot if provided -->
    <slot v-if="$slots.default" />
    
    <!-- Fallback to dynamic layout based on items -->
    <template v-else>
      <div 
        v-for="(item, index) in itemsComputed"
        :key="item.id || index"
        class="card-section"
      >
        <!-- Image Container - Conditional Position -->
        <header 
          :class="['card-image', { skeleton: isSkeleton || loading }]"        
          @click="handleImageClick(index)"
        >
          <BaseImageClickable
            :src="item.image"
            :alt="item.name"
            :min-width="imageSize"
            :enable-preview="enableImagePreview && !isSkeleton && !loading"
            :is-background="true"
          />
        </header>
        
        <!-- Info Section -->
        <div :class="['card-content', { skeleton: isSkeleton || loading }]">
          <!-- Name/Title -->
          <NuxtLink 
            v-if="hasLink(index) && !isSkeleton && !loading"
            :to="item.link!.to"
            :external="item.link?.external"
            class="card-title-link"
            :title="item.name"
            @click="handleClick(index)"
          >
            {{ item.name }}
          </NuxtLink>
          <span 
            v-else 
            class="card-title"
            :title="item.name"
            @click="handleClick(index)"
          >
            {{ item.name }}
          </span>
          
          <!-- Subtitle/Badge -->
          <BaseBadge
            v-if="item.badge && showBadges"
            :variant="item.badge.variant"
            :text="item.badge.text"
          />
          <span 
            v-else-if="item.subtitle"
            class="card-subtitle"
          >
            {{ item.subtitle }}
          </span>

          <!-- Additional Info -->
          <div v-if="item.additionalInfo" class="card-additional-info">
            <div v-html="sanitizeHtml(item.additionalInfo)" />
          </div>
        </div>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
interface CardItem {
  id?: string | number
  name?: string
  image?: string
  subtitle?: string
  slug?: string | null
  badge?: {
    text?: string
    variant?: 'main' | 'supporting' | 'background' | 'other' | string
  }
  link?: {
    to: string
    external?: boolean
  }
  additionalInfo?: string
}

interface Props {
  tag?: string
  items: CardItem[]
  loading?: boolean
  minHeight?: string
  imageSize?: string
  enableImagePreview?: boolean
  showBadges?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'article',
  loading: false,
  minHeight: '130px',
  imageSize: '72px',
  enableImagePreview: true,
  showBadges: true,
  ariaLabel: 'Information card'
})

const emit = defineEmits<{
  itemClick: [item: CardItem, index: number]
  imageClick: [item: CardItem, index: number]
  // Backward compatibility events
  leftClick: [item: CardItem]
  rightClick: [item: CardItem]
  leftImageClick: [item: CardItem]
  rightImageClick: [item: CardItem]
}>()

// Use global skeleton state
const { isSkeleton } = useSkeletonStore()

// Constants
const DEFAULT = {
  name: 'Unknown',
  image: '/image/image-230x345.webp',
  subtitle: 'Unknown',
} as const

// Only validate items if no slot is provided
const validatedItems = computed(() => {
  // If slot is provided, skip validation
  if (getCurrentInstance()?.slots.default) {
    return []
  }
  
  if (!Array.isArray(props.items) || props.items.length === 0) {
    console.warn('Items prop should be a non-empty array when no slot is provided')
    return [{}] // Return default empty item
  }
  if (props.items.length > 2) {
    console.warn('Items array should contain maximum 2 items, using first 2')
    return props.items.slice(0, 2)
  }
  return props.items
})

// Computed items with fallbacks
const itemsComputed = computed(() => 
  validatedItems.value.map(item => ({
    ...item,
    image: item.image || DEFAULT.image,
    name: item.name || DEFAULT.name,
    subtitle: item.subtitle || DEFAULT.subtitle,
  }))
)

// Check if item has link
const hasLink = (index: number) => {
  const item = itemsComputed.value[index]
  return item?.link?.to
}

// Event handlers
const handleClick = (index: number) => {
  const item = itemsComputed.value[index]
  if (!item) return
  
  emit('itemClick', item, index)
  
  // Backward compatibility
  if (index === 0) emit('leftClick', item)
  if (index === 1) emit('rightClick', item)
}

const handleImageClick = (index: number) => {
  const item = itemsComputed.value[index]
  if (!item) return
  
  emit('imageClick', item, index)
  
  // Backward compatibility
  if (index === 0) emit('leftImageClick', item)
  if (index === 1) emit('rightImageClick', item)
}

// Dynamic styles
const cardStyles = computed(() => ({
  '--card-min-height': props.minHeight,
  '--image-size': props.imageSize
}))

const sanitizeHtml = (html: string) => {
  // Simple HTML sanitizer: strips script/style tags and event handlers
  if (typeof html !== 'string') return ''
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
}
</script>

<style scoped lang="scss">
// Variables
$gap-default: 1rem;
$gap-small: 0.25rem;

.card {
  display: flex;
  min-height: var(--card-min-height, 120px);

  &.card-neomorphism {
    width: 100%;
    min-height: var(--card-min-height, 120px);
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

    &.card-neomorphism--outer {
      box-shadow: 8px 8px 12px 0px hsl(var(--primary-color-code), 4%),
                  -8px -8px 12px 0px hsl(var(--primary-color-code), 16%);
    }

    &.card-neomorphism--inner {
      box-shadow: -4px -4px 4px 0px hsl(var(--primary-color-code), 16%) inset,
                  4px 4px 4px 0px hsl(var(--primary-color-code), 4%) inset;
    }

    &.card-neomorphism--both {
      box-shadow: 8px 8px 12px 0px hsl(var(--primary-color-code), 4%),
                  -8px -8px 12px 0px hsl(var(--primary-color-code), 16%),
                  -4px -4px 4px 0px hsl(var(--primary-color-code), 16%) inset,
                  4px 4px 4px 0px hsl(var(--primary-color-code), 4%) inset;
    }
  }
}

.card-section {
  display: flex;
  flex: 1;
  gap: $gap-default;
  border-radius: var(--radius);
  height: 100%;

  &:nth-child(2) {
    justify-content: end;

    .card-content {
      align-items: flex-end;
      text-align: right;
    }

    .card-image {
      order: 2;
    }
  }
}

.card-image {
  cursor: pointer;
  transition: filter 0.2s ease;
  border-radius: var(--radius);
  overflow: hidden;
  
  &:hover {
    filter: brightness(1.1);
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: $gap-small;
  flex: 1;
}

.card-title,
.card-title-link {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-level-10);
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;

  // Multi-line ellipsis - limit to 2 lines
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: calc(1.4em * 2); // 2 lines with line-height 1.4
  
  &:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--color-level-90);
    
    &:hover {
      color: var(--color-primary-light);
    }
  }
}

.card-subtitle {
  font-size: 0.75rem;
  color: var(--color-level-30);
  
  @media (prefers-color-scheme: dark) {
    color: var(--color-level-70);
  }
}
</style>