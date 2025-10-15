<script setup lang="ts">
// Contoh data untuk demonstrasi
const cardExamples = [
  { variant: 'outline', title: 'Outline Card', description: 'Default variant dengan outline' },
  { variant: 'glass', title: 'Glass Card', description: 'Glassmorphism effect' },
  { variant: 'gradient-border', title: 'Gradient Border', description: 'Card dengan border gradient' },
  { variant: 'elevated', title: 'Elevated Card', description: 'Card dengan shadow yang lebih tinggi' },
  { variant: 'neon', title: 'Neon Card', description: 'Card dengan neon glow effect' },
  { variant: 'gradient-primary', title: 'Gradient Primary', description: 'Background gradient primary' },
  { variant: 'interactive', title: 'Interactive Card', description: 'Card dengan hover effects' },
  { variant: 'neumorphic', title: 'Neumorphic Card', description: 'Neumorphic design style' }
]
</script>

<template>
  <div class="p-8 space-y-8 mt-[5rem]">
    <div>
      <h1 class="text-3xl font-bold mb-2">Card Custom Variants</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Contoh penggunaan berbagai variant Card yang sudah dikustomisasi
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard variant="neumorphic">
        <div class="flex flex-row items-center justify-center align-middle gap-4">
          <div class="basis-1/4">
            <NuxtImg
              src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/nx466-bVP54I7dCB2F.jpg"
              alt="Anime Cover"
              class="w-full h-auto rounded"
            />
          </div>
          <div class="basis-3/4">
            <p class="text-2xl font-bold">89</p>
            <p class="text-sm opacity-80">Comments</p>
          </div>
        </div>
      </UCard>
      <UCard variant="neumorphic">
        <div class="flex flex-row">
          <div class="basis-1/4">
            <p class="text-2xl font-bold">1.2k</p>
            <p class="text-sm opacity-80">Views</p>
          </div>
          <div class="basis-3/4">
            <p class="text-2xl font-bold">89</p>
            <p class="text-sm opacity-80">Comments</p>
          </div>
        </div>
      </UCard>
      <UCard variant="neumorphic">
        <div class="flex flex-row">
          <div class="basis-1/4">
            <p class="text-2xl font-bold">1.2k</p>
            <p class="text-sm opacity-80">Views</p>
          </div>
          <div class="basis-3/4">
            <p class="text-2xl font-bold">89</p>
            <p class="text-sm opacity-80">Comments</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Grid layout untuk menampilkan berbagai variant -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="example in cardExamples"
        :key="example.variant"
        :variant="example.variant as any"
      >
        <template #header>
          <h3 class="font-semibold text-lg">{{ example.title }}</h3>
        </template>

        <p class="text-sm opacity-90">
          {{ example.description }}
        </p>

        <template #footer>
          <div class="flex justify-between items-center">
            <UBadge :variant="'soft'" color="primary" size="sm">
              {{ example.variant }}
            </UBadge>
            <UButton variant="ghost" size="xs">
              Action
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Contoh dengan size variants -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">Size Variants</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard variant="outline" size="xs">
          <template #header>
            <h4 class="font-semibold">Extra Small</h4>
          </template>
          <p class="text-sm">Card dengan size xs</p>
        </UCard>

        <UCard variant="outline" size="sm">
          <template #header>
            <h4 class="font-semibold">Small</h4>
          </template>
          <p class="text-sm">Card dengan size sm</p>
        </UCard>

        <UCard variant="outline" size="md">
          <template #header>
            <h4 class="font-semibold">Medium (Default)</h4>
          </template>
          <p class="text-sm">Card dengan size md</p>
        </UCard>

        <UCard variant="outline" size="lg">
          <template #header>
            <h4 class="font-semibold">Large</h4>
          </template>
          <p class="text-sm">Card dengan size lg</p>
        </UCard>

        <UCard variant="outline" size="xl">
          <template #header>
            <h4 class="font-semibold">Extra Large</h4>
          </template>
          <p class="text-sm">Card dengan size xl</p>
        </UCard>
      </div>
    </div>

    <!-- Contoh dengan rounded variants -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">Rounded Variants</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UCard variant="elevated" rounded="none">
          <template #header>
            <h4 class="font-semibold">No Rounded</h4>
          </template>
          <p class="text-sm">rounded-none</p>
        </UCard>

        <UCard variant="elevated" rounded="md">
          <template #header>
            <h4 class="font-semibold">Medium</h4>
          </template>
          <p class="text-sm">rounded-md</p>
        </UCard>

        <UCard variant="elevated" rounded="xl">
          <template #header>
            <h4 class="font-semibold">Extra Large</h4>
          </template>
          <p class="text-sm">rounded-xl</p>
        </UCard>

        <UCard variant="elevated" rounded="3xl">
          <template #header>
            <h4 class="font-semibold">3XL</h4>
          </template>
          <p class="text-sm">rounded-3xl</p>
        </UCard>
      </div>
    </div>

    <!-- Contoh kombinasi dengan content -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">Real World Examples</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- User Profile Card -->
        <UCard variant="elevated" size="lg">
          <template #header>
            <div class="flex items-center gap-4">
              <UAvatar
                src="https://i.pravatar.cc/150?img=1"
                alt="User Avatar"
                size="md"
              />
              <div>
                <h3 class="font-semibold">John Doe</h3>
                <p class="text-sm text-gray-500">Software Engineer</p>
              </div>
            </div>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            Passionate about building scalable web applications with Vue.js and Nuxt.
          </p>

          <template #footer>
            <div class="flex gap-2">
              <UButton variant="solid" size="sm" class="flex-1">
                Follow
              </UButton>
              <UButton variant="outline" size="sm" class="flex-1">
                Message
              </UButton>
            </div>
          </template>
        </UCard>

        <!-- Stats Card -->
        <UCard variant="gradient-primary" size="lg">
          <template #header>
            <h3 class="font-semibold text-white">Monthly Statistics</h3>
          </template>

          <div class="grid grid-cols-3 gap-4 text-white">
            <div>
              <p class="text-2xl font-bold">1.2k</p>
              <p class="text-sm opacity-80">Views</p>
            </div>
            <div>
              <p class="text-2xl font-bold">342</p>
              <p class="text-sm opacity-80">Likes</p>
            </div>
            <div>
              <p class="text-2xl font-bold">89</p>
              <p class="text-sm opacity-80">Comments</p>
            </div>
          </div>

          <template #footer>
            <UButton variant="soft" color="neutral" size="sm" block>
              View Details
            </UButton>
          </template>
        </UCard>

        <!-- Notification Card -->
        <UCard variant="neon">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">New Notification</h3>
              <UBadge color="error" variant="solid" size="sm">3</UBadge>
            </div>
          </template>

          <div class="space-y-2">
            <p class="text-sm">You have 3 new messages</p>
            <p class="text-xs text-gray-500">2 minutes ago</p>
          </div>

          <template #footer>
            <UButton variant="link" size="sm" class="p-0">
              Mark as read
            </UButton>
          </template>
        </UCard>

        <!-- Interactive Card -->
        <UCard variant="interactive">
          <template #header>
            <h3 class="font-semibold">Click me!</h3>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            This card has interactive hover effects. Try hovering over it!
          </p>

          <template #footer>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Interactive</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <!-- Contoh tanpa header/footer -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">Simple Cards (Body Only)</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard variant="soft">
          <p class="text-sm">Card dengan hanya body, tanpa header dan footer</p>
        </UCard>

        <UCard variant="glass">
          <p class="text-sm">Glass effect card, perfect untuk modern UI</p>
        </UCard>

        <UCard variant="bordered">
          <p class="text-sm">Simple bordered card dengan minimal styling</p>
        </UCard>
      </div>
    </div>

    <!-- Code Example -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">Usage Example</h2>
      
      <UCard variant="dark">
        <template #header>
          <h3 class="font-semibold">Code Example</h3>
        </template>

        <pre class="text-xs overflow-x-auto"><code>&lt;UCard variant="glass" size="lg" rounded="xl"&gt;
  &lt;template #header&gt;
    &lt;h3&gt;Card Title&lt;/h3&gt;
  &lt;/template&gt;

  &lt;p&gt;Card content goes here&lt;/p&gt;

  &lt;template #footer&gt;
    &lt;UButton&gt;Action&lt;/UButton&gt;
  &lt;/template&gt;
&lt;/UCard&gt;</code></pre>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles jika diperlukan */
</style>
