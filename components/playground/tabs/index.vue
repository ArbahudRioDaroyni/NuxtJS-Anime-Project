<template>
  <div class="tabs">
    <ul class="tablist flex justify-center items-center">
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
        <component :is="tabs[selectedTab].component" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// Gunakan defineAsyncComponent untuk lazy loading
const tabs = [
  { label: 'Overview', component: defineAsyncComponent(() => import('~/components/playground/tabs/Overview.vue')) },
  { label: 'Watch', component: defineAsyncComponent(() => import('~/components/playground/tabs/Watch.vue')) },
  { label: 'Characters', component: defineAsyncComponent(() => import('~/components/playground/tabs/Characters.vue')) },
  { label: 'Staff', component: defineAsyncComponent(() => import('~/components/playground/tabs/Staff.vue')) },
  { label: 'Stats', component: defineAsyncComponent(() => import('~/components/playground/tabs/Stats.vue')) },
  { label: 'Social', component: defineAsyncComponent(() => import('~/components/playground/tabs/Social.vue')) },
]

const selectedTab = ref(0)

function selectTab(index) {
  selectedTab.value = index
}
</script>

<style scoped>
.tabs {
  background-color: #0b1622;
  color: #ccc;
  padding: 1rem 2rem;
}

.tablist {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid #2b2b2b;
  overflow: auto;
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
