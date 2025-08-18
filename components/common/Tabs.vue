<script setup lang="ts">
import { ref, type Component } from 'vue'

defineProps<{
  tabs: Array<{
    label: string
    component: Component,
    content?: object | Array<object>
  }>
}>()

const selectedTab = ref(0)
function selectTab(index: number) {
  selectedTab.value = index
}
</script>

<template>
  <div class="tabs">
    <ul class="tablist">
      <li
        v-for="(tab, index) in tabs"
        :key="tab.label"
        :class="{ active: selectedTab === index }"
        @click="selectTab(index)"
      >
        {{ tab.label }}
      </li>
    </ul>
    <div class="tab-content">
      <keep-alive>
        <component :is="tabs[selectedTab]?.component" :data="tabs?.[selectedTab]?.content ?? {}" />
      </keep-alive>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  color: #ccc;
}

.tablist {
  display: flex;
  justify-content: center;
  justify-items: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid #2b2b2b;
}

.tablist li {
  cursor: pointer;
  position: relative;
  padding-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.tablist li:hover {
  color: #fff;
}

.tablist li.active {
  color: #ffffff;
  font-weight: 600;
}

.tablist li.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: #2aa9ff;
}

.tab-content {
  min-height: 5rem;
  margin-top: 1rem;
}
</style>