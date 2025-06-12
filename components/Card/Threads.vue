<script setup lang="ts">
defineProps<{
  image?: string;
  author?: string;
  description?: string;
  title?: string;
  timestamp?: string;
  avatar?: string;
  class?: string;
}>();
</script>

<template>
  <div class="flex items-start bg-gray-800 text-white rounded-md w-full max-w-xl overflow-hidden shadow-lg h-[136px]">
    <div class="flex items-start self-center text-white p-4 rounded-md w-full h-full">
      <!-- Content -->
      <div class="flex-1 flex flex-col justify-between h-full">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm hover:text-blue-300 hover:underline cursor-pointer">
              {{ description || 'Desc' }}
            </p>
          </div>
          <span class="text-xs text-gray-500 whitespace-nowrap">
            {{ timestamp || 'Just now' }}
          </span>
        </div>
  
        <!-- Avatar and Icons -->
        <div class="flex justify-between items-center">
          <figure class="flex flex-row items-center justify-center gap-x-2 w-auto h-6">
            <img
              :src="avatar || 'https://www.thebluespace.com.au/cdn/shop/products/28006_p766910W_BK_Image_HeroImag.jpg?v=1571272525&width=600'"
              :alt="author || 'Avatar'"
              class="w-full h-full object-contain">
              
              <template v-if="author">
                <figcaption class="text-sm text-blue-400 font-semibold mb-1">
                  {{ author || 'Avatar' }}
                </figcaption>
              </template>
              
              <template v-if="timestamp">
                <span class="text-xs text-gray-500 whitespace-nowrap">
                  {{ timestamp || 'Just now' }}
                </span>
              </template>
          </figure>
  
          <div class="flex gap-x-3 text-gray-400">
            <Icon name="uil:eye" class="!w-[1.25rem] !h-[1.25rem] text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer" />
            <Icon name="uil:comments" class="!w-[1.25rem] !h-[1.25rem] hover:text-blue-500 transition-colors duration-200 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
