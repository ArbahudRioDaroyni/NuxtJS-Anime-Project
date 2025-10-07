<template>
  <LayoutDefault>
    <slot />
  </LayoutDefault>
</template>

<style>
html {
  background-color: hsl(from var(--primary-color) h s 10%);
  color: hsl(from var(--primary-color) h s 90%);
  transition: all .2s ease-in-out;
}
</style>