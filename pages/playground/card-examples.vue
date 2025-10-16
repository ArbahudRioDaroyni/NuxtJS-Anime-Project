<script lang="ts" setup>
const cardExamples = [
  { variant: 'solid', title: 'Solid Card', description: 'Default variant tanpa efek shadow' },
  { variant: 'outline', title: 'Outline Card', description: 'Default variant dengan outline' },
  { variant: 'soft', title: 'Soft Card', description: 'Default variant dengan efek soft shadow' },
  { variant: 'subtle', title: 'Subtle Card', description: 'Default variant dengan efek subtle shadow' },
  { variant: 'neumorphic-outline', title: 'Outline Card', description: 'Default variant dengan outline' },
  { variant: 'neumorphic-inner', title: 'Inner Card', description: 'Variant dengan efek dalam (inner shadow)' },
  { variant: 'neumorphic-outer', title: 'Outer Card', description: 'Variant dengan efek luar (outer shadow)' }
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
      <UCard variant="neumorphic-outline">
        <p class="text-sm opacity-80">Card Custom Variants</p>
      </UCard>
      <UCard variant="neumorphic-inner">
        <p class="text-sm opacity-80">Card Custom Variants</p>
      </UCard>
      <UCard variant="neumorphic-outer">
        <p class="text-sm opacity-80">Card Custom Variants</p>
      </UCard>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="example in cardExamples"
        :key="example.variant"
        :variant="(example.variant as any)"
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
  </div>
</template>

<style scoped>
/* Additional styles jika diperlukan */
</style>
