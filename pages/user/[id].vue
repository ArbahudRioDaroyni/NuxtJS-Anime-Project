<template>
  <V1Container variant="fluid" margin="xl" tag="section">
    <h1>User ID: {{ id }}</h1>
  </V1Container>
</template>

<script setup lang="ts">

const route = useRoute()
const id = route.params.id
</script>