<template>
  <main>
    <AtomsResponsiveImage
      src="/image/test.jpg"
      alt="Banner"
      :height="200"
      :width="1200"
      sizes="xs:480px md:768px lg:1024"
      loading="lazy"
      class="banner-img"
    />

    <header class="header-section">
      <div class="header-container">
        <div class="header-content">
          <!-- Poster -->
          <NuxtImg
            src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx149118-AOQb0xuTssGl.jpg"
            alt="Title"
            class="poster-img"
          />

          <!-- Info -->
          <div class="info-section">
            <h2 class="title">{{ title }}</h2>
            <p class="subtitle">{{ subtitle }}</p>
            <p class="description">{{ description }}</p>
            <p class="source">(Source: {{ source }})</p>

            <!-- Buttons -->
            <div class="button-group">
              <button class="add-button">Add to List</button>
              <button class="like-button">❤</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <PlaygroundTabs />
  </main>
</template>

<script setup>
const title = 'Enen no Shouboutai: San no Shou'
const subtitle = 'The third season of Enen no Shouboutai.'
const description = `Shinra and the team are about to uncover the world’s greatest secret. But just as the other Special Fire Force Companies unite to face the looming disaster, Obi is captured by the Tokyo Imperial Army, and Company 8 is branded as traitors. Hunted by the Empire, they must fight alone to rescue Obi and stop the Evangelist—all while a new assassin and the corrupt Captain Burns block their path.`
const source = 'Crunchyroll'
</script>

<style>
.banner-img {
  width: 100%;
  object-fit: cover;
  aspect-ratio: 2 / 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .banner-img {
    aspect-ratio: 4 / 1;
  }
}

.header-section {
  background-color: #0D1B2A;
  padding: 0;
  margin: 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 10;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
  }
}

.poster-img {
  max-width: 250px;
  height: auto;
  border-radius: 4px;
}

.info-section {
  flex: 1;
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #fff;
}

.subtitle {
  font-size: 0.9rem;
  font-style: italic;
  color: #ccc;
  margin-bottom: 16px;
}

.description {
  font-size: 1rem;
  color: #ddd;
  line-height: 1.6;
}

.source {
  font-size: 0.85rem;
  color: #999;
  margin-top: 16px;
}

.button-group {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-button {
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #1e40af;
}

.like-button {
  font-size: 24px;
  color: #f87171;
  background: none;
  border: none;
  cursor: pointer;
}

.like-button:hover {
  color: #ef4444;
}
</style>
