import { createSharedComposable } from "@vueuse/core";

/**
 * Composable for dashboard-related functionality
 * @returns {Object} Dashboard composable
 */
const _useDashboard = () => {
	const route = useRoute();
	const router = useRouter();
	const isNotificationsSlideoverOpen = ref(false);

	defineShortcuts({
		"g-h": () => router.push("/"),
		"g-i": () => router.push("/inbox"),
		"g-a": () => router.push("/dashboard/animes"),
		"g-c": () => router.push("/dashboard/customers"),
		"g-s": () => router.push("/settings"),
		n: () =>
			(isNotificationsSlideoverOpen.value =
				!isNotificationsSlideoverOpen.value),
	});

	watch(
		() => route.fullPath,
		() => {
			isNotificationsSlideoverOpen.value = false;
		}
	);

	return {
		isNotificationsSlideoverOpen,
	};
};

// Create a shared instance of the dashboard composable
export const useDashboard = createSharedComposable(_useDashboard);