<template>
	<header ref="headerNav" :class="headerClasses">
		<NuxtImg
			src="/icon.svg"
			alt="Logo"
			:width="50"
			:height="50"
			format="webp"
			class="logo aspect-square"
		/>
		<nav>
			<ul>
				<li><a href="#home">Home</a></li>
				<li><a href="#about">About</a></li>
				<li><a href="#services">Services</a></li>
				<li><a href="#contact">Contact</a></li>
			</ul>
		</nav>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const headerNav = ref<HTMLElement | null>(null);
const lastScrollTop = ref(0);
const isHidden = ref(false);
const isTransparent = ref(true);

function headerNavigationOnScroll() {
	const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

	isTransparent.value = currentScroll === 0;
	isHidden.value = currentScroll > lastScrollTop.value && currentScroll > 0;

	lastScrollTop.value = Math.max(currentScroll, 0);
}

const headerClasses = computed(() => ({
	transparent: isTransparent.value,
	hidden: isHidden.value,
}));

onMounted(() => {
	window.addEventListener('scroll', useThrottle(headerNavigationOnScroll, 300), { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', headerNavigationOnScroll);
});
</script>

<style scoped lang="scss">
header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 68px;
	background-color: var(--bg-color-level-2);
	backdrop-filter: blur(10px);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	transition: background-color 0.3s, transform 0.3s, opacity 0.3s;
	z-index: 1000;

	@media screen and (max-width: 768px) {
		display: none
	}

	&.hidden {
		opacity: 0;
		transform: translateY(-100%);
	}

	&.transparent {
		background-color: rgba(21, 34, 50, 0.5);
		box-shadow: none;
	}

	.logo {
		width: 50px;
		height: auto;
		transition: transform 0.3s;

		&:hover {
			transform: scale(1.1);
		}
	}

	nav {
		display: flex;
		gap: 20px;
	
		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			gap: 20px;
	
			li {
				display: inline-block;
	
				a {
					color: var(--color-level-2);
					text-decoration: none;
					transition: color 0.3s;
					font-weight: 600;
					font-family: "Overpass", sans-serif;
	
					&:hover {
						color: var(--color-level-2);
					}
				}
			}
		}
	}
}

</style>
