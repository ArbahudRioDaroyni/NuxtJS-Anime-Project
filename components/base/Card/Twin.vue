<template>
  <BaseCardNeomorphism
    tag="article" 
    class="dual-card"
    :style="cardStyles"
    :aria-label="ariaLabel"
    variant="both"
  >
    <!-- Left Section -->
    <div class="card-section">
      <!-- Left Image -->
      <div 
        :class="['image-container', { skeleton: isSkeleton || loading }]"
        @click="handleLeftImageClick"
      >
        <BaseImageClickable
          :src="leftItemComputed.image"
          :alt="leftItemComputed.name"
          :min-width="imageSize"
          :enable-preview="enableImagePreview && !isSkeleton && !loading"
          :is-background="true"
        />
      </div>
      
      <!-- Left Info -->
      <div :class="['info-section', { skeleton: isSkeleton || loading }]">
        <!-- Left Name/Title -->
        <NuxtLink 
          v-if="hasLeftLink && !isSkeleton && !loading"
          :to="leftItemComputed.link!.to"
          :external="leftItemComputed.link?.external"
          class="item-name-link"
          @click="handleLeftClick"
        >
          {{ leftItemComputed.name }}
        </NuxtLink>
        <span 
          v-else 
          class="item-name"
          @click="handleLeftClick"
        >
          {{ leftItemComputed.name }}
        </span>
        
        <!-- Left Subtitle/Badge -->
        <BaseBadge
          v-if="leftItemComputed.badge && showBadges"
          :variant="leftItemComputed.badge.variant"
          :text="leftItemComputed.badge.text"
        />
        <span 
          v-else-if="leftItemComputed.subtitle"
          class="item-subtitle"
        >
          {{ leftItemComputed.subtitle }}
        </span>
      </div>
    </div>
      
    <!-- Right Section -->
    <div class="card-section">
      <!-- Right Info -->
      <div :class="['info-section', { skeleton: isSkeleton || loading }]">
        <!-- Right Name/Title -->
        <NuxtLink 
          v-if="hasRightLink && !isSkeleton && !loading"
          :to="rightItemComputed.link!.to"
          :external="rightItemComputed.link?.external"
          class="item-name-link"
          @click="handleRightClick"
        >
          {{ rightItemComputed.name }}
        </NuxtLink>
        <span 
          v-else 
          class="item-name"
          @click="handleRightClick"
        >
          {{ rightItemComputed.name }}
        </span>
        
        <!-- Right Subtitle/Badge -->
        <BaseBadge
          v-if="rightItemComputed.badge && showBadges"
          :variant="rightItemComputed.badge.variant"
          :text="rightItemComputed.badge.text"
        />
        <span 
          v-else-if="rightItemComputed.subtitle"
          class="item-subtitle"
        >
          {{ rightItemComputed.subtitle }}
        </span>
      </div>
      
      <!-- Right Image -->
      <div 
        :class="['image-container', { skeleton: isSkeleton || loading }]"
        @click="handleRightImageClick"
      >
        <BaseImageClickable
          :src="rightItemComputed.image"
          :alt="rightItemComputed.name"
          :min-width="imageSize"
          :enable-preview="enableImagePreview && !isSkeleton && !loading"
          :is-background="true"
        />
      </div>
    </div>
  </BaseCardNeomorphism>
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
}

interface Props {
  leftItem: CardItem
  rightItem: CardItem
  loading?: boolean
  minHeight?: string
  imageSize?: string
  enableImagePreview?: boolean
  showBadges?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  minHeight: '120px',
  imageSize: '72px',
  enableImagePreview: true,
  showBadges: true,
  ariaLabel: 'Dual information card'
})

const emit = defineEmits<{
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

// Computed items with fallbacks
const leftItemComputed = computed(() => ({
  ...props.leftItem,
  image: props.leftItem.image || DEFAULT.image,
  name: props.leftItem.name || DEFAULT.name,
  subtitle: props.leftItem.subtitle || DEFAULT.subtitle,
}))

const rightItemComputed = computed(() => ({
  ...props.rightItem,
  image: props.rightItem.image || DEFAULT.image,
  name: props.rightItem.name || DEFAULT.name,
  subtitle: props.rightItem.subtitle || DEFAULT.subtitle,
}))

// Event handlers
const handleLeftClick = () => emit('leftClick', leftItemComputed.value)
const handleRightClick = () => emit('rightClick', rightItemComputed.value)
const handleLeftImageClick = () => emit('leftImageClick', leftItemComputed.value)
const handleRightImageClick = () => emit('rightImageClick', rightItemComputed.value)

// Check if item has link
const hasLeftLink = computed(() => leftItemComputed.value.link?.to)
const hasRightLink = computed(() => rightItemComputed.value.link?.to)

// Dynamic styles
const cardStyles = computed(() => ({
  '--card-min-height': props.minHeight,
  '--image-size': props.imageSize
}))
</script>

<style scoped lang="scss">
// Variables
$gap-default: 1rem;
$gap-small: 0.25rem;

.dual-card {
  display: flex;
  min-height: var(--card-min-height, 120px);
}

.card-section {
  display: flex;
  flex: 1;
  gap: $gap-default;
  border-radius: var(--radius);
  height: 100%;

  &:last-child {
    justify-content: end;

    .info-section {
      align-items: flex-end;
      text-align: right;
    }
  }
}

.image-container {
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: $gap-small;
}

// Name/Title Styles
.item-name,
.item-name-link {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-level-10);
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;
  
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

// Subtitle Styles
.item-subtitle {
  font-size: 0.75rem;
  color: var(--color-level-30);
  
  @media (prefers-color-scheme: dark) {
    color: var(--color-level-70);
  }
}

// Image container sizing
.image-container {
  border-radius: var(--radius);
  overflow: hidden;
}
// :deep(.background-image-container) {
//   width: var(--image-size, 72px) !important;
//   height: var(--image-size, 72px) !important;
// }
</style>