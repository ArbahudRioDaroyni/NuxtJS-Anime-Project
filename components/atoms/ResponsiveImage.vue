<script setup lang="ts">
defineProps<{
  src: string,
  alt?: string | string[] | undefined,
  width?: number,
  height?: number,
  sizes?: string,
  placeholder?: "blur" | "empty",
  customClass?: string,
  format?: "webp" | "avif" | "jpg" | "png"
  // modifiers?: "{ grayscale: true, tint: "#000" }"
  // placeholder-class?: "grayscale"
}>();
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="Array.isArray(alt) ? alt.join(', ') : (alt || 'Image')"
    :width="width"
    :height="height"
    :sizes="sizes || '100vw xs:320px sm:640px md:768px lg:1024px xl:1280px xxl:1536px 2xl:1536px'"
    densities="x1 x2"
    :format="format"
    loading="lazy"
    decoding="async"
    :placeholder="[(width ?? 100)/5, (height ?? 100)/5, 75, 5]"
    :class="customClass"
  />
</template>
