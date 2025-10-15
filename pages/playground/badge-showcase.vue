<script setup lang="ts">
/**
 * Playground untuk test UBadge component
 * Showcase semua variants, colors, sizes, dan custom color 'gradient-disco'
 */

// Sample data untuk testing
const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral', 'gradient-disco'] as const
const variants = ['solid', 'outline', 'soft', 'subtle'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const sampleGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life']

// Set page meta
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <UContainer>
    <div class="py-8 space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold">
          UBadge Disco Theme Playground
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Showcase custom Badge theme dengan color 'gradient-disco'
        </p>
      </div>

      <!-- ✨ Disco Gradient Color Showcase -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-semibold flex items-center gap-2">
                ✨ Disco Color: <code class="text-purple-500">gradient-disco</code>
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Purple → Pink → Red gradient badge
              </p>
            </div>
          </div>
        </template>
        
        <div class="space-y-6">
          <!-- All Variants -->
          <div
            v-for="variant in variants"
            :key="variant"
            class="space-y-2"
          >
            <h3 class="text-sm font-semibold uppercase text-gray-500">
              {{ variant }}
            </h3>
            <div class="flex flex-wrap items-center gap-3">
              <UBadge
                v-for="size in sizes"
                :key="size"
                color="gradient-disco"
                :variant="variant"
                :size="size"
                :label="`${variant} - ${size}`"
              />
            </div>
          </div>

          <!-- With Icons -->
          <div class="space-y-2">
            <h3 class="text-sm font-semibold uppercase text-gray-500">
              With Icons
            </h3>
            <div class="flex flex-wrap gap-3">
              <UBadge
                color="gradient-disco"
                variant="solid"
                leading-icon="i-lucide-sparkles"
                label="Premium"
              />
              <UBadge
                color="gradient-disco"
                variant="solid"
                leading-icon="i-lucide-crown"
                label="VIP"
              />
              <UBadge
                color="gradient-disco"
                variant="outline"
                leading-icon="i-lucide-star"
                label="Featured"
              />
              <UBadge
                color="gradient-disco"
                variant="soft"
                leading-icon="i-lucide-fire"
                label="Hot"
              />
            </div>
          </div>
        </div>

        <template #footer>
          <UCodeBlock
            lang="vue"
            code='<UBadge color="gradient-disco" variant="solid" label="Premium" />'
            class="text-xs"
          />
        </template>
      </UCard>

      <!-- All Colors & Variants -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold">
            🎨 All Colors & Variants Matrix
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Semua kombinasi color dan variant (termasuk gradient-disco)
          </p>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="variant in variants"
            :key="variant"
            class="space-y-2"
          >
            <h3 class="text-sm font-semibold uppercase text-gray-500">
              {{ variant }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="color in colors"
                :key="color"
                :color="color"
                :variant="variant"
                :label="color"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Sizes -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold">
            📏 Size Variants
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Semua ukuran badge yang tersedia
          </p>
        </template>
        
        <div class="flex flex-wrap items-center gap-3">
          <UBadge
            v-for="size in sizes"
            :key="size"
            :size="size"
            :label="size.toUpperCase()"
            color="primary"
            variant="solid"
          />
        </div>
      </UCard>

      <!-- With Icons -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold">
            ✨ With Icons
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Badge dengan leading dan trailing icons
          </p>
        </template>
        
        <div class="space-y-4">
          <!-- Leading Icons -->
          <div class="space-y-2">
            <h3 class="text-sm font-medium">
              Leading Icons
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                leading-icon="i-lucide-heart"
                label="Favorite"
                color="error"
              />
              <UBadge
                leading-icon="i-lucide-star"
                label="Featured"
                color="warning"
              />
              <UBadge
                leading-icon="i-lucide-fire"
                label="Trending"
                color="error"
                variant="solid"
              />
              <UBadge
                leading-icon="i-lucide-crown"
                label="Premium"
                color="gradient-disco"
                variant="solid"
              />
            </div>
          </div>

          <!-- Trailing Icons -->
          <div class="space-y-2">
            <h3 class="text-sm font-medium">
              Trailing Icons
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                label="External"
                trailing-icon="i-lucide-external-link"
                color="info"
              />
              <UBadge
                label="Download"
                trailing-icon="i-lucide-download"
                color="success"
              />
              <UBadge
                label="New"
                trailing-icon="i-lucide-sparkles"
                color="gradient-disco"
                variant="solid"
              />
            </div>
          </div>

          <!-- Both Icons -->
          <div class="space-y-2">
            <h3 class="text-sm font-medium">
              Both Icons
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                leading-icon="i-lucide-trophy"
                label="Award Winner"
                trailing-icon="i-lucide-star"
                color="gradient-disco"
                variant="solid"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Genre Tags Example -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold">
            🏷️ Genre Tags (Real Use Case)
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Contoh penggunaan untuk genre anime
          </p>
        </template>
        
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="genre in sampleGenres"
            :key="genre"
            :label="genre"
            size="sm"
            variant="soft"
            color="primary"
          />
        </div>
      </UCard>

      <!-- Real World Example -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold">
            🎯 Real World Example
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Contoh penggunaan di anime card
          </p>
        </template>
        
        <div class="space-y-4">
          <!-- Anime Card Mock -->
          <div class="border dark:border-gray-700 rounded-lg p-4 space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-lg">
                  Demon Slayer: Kimetsu no Yaiba
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  鬼滅の刃
                </p>
              </div>
              <UBadge
                label="9.2"
                size="lg"
                variant="solid"
                color="warning"
                leading-icon="i-lucide-star"
              />
            </div>

            <!-- Status & Info -->
            <div class="flex flex-wrap gap-2">
              <UBadge label="Completed" color="success" leading-icon="i-lucide-check-circle" />
              <UBadge label="Spring" color="success" leading-icon="i-lucide-flower-2" />
              <UBadge label="2019" color="neutral" leading-icon="i-lucide-calendar-days" />
              <UBadge
                label="26 Episodes"
                leading-icon="i-lucide-film"
                variant="outline"
                color="neutral"
              />
            </div>

            <!-- Genres -->
            <div class="flex flex-wrap gap-2">
              <UBadge label="Action" color="primary" size="sm" />
              <UBadge label="Adventure" color="primary" size="sm" />
              <UBadge label="Fantasy" color="primary" size="sm" />
              <UBadge label="Supernatural" color="primary" size="sm" />
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <UBadge
                label="Trending"
                leading-icon="i-lucide-fire"
                color="gradient-disco"
                variant="solid"
                size="xs"
              />
              <UBadge
                label="Award Winner"
                leading-icon="i-lucide-trophy"
                color="gradient-disco"
                variant="solid"
                size="xs"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Disco Styling Examples -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold">
            🎨 Disco Styling (via class prop)
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Override styles menggunakan class prop
          </p>
        </template>
        
        <div class="flex flex-wrap gap-3">
          <UBadge
            label="Rounded Full"
            class="rounded-full"
          />
          <UBadge
            label="Bold Font"
            class="font-bold"
          />
          <UBadge
            label="Shadow"
            class="shadow-lg"
            variant="solid"
          />
          <UBadge
            label="Gradient Disco"
            color="gradient-disco"
            variant="solid"
          />
          <UBadge
            label="Gradient Megatron"
            color="gradient-megatron"
            variant="solid"
          />
          <UBadge
            label="Gradient Tranquil"
            color="gradient-tranquil"
            variant="solid"
          />
          <UBadge
            label="Gradient Maldives"
            color="gradient-maldives"
            variant="solid"
          />
          <UBadge
            label="Gradient Oceanic"
            color="gradient-oceanic"
            variant="solid"
          />
          <UBadge
            label="Gradient Martini"
            color="gradient-martini"
            variant="solid"
          />
          <UBadge
            label="Gradient Arctic"
            color="gradient-arctic"
            variant="solid"
          />
          <UBadge
            label="Gradient Cloudy"
            color="gradient-cloudy"
            variant="solid"
          />
          <UBadge
            label="Gradient Sky"
            color="gradient-sky"
            variant="solid"
          />
          <UBadge
            label="Gradient Cactus"
            color="gradient-cactus"
            variant="solid"
          />
          <UBadge
            label="Gradient Limeade"
            color="gradient-limeade"
            variant="solid"
          />
          <UBadge
            label="Gradient Fresco"
            color="gradient-fresco"
            variant="solid"
          />
          <UBadge
            label="Gradient Delicate"
            color="gradient-delicate"
            variant="solid"
          />
          <UBadge
            label="Gradient Blossom"
            color="gradient-blossom"
            variant="solid"
          />
        </div>
      </UCard>

      <!-- Documentation Link -->
      <UCard>
        <div class="text-center space-y-4">
          <p class="text-gray-600 dark:text-gray-400">
            📖 Dokumentasi lengkap custom Badge theme
          </p>
          <div class="flex flex-col gap-2 items-center">
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
              theme/badge.ts
            </code>
            <code class="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
              app.config.ts
            </code>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<style scoped>
/* Optional: Additional custom styles */
</style>
