<template>
	<div 
		ref="selectContainer"
		:class="['select--container', { 'select--disabled': disabled }]"
	>
		<h2 v-if="label" class="select--label">{{ label }}</h2>
		
		<!-- Custom Select Display -->
		<div 
			:class="['select--wrapper', { 'select--open': isOpen }]"
			@click="toggleDropdown"
		>
			<div :class="classes">
				<span v-if="selectedLabel" class="select--selected">
					{{ selectedLabel }}
				</span>
				<span v-else class="select--placeholder">
					{{ placeholder || 'Select an option' }}
				</span>
			</div>
			
			<!-- Dropdown Icon -->
			<Icon 
				name="heroicons:chevron-down" 
				:class="['select--icon', { 'select--icon-open': isOpen }]"
			/>
		</div>

		<!-- Custom Options Dropdown -->
		<Transition name="dropdown">
			<div 
				v-if="isOpen && !disabled"
				class="select--dropdown"
				@click.stop
			>
				<ul class="select--options" role="listbox">
					<li
						v-for="option in options"
						:key="option.value"
						:class="[
							'select--option',
							{
								'select--option-selected': isSelected(option.value),
								'select--option-disabled': option.disabled
							}
						]"
						role="option"
						:aria-selected="isSelected(option.value)"
						@click.stop="selectOption(option)"
					>
						<slot name="option" :option="option" :is-selected="isSelected(option.value)">
							<span>{{ option.label }}</span>
							<Icon 
								v-if="isSelected(option.value)" 
								name="heroicons:check" 
								class="select--option-check"
							/>
						</slot>
					</li>
					
					<li v-if="options.length === 0" class="select--option-empty">
						No options available
					</li>
				</ul>
			</div>
		</Transition>
		
		<span v-if="error" class="select--error">{{ error }}</span>
	</div>
</template>

<script setup lang="ts">
interface Props {
	id?: string
	modelValue?: string | number
	options?: Option[]
	label?: string
	placeholder?: string
	error?: string
	disabled?: boolean
	name?: string
	required?: boolean
	autofocus?: boolean
	size?: number | string
	variant?: 'outer' | 'inner' | 'both'
	padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

type Option = {
	value: string | number
	label: string
	disabled?: boolean
};

const props = withDefaults(defineProps<Props>(), {
	id: undefined,
	modelValue: undefined,
	options: () => [],
	label: undefined,
	placeholder: undefined,
	error: undefined,
	disabled: false,
	name: undefined,
	required: false,
	autofocus: false,
	size: undefined,
	variant: 'outer',
	padding: 'md'
});

const emits = defineEmits<{
	'update:modelValue': [value: string | number]
	change: [value: string | number]
	focus: [event: Event]
	blur: [event: Event]
}>();

const selectContainer = ref<HTMLDivElement>();
const isOpen = ref(false);

const classes = computed(() => [
	'select',
	`select--${props.variant}`,
	`select--padding-${props.padding}`,
	{
		'select--error': props.error,
		'select--disabled': props.disabled
	}
])

// Get selected option label
const selectedLabel = computed(() => {
	if (!props.modelValue) return '';
	const selected = props.options.find(opt => opt.value === props.modelValue);
	return selected?.label || '';
});

// Check if option is selected
function isSelected(value: string | number): boolean {
	return props.modelValue === value;
}

// Toggle dropdown
function toggleDropdown() {
	if (props.disabled) return;
	isOpen.value = !isOpen.value;
}

// Select option
function selectOption(option: Option) {
	if (option.disabled) return;
	
	// Single select
	const newValue = option.value;
	isOpen.value = false; // Close dropdown after selection
	
	emits('update:modelValue', newValue);
	emits('change', newValue);
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
	const target = event.target as Node;
	if (selectContainer.value && !selectContainer.value.contains(target)) {
		isOpen.value = false;
	}
}

// Handle keyboard navigation
function handleKeydown(event: KeyboardEvent) {
	if (props.disabled) return;
	
	if (event.key === 'Escape') {
		isOpen.value = false;
	} else if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		toggleDropdown();
	}
}

// Setup event listeners
onMounted(() => {
	document.addEventListener('mousedown', handleClickOutside);
	document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener('mousedown', handleClickOutside);
	document.removeEventListener('keydown', handleKeydown);
});

// Watch isOpen for focus/blur events
watch(isOpen, (newValue) => {
	if (newValue) {
		emits('focus', new Event('focus'));
	} else {
		emits('blur', new Event('blur'));
	}
});
</script>

<style scoped lang="scss">
.select {
	width: 100%;
	color: #fff;
	background-color: var(--color-level-10);
	border: none;
	border-radius: 8px;
	padding: 0.75rem 1rem;
	padding-right: 2.5rem;
	font-size: 1rem;
	transition: all 0.2s;
	outline: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;

	&--wrapper {
		position: relative;
		width: 100%;
		cursor: pointer;
	}

	&--selected {
		color: #fff;
	}

	&--placeholder {
		white-space: nowrap;
		color: #9ca3af;
	}

	&--icon {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: #fff;
		transition: transform 0.2s ease;

		&-open {
			transform: translateY(-50%) rotate(180deg);
		}
	}

	&--open {
		.select {
			box-shadow: inset 4px 4px 4px hsl(var(--primary-color-code), 4%),
				inset -4px -4px 4px hsl(var(--primary-color-code), 16%);
		}
	}

	&--dropdown {
		position: absolute;
		top: calc(100% + 1rem);
		left: 0;
		right: 0;
		background-color: var(--color-level-10);
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3),
			8px 8px 12px hsl(var(--primary-color-code), 4%),
			-8px -8px 12px hsl(var(--primary-color-code), 16%);
		z-index: 1000;
		max-height: 300px;
		overflow-y: auto;
		
		// Custom scrollbar
		&::-webkit-scrollbar {
			width: 8px;
		}
		
		&::-webkit-scrollbar-track {
			background: transparent;
		}
		
		&::-webkit-scrollbar-thumb {
			background: hsl(var(--primary-color-code), 20%);
			border-radius: 4px;
			
			&:hover {
				background: hsl(var(--primary-color-code), 30%);
			}
		}
	}

	&--options {
		list-style: none;
		padding: 0.5rem;
		margin: 0;
	}

	&--option {
		padding: 0.75rem 1rem;
		cursor: pointer;
		border-radius: 6px;
		transition: all 0.2s;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&:hover:not(&-disabled) {
			background-color: hsl(var(--primary-color-code), 15%);
		}

		&-selected {
			background-color: hsl(var(--primary-color-code), 12%);
			font-weight: 500;
		}

		&-disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&-empty {
			padding: 1rem;
			text-align: center;
			color: #9ca3af;
			cursor: default;
		}

		&-check {
			color: #10b981;
			flex-shrink: 0;
			margin-left: 0.5rem;
		}
	}

	&--container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		position: relative;
	}

	&--label {
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: #fff;
	}

	&--error {
		color: #ff6b6b;
		font-size: 0.9em;
		margin-top: 0.2rem;
	}

	&--disabled {
		opacity: 0.6;
		pointer-events: none;
		cursor: not-allowed;
	}

	&--outer {
		box-shadow: 8px 8px 12px hsl(var(--primary-color-code), 4%),
			-8px -8px 12px hsl(var(--primary-color-code), 16%);
	}

	&--inner {
		box-shadow: -4px -4px 4px hsl(var(--primary-color-code), 16%) inset,
			4px 4px 4px hsl(var(--primary-color-code), 4%) inset;
	}

	&--both {
		box-shadow: 8px 8px 12px hsl(var(--primary-color-code), 4%),
			-8px -8px 12px hsl(var(--primary-color-code), 16%),
			-4px -4px 4px hsl(var(--primary-color-code), 16%) inset,
			4px 4px 4px hsl(var(--primary-color-code), 4%) inset;
	}

	// Padding variants
	&--padding {
		&-none {
			padding: 0;
			padding-right: 2.5rem;
		}

		&-sm {
			padding: 0.5rem 1rem;
			padding-right: 2.5rem;
		}

		&-md {
			padding: 0.75rem 1.5rem;
			padding-right: 3rem;
		}

		&-lg {
			padding: 1rem 2rem;
			padding-right: 3.5rem;
		}

		&-xl {
			padding: 1.5rem 3rem;
			padding-right: 4rem;
		}
	}
}

// Dropdown animation
.dropdown-enter-active,
.dropdown-leave-active {
	transition: all 0.2s ease;
}

.dropdown-enter-from {
	opacity: 0;
	transform: translateY(-10px);
}

.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
