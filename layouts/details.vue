<template>
  <div class="min-h-screen flex flex-1 w-full flex-col">
    <OrganismsHeaderNavigation />
    <PlaygroundDetailsBanner class="w-full" />
    <slot />
    <OrganismsFooterNavigation />
  </div>
</template>