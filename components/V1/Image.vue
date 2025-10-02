<template>
	<figure
    :class="[clicked ? 'clicked' : '']" 
    @click="handleClick"
  >
		<NuxtImg
			:src="props.src"
			:alt="Array.isArray(props.alt) ? props.alt.join(', ') : (props.alt || 'Image')"
			:width="props.width"
			:height="props.height"
			:sizes="props.sizes"
			densities="x1 x2"
			:format="props.format"
			loading="lazy"
			decoding="async"
			:placeholder="[(props.width ?? 100)/5, (props.height ?? 100)/5, 75, 5]"
			:class="[...classes, props.clickable ? 'image--clickable' : '', clicked ? 'image--clicked' : '']"
      role="button"
      tabindex="0"
			v-bind="$attrs"
		/>
	</figure>
</template>

<script setup lang="ts">
interface Props {
	src?: string
	alt?: string | string[]
	width?: number
	height?: number
	sizes?: string
	format?: "webp" | "avif" | "jpg" | "png"
	placeholder?: "blur" | "empty"
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  clickable?: boolean
  // modifiers?: "{ grayscale: true, tint: "#000" }"
  // placeholder-class?: "grayscale"
}

const props = withDefaults(defineProps<Props>(), {
	src: '/image/image-230x345.webp',
	alt: undefined,
	width: undefined,
	height: undefined,
	sizes: "100vw xs:320px sm:640px md:768px lg:1024px xl:1280px xxl:1536px 2xl:1536px",
	format: "webp",
	placeholder: "blur",
	rounded: 'md',
  clickable: false
})

const classes = computed(() => [
	'image',
	`image--rounded-${props.rounded}`
])

const clicked = ref(false)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    event.preventDefault()
    event.stopPropagation()
	  clicked.value = event.target instanceof HTMLImageElement
    document.body.style.overflow = clicked.value ? 'hidden' : 'auto'
    emit('click', event)
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && clicked.value) {
    clicked.value = false
    document.body.style.overflow = clicked.value ? 'hidden' : 'auto'
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = 'auto';
});
</script>

<style scoped lang="scss">
figure {
	width: v-bind('width ? width+"px" : "100%"');
  height: v-bind('height ? height+"px" : "auto"');
	margin: 0;
	padding: 0;
	line-height: 0;
	display: inline-block;
  overflow: hidden;

  &.clicked {
    position: fixed;
    padding: 0;
    outline: 0;
    margin: auto;
    z-index: 1000;
    inset: 0;
    cursor: zoom-out;
    backdrop-filter: blur(16px);
    background-color: rgba(0, 0, 0, 0.2);
  }

	.image {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
		object-position: center;

    &--clickable {
      cursor: pointer;
    }

    &--clicked {
      width: auto;
      height: 80vh;
      position: absolute;
      inset: 0;
      margin: auto;
    }

		&--rounded {
			&-none {
				border-radius: 0;
			}

			&-sm {
				border-radius: 0.125rem;
			}

			&-md {
				border-radius: 0.375rem;
			}

			&-lg {
				border-radius: 0.5rem;
			}

			&-full {
				border-radius: 100%;
			}
		}
	}
}
</style>