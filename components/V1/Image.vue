<template>
	<figure class="image-component">
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
			:class="classes"
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
}

const props = withDefaults(defineProps<Props>(), {
	src: '/image/image-230x345.webp',
	alt: undefined,
	width: undefined,
	height: undefined,
	sizes: "100vw xs:320px sm:640px md:768px lg:1024px xl:1280px xxl:1536px 2xl:1536px",
	format: "webp",
	placeholder: "blur",
	rounded: 'md'
})

const classes = computed(() => [
	'image',
	`image--rounded-${props.rounded}`
])
</script>

<style scoped lang="scss">
.image-component {
	margin: 0;
	padding: 0;
	line-height: 0;
	display: inline-block;
	width: 100%;

	.image {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
		object-position: center;

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