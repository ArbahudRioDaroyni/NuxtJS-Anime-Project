<template>
  <div class="flex flex-col items-center justify-center gap-[4rem]">
    <h1 class="text-2xl font-bold">List Components</h1>
    <p class="text-gray-600">This page demonstrates the use of various components in a list format.</p>

    <NuxtImg
      src="/image/test.jpg"
      alt="Banner"
      height="200"
      sizes="(max-width: 768px) 100vw, 1200px"
      loading="lazy"
      format="webp"
      class="w-full object-cover md:aspect-[5/1] aspect-[2/1] shadow-lg"
    />
  
    <OrganismsDetailsAnimeHeaderCard
        image="https://www.thebluespace.com.au/cdn/shop/products/28006_p766910W_BK_Image_HeroImag.jpg?v=1571272525&width=600"
        title="Kimetsu no Yaiba: Mugenjou-hen"
        subtitle="The All-Out War Begins."
        description="Theatrical trilogy adaptation of the Infinity Castle Arc."
      />

    <MoleculesNotFoundImages
      class="w-full max-w-2xl"
      title="No Images Found"
      description="We couldn't find any images matching your search criteria."
      :height="300"
      :width="300"
    />

    <AtomsButtonIcon title="Save" class="bg-black hover:bg-gray-800 active:border active:border-gray-600 fill-black-500 hover:fill-white active:fill-gray-600">
      <Icon name="uil:github" class="!w-[1.5rem] !h-[1.5rem] text-white" />
    </AtomsButtonIcon>

    <OrganismsCardRecentActivity
      image="https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx178788-ePmnABYuFdcE.png"
      username="TinaTangy"
      proggress="Plans to watch"
      title="Kimetsu no Yaiba: Mugenjou-hen"
      timeAgo="56 minutes ago"
      avatar="https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png"
      class="w-full max-w-2xl"
    />
  </div>

  <div class="viewer">
  </div>
</template>

<style scoped>
  .viewer {
    height: 200vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script setup lang="ts">
// Halaman ini hanya contoh statis, tidak ada logic khusus
</script>