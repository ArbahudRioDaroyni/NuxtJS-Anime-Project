<template>
  <div :class="tabClasses">
    <!-- Tab Navigation -->
    <div class="tabs__nav">
      <ul class="tabs__list" role="tablist">
        <li
          v-for="(tab, index) in tabs"
          :key="`tab-${index}`"
          :class="[
            'tabs__item',
            { 
              'tabs__item--active': selectedTab === index,
              'tabs__item--disabled': tab.disabled
            }
          ]"
          role="tab"
          :aria-selected="selectedTab === index"
          :aria-disabled="tab.disabled"
          :tabindex="tab.disabled ? -1 : 0"
          @click="selectTab(index)"
          @keydown.enter="selectTab(index)"
          @keydown.space.prevent="selectTab(index)"
        >
          <!-- Icon -->
          <Icon 
            v-if="tab.icon" 
            :name="tab.icon" 
            class="tabs__icon" 
          />
          
          <!-- Label -->
          <span class="tabs__label">{{ tab.label }}</span>
          
          <!-- Badge -->
          <span 
            v-if="tab.badge" 
            class="tabs__badge"
          >
            {{ tab.badge }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <div class="tabs__content">
      <CommonTabsTabPanel
        :id="`panel-${selectedTab}`"
        :aria-labelledby="`tab-${selectedTab}`"
        :is-active="true"
      >
        <KeepAlive>
          <component 
            :is="currentTab?.component" 
            :data="currentTab?.content ?? {}"
            v-bind="$attrs"
          />
        </KeepAlive>
      </CommonTabsTabPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tabs, Tab } from '~/types/components'

const props = withDefaults(defineProps<Tabs>(), {
  defaultTab: 0,
  variant: 'default',
  size: 'md',
  centered: true
})

const emit = defineEmits<{
  change: [index: number, tab: Tab]
}>()

const selectedTab = ref(props.defaultTab)

const selectTab = (index: number) => {
  if (props.tabs[index]?.disabled) return
  selectedTab.value = index
  const tab = props.tabs[index]
  if (tab) {
    emit('change', index, tab)
  }
}

const tabClasses = computed(() => [
  'tabs',
  `tabs--${props.variant}`,
  `tabs--${props.size}`,
  { 'tabs--centered': props.centered }
])

const currentTab = computed(() => props.tabs[selectedTab.value])
</script>

<style scoped lang="scss">
.tabs {
  color: var(--text-color, #ccc);
  
  // Variants
  &--default {
    .tabs__list {
      border-bottom: 1px solid var(--border-color, #2b2b2b);
    }
  }
  
  &--pills {
    .tabs__item {
      border-radius: 0.375rem;
      margin-right: 0.25rem;
      
      &--active {
        background-color: var(--primary-color, #2aa9ff);
        color: white;
        
        &::after {
          display: none;
        }
      }
    }
  }
  
  &--underline {
    .tabs__list {
      border-bottom: none;
    }
    
    .tabs__item--active::after {
      height: 3px;
      border-radius: 1.5px;
    }
  }
  
  // Sizes
  &--sm {
    .tabs__item {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }
  }
  
  &--md {
    .tabs__item {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
  }
  
  &--lg {
    .tabs__item {
      padding: 0.75rem 1.25rem;
      font-size: 1.125rem;
    }
  }
  
  // Alignment
  &--centered {
    .tabs__list {
      justify-content: center;
    }
  }
}

.tabs__nav {
  margin-bottom: 1rem;
}

.tabs__list {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tabs__item {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  border-radius: 0.25rem;
  outline: none;
  
  &:hover:not(&--disabled) {
    color: var(--text-hover, #fff);
    background-color: var(--bg-hover, rgba(255, 255, 255, 0.05));
  }
  
  &:focus-visible {
    outline: 2px solid var(--focus-color, #2aa9ff);
    outline-offset: 2px;
  }
  
  &--active {
    color: var(--text-active, #ffffff);
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      height: 2px;
      width: 100%;
      background-color: var(--primary-color, #2aa9ff);
      border-radius: 1px;
    }
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      color: inherit;
      background-color: transparent;
    }
  }
}

.tabs__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.tabs__label {
  white-space: nowrap;
}

.tabs__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  background-color: var(--badge-bg, #374151);
  color: var(--badge-text, #ffffff);
  border-radius: 0.625rem;
}

.tabs__content {
  min-height: 5rem;
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .tabs {
    --text-color: #e5e7eb;
    --text-hover: #ffffff;
    --text-active: #ffffff;
    --border-color: #374151;
    --bg-hover: rgba(255, 255, 255, 0.05);
    --badge-bg: #4b5563;
    --primary-color: #3b82f6;
    --focus-color: #3b82f6;
  }
}

// Light mode
@media (prefers-color-scheme: light) {
  .tabs {
    --text-color: #6b7280;
    --text-hover: #374151;
    --text-active: #111827;
    --border-color: #e5e7eb;
    --bg-hover: rgba(0, 0, 0, 0.05);
    --badge-bg: #f3f4f6;
    --badge-text: #374151;
    --primary-color: #3b82f6;
    --focus-color: #3b82f6;
  }
}
</style>