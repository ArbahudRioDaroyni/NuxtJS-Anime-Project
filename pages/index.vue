<script setup lang="ts">
import { UICardDarkNeomorpisme } from '#components';

definePageMeta({
  layout: 'no-navigation'
})
</script>

<template>
    <!-- middle item list center -->
    <section class="container flex flex-col w-full h-full items-center justify-center gap-4">
      <Search />
      <p class="mt-5">Hello, this is the home page!</p>
      <UICardNeon />
      <UICardDarkNeomorpisme />
      <UICardStatistic />
      <UICardStatistic2 />
      <UICardStatistic3 />
      <UICardStatistic4 />
      <UICardStatistic5 />
      <UICardPlay />
      <UISearchInput />
    </section>
</template>