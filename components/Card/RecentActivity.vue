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
    <div class="flex items-start bg-gray-800 text-white rounded-md w-full max-w-xl overflow-hidden shadow-lg min-h-[136px]">
        <!-- Image -->
        <template v-if="image">
          <figure class="h-full">
            <AtomsResponsiveImage
              :src="image || ''"
              :alt="author || 'Recent Activity Image'"
              :width="136"
              :height="92"
              format="webp"
              class="w-auto h-full object-cover"
            />
          </figure>
        </template>

        <div class="flex items-start self-center text-white p-4 rounded-md w-full h-full">
          <!-- Content -->
          <div class="flex-1 flex justify-between flex-col gap-y-4 h-full">
            <div class="flex justify-between items-start">
              <div>
                <template v-if="author">
                  <h2 class="text-sm text-blue-400 font-semibold">
                      {{ author || 'Anonymous' }}
                  </h2>
                </template>
              </div>
              <span class="text-xs text-gray-500 whitespace-nowrap">
                {{ timestamp || 'Just now' }}
							</span>
            </div>

            <p class="text-sm text-gray-300">
              {{ description || 'Desc' }}:
              <template v-if="title">
                <span class="text-blue-300 hover:underline cursor-pointer">
                  {{ title || 'Untitled' }}
                </span>
              </template>
            </p>
      
            <!-- Avatar and Icons -->
            <div class="flex justify-between items-center">
							<figure class="w-6 h-6">
								<img
									:src="avatar || 'https://www.thebluespace.com.au/cdn/shop/products/28006_p766910W_BK_Image_HeroImag.jpg?v=1571272525&width=600'"
									:alt="author || 'Avatar'"
									class="w-full h-full object-contain">
							</figure>
      
              <div class="flex gap-x-3 text-gray-400">
                <Icon name="uil:comment" class="!w-[1.25rem] !h-[1.25rem] hover:text-blue-500 transition-colors duration-200 cursor-pointer" />
                <Icon name="uil:heart" class="!w-[1.25rem] !h-[1.25rem] text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
