<template>
  <div class="min-h-screen flex flex-1 w-full flex-col">
    <slot />
  </div>
</template>

<style>
html {
  background-color: var(--color-level-10);
  color: var(--color-level-90);
  transition: all .2s ease-in-out;
}
</style>