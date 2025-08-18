<template>
  <figure v-if="!isBackground" class="responsive-image-container">
    <BaseImageResponsive
      :src="src"
      :alt="alt || 'Image'"
      :width="width"
      :min-width="minWidth || '120px'"
      :height="height"
      :format="format"
      :class="[enablePreview ? 'preview-enabled' : '']"
      @click="enablePreview ? openModal() : null"
    />
  </figure>

  <figure
    v-if="isBackground"  
    class="background-image-container"
    :class="[
      customClass, 
      enablePreview ? 'preview-enabled' : ''
    ]"
    :title="alt || 'Image'"
    role="banner"
    :aria-label="alt || 'Image'"
    @click="enablePreview ? openModal() : null"
  />

  <!-- Modal Preview -->
  <Teleport to="body">
    <div 
      v-if="isModalOpen" 
      class="image-preview-modal"
      role="dialog"
      @click="closeModal"
    >
      <div class="modal-backdrop" @click="closeModal" />
      <figure class="modal-content" @click.stop>
        <button 
          class="modal-close-btn"
          aria-label="Close preview"
          @click="closeModal"
        >
          ×
        </button>
        <NuxtImg
          :src="src"
          :alt="Array.isArray(alt) ? alt.join(', ') : (alt || 'Image')"
          :format="format"
          loading="lazy"
          decoding="async"
          class="modal-image"
        />
      </figure>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  width?: number
  minWidth?: string
  height?: number
  sizes?: string
  format?: "webp" | "avif" | "jpg" | "png"
  placeholder?: "blur" | "empty"
  customClass?: string
  enablePreview?: boolean
  isBackground?: boolean
  backgroundSize?: 'cover' | 'contain' | 'auto'
  backgroundPosition?: string
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  // modifiers?: "{ grayscale: true, tint: "#000" }"
  // placeholder-class?: "grayscale"
}

withDefaults(defineProps<Props>(), {
  src: '/image/image-230x345.webp',
  alt: 'Image',
  width: 100,
  minWidth: '120px',
  height: 100,
  sizes: '',
  format: 'webp',
  placeholder: 'blur',
  customClass: '',
  enablePreview: true,
  isBackground: false,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
})

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  // Restore body scroll
  document.body.style.overflow = 'auto';
};

// Close modal with Escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  // Restore body scroll if component is unmounted while modal is open
  document.body.style.overflow = 'auto';
});
</script>

<style scoped lang="scss">
.responsive-image-container {
  position: relative;
  display: inline-block;
}

.background-image-container {
  width: auto;
  min-width: v-bind('minWidth || "120px"');
  background-image: v-bind('"url(" + src + ")"');
  background-size: v-bind('backgroundSize || "cover"');
  background-position: v-bind('backgroundPosition || "center"');
  background-repeat: v-bind('backgroundRepeat || "no-repeat"');
  height: 100%;
  flex-shrink: 0;
}

.preview-enabled {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  background: var(--color-level-10);
  color: var(--color-level-90);
  border: none;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--color-level-90);
    color: var(--color-level-10);
  }
}

.modal-image {
  min-width: max(200px, 30vw);
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Animation for modal content */
.modal-content {
  animation: slideIn 0.3s ease;
}
</style>
