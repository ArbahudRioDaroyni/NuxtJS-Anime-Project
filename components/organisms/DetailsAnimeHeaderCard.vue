<template>
  <div class="text-white rounded-lg overflow-hidden flex flex-col md:flex-row max-w-4xl shadow-lg">
    <!-- Poster -->
    <img
      :src="image"
      :alt="title"
      class="w-full md:w-1/3 object-cover"
    />

    <!-- Info Section -->
    <div class="p-6 flex flex-col justify-between md:w-2/3">
      <div>
        <h2 class="text-xl md:text-2xl font-semibold mb-2">{{ title }}</h2>
        <p class="text-sm italic text-blue-300 mb-2">{{ subtitle }}</p>
        <p class="text-sm text-gray-300 leading-relaxed">{{ description }}</p>
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex items-center gap-3">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Add to List
        </button>
        <button class="text-red-500 hover:text-red-600 text-xl">
          ❤️
        </button>
        <span class="text-sm text-gray-400 underline ml-auto cursor-pointer">Overview</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  title: string
  subtitle?: string
  description?: string
}>()
</script>