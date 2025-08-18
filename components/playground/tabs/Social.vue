<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Recent Activity Column -->
    <div>
      <h2 class="mb-2">Recent Activity</h2>
      <CardRecentActivity
        image="https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx178788-ePmnABYuFdcE.png"
        author="TinaTangy"
        description="Plans to watch"
        title="Kimetsu no Yaiba: Mugenjou-hen"
        timestamp="56 minutes ago"
        avatar="https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png"
      />
    </div>
    <!-- Thread Column -->
    <div>
      <h2 class="mb-2">Thread</h2>
      <CardThreads
        author="TinaTangy"
        description="Demon Slayer Infinity Castle movie 1 releases On July 18 in Japan and September 12 in Worldwide"
        timestamp="56 minutes ago"
        avatar="https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png"
      />
    </div>
  </div>
</template>
