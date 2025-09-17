<template>
  <div>
    <NuxtLoadingIndicator color="var(--color-level-50)" />
    <CommonHeader />
    <slot />
    <CommonFooter />
  </div>
</template>

<style>
html {
  background-color: var(--color-level-10);
  color: var(--color-level-90);
  transition: all .2s ease-in-out;
}
</style>