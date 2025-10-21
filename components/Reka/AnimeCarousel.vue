<template>
  <div class="relative w-full overflow-hidden">
    <!-- Left Edge Fade -->
    <div class="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-default via-black/20 to-transparent z-10 pointer-events-none" />
    
    <!-- Right Edge Fade -->
    <div class="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-default via-black/20 to-transparent z-10 pointer-events-none" />
    
    <!-- Carousel -->
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      arrows
      dots
      loop
      :items="items"
      :autoplay="{ delay: 5000, stopOnInteraction: false }"
      :prev="{ 
        color: 'neutral', 
        variant: 'solid',
        class: 'backdrop-blur-sm border-0 bg-inverted/50 hover:bg-inverted',
        size: 'lg'
      }"
      :next="{ 
        color: 'neutral', 
        variant: 'solid',
        class: 'backdrop-blur-sm border-0 bg-inverted/50 hover:bg-inverted',
        size: 'lg'
      }"
      :ui="{
        viewport: 'overflow-visible',
        item: 'px-2 basis-3/4',
        prev: 'start-4 sm:start-6 hover:cursor-pointer transition-all duration-200',
        next: 'end-4 sm:end-6 hover:cursor-pointer transition-all duration-200',
        dots: 'bottom-6 gap-2',
        dot: 'size-2 hover:scale-125 data-[state=active]:w-8 bg-gray-600 hover:bg-gray-100 data-[state=active]:bg-gray-100 transition-all duration-300'
      }"
      @select="onSelect"
    >
      <!-- Animes Card -->
      <div class="relative h-full rounded-2xl overflow-hidden group">
        <!-- Background Image with Gradient Overlay -->
        <div class="absolute inset-0">
          <img
            v-if="item.banner_image_url"
            :src="item.banner_image_url"
            :alt="item.title_romaji || item.title_english || item.title_native || 'Unknown Title'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        <!-- Content Overlay -->
        <div class="relative h-full flex flex-col justify-end p-6 sm:p-10 text-white">
          <!-- Genres/Categories -->
          <!-- <div class="flex flex-wrap gap-2 mb-4">
            <UBadge
              v-for="genre in item.anime_tag_relations?.slice(0, 3)"
              :key="genre"
              :label="genre"
              color="primary"
              variant="solid"
              size="sm"
              class="backdrop-blur-sm bg-primary/80"
            />
          </div> -->

          <!-- Title -->
          <h2 class="text-xl sm:text-5xl font-bold mb-3 drop-shadow-lg text-ellipsis line-clamp-3 sm:line-clamp-2 min-h-22 h-22 sm:min-h-24 sm:h-24">
            {{ item.title_romaji || item.title_english || item.title_native || 'Unknown Title' }}
          </h2>

          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-4 mb-4 text-sm sm:text-base">
            <div v-if="item.trending" class="flex items-center gap-1">
              <UIcon name="i-lucide-tv" class="w-5 h-5 text-yellow-400" />
              <span class="font-semibold">{{ item.trending }}</span>
            </div>
            <span v-if="item.year" class="opacity-80">{{ item.year }}</span>
            <span v-if="item.duration" class="opacity-80">
              {{ item.duration + ' ' + (item.duration_unit === 'm' ? 'minutes' : 'seconds') }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm sm:text-base opacity-90 line-clamp-2 sm:line-clamp-3 mb-6 max-w-2xl">
            {{ item.description }}
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <UButton
              label="Watch Now"
              icon="i-lucide-play"
              color="primary"
              size="lg"
              class="shadow-lg hover:scale-105 transition-transform"
              @click.stop="$emit('watch', item)"
            />
            <UButton
              label="More Info"
              icon="i-lucide-info"
              color="neutral"
              variant="outline"
              size="lg"
              class="backdrop-blur-sm bg-black/10 hover:bg-white/20 border-white/30 text-white cursor-pointer"
              @click.stop="$emit('info', item)"
            />
          </div>
        </div>
      </div>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import type { AnimeDetails } from '~/types/anime';

interface Props {
  items: AnimeDetails[]
}

defineProps<Props>()

const emit = defineEmits<{
  watch: [data: AnimeDetails]
  info: [data: AnimeDetails]
  select: [index: number]
}>()

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onSelect(index: number) {
  activeIndex.value = index
  emit('select', index)
}
</script>
