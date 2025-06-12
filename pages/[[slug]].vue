<script setup lang="ts">
definePageMeta({
  layout: 'details'
})
</script>

<template>
  <div class="container flex flex-col w-full h-full">
    <div class="flex flex-col md:flex-row w-full gap-4">
      <PlaygroundDetailsSidebar class="w-full md:w-[25%] min-w-0 md:min-w-[200px] md:max-w-[300px] flex-none" />
      <PlaygroundTabs class="w-full md:w-[70%] flex-1 min-h-[600px] order-first md:order-last" />
    </div>
    <template v-if="$route.params.slug">
      Slug: {{ $route.params.slug }}
    </template>
  </div>
</template>