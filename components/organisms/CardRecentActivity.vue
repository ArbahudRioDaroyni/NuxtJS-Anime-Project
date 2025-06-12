<script setup lang="ts">
defineProps<{
  image?: string;
  user?: string;
  author?: string;
  description?: string;
  title?: string;
  timeAgo?: string;
  avatar?: string;
  class?: string;
}>();
</script>

<template>
    <div class="flex items-start bg-gray-900 text-white rounded-md w-full max-w-xl overflow-hidden shadow-lg">
        <!-- Image -->
        <template v-if="image">
          <figure class="h-[136px] min-w-[92px] w-[92px] flex-shrink-0">
            <AtomsResponsiveImage
              :src="image || ''"
              :alt="user || 'Activity Image'"
              :width="136"
              :height="92"
              format="webp"
              class="w-full h-full object-cover"
            />
          </figure>
        </template>

        <div class="flex items-start self-center text-white p-4 rounded-md w-full">
          <!-- Content -->
          <div class="flex-1 flex flex-col gap-y-4">
            <div class="flex justify-between items-start">
              <div>
                <template v-if="user">
                  <h2 class="text-blue-400 font-semibold mb-1">
                      {{ user || 'Anonymous' }}
                  </h2>
                </template>
                <p class="text-sm text-gray-300">
                  {{ description || 'Desc' }}:
                  <template v-if="title">
                    <span class="text-blue-300 hover:underline cursor-pointer">
                      {{ title || 'Untitled' }}
                    </span>
                  </template>
                </p>
              </div>
              <span class="text-xs text-gray-500 whitespace-nowrap">
								{{ timeAgo || 'Just now' }}
							</span>
            </div>
      
            <!-- Avatar and Icons -->
            <div class="flex justify-between items-center">
							<figure class="w-6 h-6">
								<img
									:src="avatar || 'https://www.thebluespace.com.au/cdn/shop/products/28006_p766910W_BK_Image_HeroImag.jpg?v=1571272525&width=600'"
									:alt="user || 'Avatar'"
									class="w-full h-full object-contain">
							</figure>
      
              <div class="flex gap-x-3 text-gray-400">
                <Icon name="uil:comment" class="!w-[1.5rem] !h-[1.5rem] hover:text-blue-500 transition-colors duration-200 cursor-pointer" />
                <Icon name="uil:heart" class="!w-[1.5rem] !h-[1.5rem] text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
