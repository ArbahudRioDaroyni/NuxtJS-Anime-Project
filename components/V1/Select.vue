<template>
	<div 
		ref="selectContainer"
		:class="['base-select--container', { 'base-select--disabled': disabled }]"
	>
		<h2 v-if="label" class="base-select--label">{{ label }}</h2>
		
		<!-- Custom Select Display -->
		<div 
			:class="['base-select--wrapper', { 'base-select--open': isOpen }]"
			@click="toggleDropdown"
		>
			<div :class="classes">
				<span v-if="selectedLabel" class="base-select--selected">
					{{ selectedLabel }}
				</span>
				<span v-else class="base-select--placeholder">
					{{ placeholder || 'Select an option' }}
				</span>
			</div>
			
			<!-- Dropdown Icon -->
			<Icon 
				name="heroicons:chevron-down" 
				:class="['base-select--icon', { 'base-select--icon-open': isOpen }]"
			/>
		</div>

		<!-- Custom Options Dropdown -->
		<Transition name="dropdown">
			<div 
				v-if="isOpen && !disabled"
				class="base-select--dropdown"
				@click.stop
			>
				<ul class="base-select--options" role="listbox">
					<li
						v-for="option in options"
						:key="option.value"
						:class="[
							'base-select--option',
							{
								'base-select--option-selected': isSelected(option.value),
								'base-select--option-disabled': option.disabled
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
								class="base-select--option-check"
							/>
						</slot>
					</li>
					
					<li v-if="options.length === 0" class="base-select--option-empty">
						No options available
					</li>
				</ul>
			</div>
		</Transition>
		
		<span v-if="error" class="base-select--error">{{ error }}</span>
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
	'base-select',
	`base-select--${props.variant}`,
	`base-select--padding-${props.padding}`,
	{
		'base-select--error': props.error,
		'base-select--disabled': props.disabled
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
@media (prefers-color-scheme: dark) {
  .base-select--container {
    --color: hsl(from var(--primary-color) h s 90%);
    --background-color: hsl(from var(--primary-color) h s 10%);
    --shadow-color: hsl(from var(--primary-color) h s 4%);
    --light-color: hsl(from var(--primary-color) h s 16%);
    --placeholder-color: #9ca3af;
    --danger-color: hsl(from var(--color-alert-danger) h s 70%);
    --success-color: hsl(from var(--color-alert-success) h s 70%);
  }
}
@media (prefers-color-scheme: light) {
  .base-select--container {
    --color: hsl(from var(--primary-color) h s 10%);
    --background-color: hsl(from var(--primary-color) h s 97.5%);
    --shadow-color: hsl(from var(--primary-color) h s 96%);
    --light-color: hsl(from var(--primary-color) h s 84%);
    --placeholder-color: #9ca3af;
    --danger-color: hsl(from var(--color-alert-danger) h s 70%);
  }
}

.base-select {
	width: 100%;
	color: var(--color);
	background-color: var(--background-color);
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
		color: var(--color);
	}

	&--placeholder {
		white-space: nowrap;
		color: var(--placeholder-color);
	}

	&--icon {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: var(--color);
		transition: transform 0.2s ease;

		&-open {
			transform: translateY(-50%) rotate(180deg);
		}
	}

	&--open {
		.base-select {
			box-shadow: inset 4px 4px 4px var(--shadow-color),
				inset -4px -4px 4px var(--light-color);
		}
	}

	&--dropdown {
		position: absolute;
		top: calc(100% + 1rem);
		left: 0;
		right: 0;
		background-color: var(--background-color);
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3),
			8px 8px 12px var(--shadow-color),
			-8px -8px 12px var(--light-color);
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
			background: hsl(from var(--primary-color) h s 20%);
			border-radius: 4px;
			
			&:hover {
        background: hsl(from var(--primary-color) h s 30%);
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
		color: var(--color);
		display: flex;
		align-items: center;
		justify-content: space-between;

		&:hover:not(&-disabled) {
			background-color: hsl(from var(--primary-color) h s 12%);
		}

		&-selected {
			background-color: hsl(from var(--primary-color) h s 15%);
			font-weight: 500;
		}

		&-disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&-empty {
			padding: 1rem;
			text-align: center;
			color: var(--placeholder-color);
			cursor: default;
		}

		&-check {
			color: var(--color-alert-success);
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
		color: var(--color);
	}

	&--error {
		color: var(--danger-color);
		font-size: 0.9em;
		margin-top: 0.2rem;
	}

	&--disabled {
		opacity: 0.6;
		pointer-events: none;
		cursor: not-allowed;
	}

	&--outer {
		box-shadow: 8px 8px 12px var(--shadow-color),
			-8px -8px 12px var(--light-color);
	}

	&--inner {
		box-shadow: -4px -4px 4px var(--light-color) inset,
			4px 4px 4px var(--shadow-color) inset;
	}

	&--both {
		box-shadow: 8px 8px 12px var(--shadow-color),
			-8px -8px 12px var(--light-color),
			-4px -4px 4px var(--light-color) inset,
			4px 4px 4px var(--shadow-color) inset;
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
