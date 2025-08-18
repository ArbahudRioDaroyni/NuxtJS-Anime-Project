<script setup lang="ts">
import type { AnimeStaffRelation } from '~/types/relations'

interface Props {
  data?: AnimeStaffRelation | null;
  isSkeleton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  isSkeleton: false
});

// Constants
const DEFAULT_IMAGE = '/image/image-230x345.webp'
const FALLBACK_TEXT = {
  name: 'Anonymous',
  role: 'Not specified'
} as const

const staff = computed(() => ({
  name: props.data?.staff?.name || FALLBACK_TEXT.name,
  image: props.data?.staff?.medium_image_url || DEFAULT_IMAGE,
  role: props.data?.staff_role?.name || FALLBACK_TEXT.role
}));
</script>

<template>
  <BaseCardNeomorphism variant="both" class="card-character">
    <!-- Image -->
    <header :class="isSkeleton ? 'skeleton' : ''">
      <BaseImageClickable
        v-if="staff.image" 
        :src="staff.image"
        :alt="staff.name"
        :min-width="'60px'"
        :enable-preview="true"
        :is-background="true"
      />
    </header>

    <section class="content">
      <div :class="['info-section', isSkeleton ? 'skeleton' : '']">
        <span>{{ staff.name }}</span>
        <span>{{ staff.role }}</span>
      </div>
    </section>
    <!-- Content -->
  </BaseCardNeomorphism>
</template>

<style scoped lang="scss">
// Variables for reusable values
$card-min-height: 120px;
$content-padding: 1rem;
$gap-default: 1rem;
$gap-small: 0.25rem;

.card-character {
  display: flex;
  align-items: stretch;
  min-height: $card-min-height;
}

.content {
  display: flex;
  flex: 1;
  padding: 0 $content-padding;
  gap: $gap-default;
  align-content: space-between;
  justify-content: space-between;
  border-radius: var(--radius);
}

.info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
