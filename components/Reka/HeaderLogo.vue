<template>
  <div class="flex items-center">
    <NuxtLink
      to="/"
      class="flex items-center space-x-2 transition-all duration-300"
      :class="{ 'scale-90': !isTransparent }"
    >
      <!-- Logo Icon -->
      <div
        class="relative transition-all duration-300"
        :class="{ 'w-8 h-8': !isTransparent, 'w-10 h-10': isTransparent }"
      >
        <NuxtImg
          src="/icon.svg"
          alt="AniWorld"
          class="w-full h-full object-contain drop-shadow-lg transition-all duration-300"
          :class="{ 'opacity-80': !isTransparent }"
        />
        <div
          v-show="isTransparent"
          class="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"
        />
      </div>

      <!-- Logo Text -->
      <div class="flex flex-col">
        <h1
          class="font-bold text-white drop-shadow-lg transition-all duration-300"
          :class="{
            'text-lg': !isTransparent,
            'text-xl': isTransparent,
            'text-primary-700': !isTransparent
          }"
        >
          AniWorld
        </h1>
        <span
          v-show="isTransparent"
          class="text-xs text-white/80 transition-all duration-300"
          :class="{
            'text-primary-500': !isTransparent,
            'opacity-0 scale-75': !isTransparent,
            'opacity-100 scale-100': isTransparent
          }"
        >
          Streaming Portal
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isTransparent?: boolean
  isHidden?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isTransparent: true,
  isHidden: false
})

const { isTransparent } = toRefs(props)
</script>