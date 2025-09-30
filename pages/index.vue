<script setup lang="ts">
import { UICardDarkNeomorpisme } from '#components';
</script>

<template>
    <!-- middle item list center -->
    <section class="container flex flex-col w-full h-full items-center justify-center gap-4">
      <Search />
      <V1Card variant="outer">
        <h1 class="text-2xl font-bold">Welcome to AniWorld</h1>
      </V1Card>
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