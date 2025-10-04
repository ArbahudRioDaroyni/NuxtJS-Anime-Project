<template>
  <section class="filter--container">
    <div class="filter--group">
      <label for="search-filter">Search</label>
      <div>
        <V1Input
          id="search-filter"
          v-model="search"
          name="search-filter"
          placeholder="Search by title"
        />
        <V1Button variant="outer">Search {{ search ? ': ' + search : '' }}</V1Button>
      </div>
    </div>
    <V1Select
      v-model="selectedGenres"
      label="Genres"
      :options="[
        { label: 'Action', value: 'action' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'Comedy', value: 'comedy' },
        { label: 'Drama', value: 'drama' },
        { label: 'Fantasy', value: 'fantasy' },
        { label: 'Horror', value: 'horror' },
        { label: 'Mystery', value: 'mystery' },
        { label: 'Romance', value: 'romance' },
        { label: 'Sci-Fi', value: 'sci-fi' },
        { label: 'Slice of Life', value: 'slice-of-life' },
        { label: 'Sports', value: 'sports' },
        { label: 'Supernatural', value: 'supernatural' }
      ]"
    />
    <V1Select
      v-model="selectedYear"
      label="Years"
      :options="[
        { label: '2024', value: '2024' },
        { label: '2023', value: '2023' },
        { label: '2022', value: '2022' },
        { label: '2021', value: '2021' }
      ]"
    />
    <V1Select
      v-model="selectedSeasons"
      label="Seasons"
    >
      <option>Winter</option>
      <option>Spring</option>
      <option>Summer</option>
      <option>Fall</option>
    </V1Select>
    <V1Button variant="outer" size="md" icon="heroicons:adjustments-horizontal-16-solid" />
  </section>
</template>

<script setup lang="ts">
const search = ref('');
const selectedGenres = ref<string | string[]>('');
const selectedYear = ref<string | string[]>('');
const selectedSeasons = ref<string | string[]>('');
</script>

<style lang="scss" scoped>
.filter {
  &--container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    margin-bottom: 1rem;
    padding: 1rem 0;
    gap: 1.5rem;
  }

  &--group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 600px;

    label {
      font-weight: 600;
      margin-bottom: 0.25rem;
      display: block;
    }

    div {
      display: flex;
      gap: 0.5rem;

      .base-input {
        flex: 1;
      }

      .base-button {
        white-space: nowrap;
      }
    }
  }
}
</style>
