<template>
	<Transition name="header-slide" appear>
		<header 
			v-show="!isHidden"
			ref="headerRef" 
			:class="{ transparent: isTransparent }"
			role="banner"
			aria-label="Main navigation"
		>
		<NuxtImg
      src="/icon.svg"
      alt="AniWorld Logo"
      :width="50"
      :height="50"
      format="webp"
      class="logo"
      loading="eager"
      preload
    />
		<nav role="navigation" aria-label="Primary navigation">
			<ul role="menubar">
				<li 
					v-for="item in navigationItems" 
					:key="item.id"
					role="none"
				>
					<NuxtLink 
						:to="item.href"
						:aria-label="item.ariaLabel"
						class="nav-link"
						role="menuitem"
						@click="handleNavClick"
					>
						{{ item.label }}
					</NuxtLink>
				</li>
			</ul>
		</nav>
		</header>
	</Transition>
</template>

<script setup lang="ts">
// Navigation items configuration
const navigationItems = [
  { id: 1, label: 'Home', href: '/', ariaLabel: 'Go to Home page' },
  { id: 2, label: 'Animes', href: '/animes', ariaLabel: 'Browse Animes' },
  { id: 3, label: 'Mangas', href: '/mangas', ariaLabel: 'Browse Mangas' },
  { id: 4, label: 'Genres', href: '/genres', ariaLabel: 'Browse Genres' },
  { id: 5, label: 'Studios', href: '/studios', ariaLabel: 'Browse Studios' },
];

// Navigation click handler
function handleNavClick() {
  // Placeholder for any future navigation click handling
}

// Header Refs
const headerRef = ref<HTMLElement | null>(null);

// Scroll handling
const lastScrollTop = ref(0);
const isHidden = ref(false);
const isTransparent = ref(true);

function headerNavigationOnScroll() {
	const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

	isTransparent.value = currentScroll === 0;
	isHidden.value = currentScroll > lastScrollTop.value && currentScroll > 0;

	lastScrollTop.value = Math.max(currentScroll, 0);
}

// Removed headerClasses computed since we're using v-show and single class binding

onMounted(() => {
	window.addEventListener('scroll', useThrottle(headerNavigationOnScroll, 300), { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', headerNavigationOnScroll);
});
</script>

<style scoped lang="scss">
// Vue Transition classes for smooth header slide effect
.header-slide-enter-from,
.header-slide-leave-to {
	opacity: 0;
	transform: translateY(-100%);
}

header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 68px;
	background-color: hsl(from var(--primary-color) h s 17.5%);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	transition: all 0.3s ease-in-out;
	z-index: 1000;

	@media screen and (max-width: 768px) {
		display: none
	}

	&.transparent {
		background-color: hsla(from var(--primary-color) h s 10% / 0.5);
    backdrop-filter: blur(10px);
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
					color: hsl(from var(--primary-color) h s 90%);
					text-decoration: none;
					transition: color 0.3s;
					font-weight: 600;
					font-family: "Overpass", sans-serif;
	
					&:hover {
						color: hsl(from var(--primary-color) h s 80%);
					}
				}
			}
		}
	}
}

</style>
