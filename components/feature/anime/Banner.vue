<template>
  <BaseImageResponsive
    src="/image/test.jpg"
    :alt="$route.params.slug"
    :height="200"
    :width="1200"
    class="banner-img w-[100%]"
  />
</template>