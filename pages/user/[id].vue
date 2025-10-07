<template>
  <V1Container class="staff-profile-page" tag="section" aria-label="Anime Filters" margin="xl">
    <h1>User ID: {{ id }}</h1>
    <UAlert 
      title="This is a banner with an important message."
      color="primary"
      variant="solid"
    />
  </V1Container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>