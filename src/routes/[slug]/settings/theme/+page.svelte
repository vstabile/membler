<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Button } from '$lib/components/ui/button/index.js';
	import { t } from '$lib/i18n';
	import ndk from '$lib/stores/ndk';
	import { superForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import session from '$lib/stores/session';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { LucideLoader } from 'lucide-svelte';
	import { toKebabCase } from '$lib/utils';
	import themes, { defaultTheme } from '$lib/stores/themes';
	import { page } from '$app/stores';
	import { THEME_SETTINGS_EVENT_KIND } from '$lib/constants';

	let publishing = false;
	let activePickerPosition: { top: number; left: number } | null = null;
	let activeColor = '';
	let activeKey: keyof typeof defaultTheme | null = null;
	let isSelecting = false;

	$: slug = $page.params.slug;
	$: theme = $themes.find((t) => t.id === slug) || defaultTheme;

	const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, $t('invalid-hex-color'));

	const formSchema = z.object({
		brandColor: hexColorSchema,
		onboardingColor: hexColorSchema,
		onboardingBgColor: hexColorSchema,
		buttonTextColor: hexColorSchema,
		headerBgColor: hexColorSchema,
		headerTextColor: hexColorSchema,
		sidebarBgColor: hexColorSchema,
		sidebarTextColor: hexColorSchema,
		sidebarBorderColor: hexColorSchema,
		itemActiveColor: hexColorSchema,
		itemActiveTextColor: hexColorSchema,
		itemHoverColor: hexColorSchema
	});

	$: if (theme) {
		$formData = {
			brandColor: theme?.brandColor || defaultTheme.brandColor,
			onboardingColor: theme?.onboardingColor || defaultTheme.onboardingColor,
			onboardingBgColor: theme?.onboardingBgColor || defaultTheme.onboardingBgColor,
			buttonTextColor: theme?.buttonTextColor || defaultTheme.buttonTextColor,
			headerBgColor: theme?.headerBgColor || defaultTheme.headerBgColor,
			headerTextColor: theme?.headerTextColor || defaultTheme.headerTextColor,
			sidebarBgColor: theme?.sidebarBgColor || defaultTheme.sidebarBgColor,
			sidebarTextColor: theme?.sidebarTextColor || defaultTheme.sidebarTextColor,
			sidebarBorderColor: theme?.sidebarBorderColor || defaultTheme.sidebarBorderColor,
			itemActiveColor: theme?.itemActiveColor || defaultTheme.itemActiveColor,
			itemActiveTextColor: theme?.itemActiveTextColor || defaultTheme.itemActiveTextColor,
			itemHoverColor: theme?.itemHoverColor || defaultTheme.itemHoverColor
		};
	}

	const form = superForm(defaultTheme, {
		validators: zodClient(formSchema),
		validationMethod: 'auto',
		SPA: true,
		resetForm: false,
		onUpdate: ({ form }) => {
			if (form.valid) {
				publishing = true;
				publish().then(() => {
					publishing = false;
				});
			}
		}
	});

	async function publish() {
		publishing = true;

		const pubkey = $session.pubkey!;

		let tags = themeKeys.map((key) => [key, $formData[key]]);

		tags.push(['d', `membler:theme:${slug}`]);

		const event = new NDKEvent($ndk, {
			pubkey,
			content: '',
			created_at: Math.floor(Date.now() / 1000),
			kind: THEME_SETTINGS_EVENT_KIND,
			tags
		});

		await event.publish();

		return;
	}

	const { form: formData, enhance } = form;

	// Create a typed array of theme keys
	const themeKeys = Object.keys(defaultTheme) as Array<keyof typeof defaultTheme>;

	// Keep activeColor and formData in sync
	$: if (activeKey && activeColor) {
		$formData[activeKey] = activeColor;
	}

	function handlePickerOpen(key: keyof typeof theme, event: MouseEvent) {
		event.stopPropagation();
		activeKey = key;
		activeColor = $formData[key] || defaultTheme[key];
		// Get the position of the color preview
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		activePickerPosition = {
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX
		};
	}

	function handlePickerClose() {
		activeKey = null;
		activeColor = '';
		activePickerPosition = null;
	}

	function updateColor(hex: string) {
		if (activeKey) {
			$formData[activeKey] = hex;
			activeColor = hex;
			theme = { ...theme, [activeKey]: hex };
			themes.updateTheme($page.params.slug, theme);
		}
	}

	// Handle mouse events for color selection
	function handleMouseDown() {
		isSelecting = true;
	}

	function handleMouseUp() {
		if (isSelecting) {
			isSelecting = false;
			handlePickerClose();
		}
	}

	// Add click outside handler to close the picker
	function handleClickOutside(event: MouseEvent) {
		// Only handle clicks when the picker is open
		if (activePickerPosition && activeKey) {
			const target = event.target as HTMLElement;
			// Check if the click is outside the color picker and not on a color preview button
			if (!target.closest('.color-picker-container') && !target.closest('.color-preview-button')) {
				handlePickerClose();
			}
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="flex h-full w-full flex-col overflow-auto bg-white">
	<div class="h-16 flex-none border-b px-6 py-4">
		<h1 class="text-lg font-bold">{$t('customize-theme')}</h1>
	</div>

	<div class="flex-1 overflow-y-auto p-6">
		<form method="POST" use:enhance class="grid grid-cols-1 gap-4 pb-8 md:grid-cols-2">
			{#each themeKeys as key}
				<Form.Field {form} name={key}>
					<Form.Control let:attrs>
						<Form.Label>{$t('theme.' + toKebabCase(key))}</Form.Label>
						<div class="relative">
							<Input
								type="text"
								id={key}
								name={key}
								autocomplete="off"
								bind:value={$formData[key]}
								disabled={publishing}
								class="pl-10"
							/>
							<button
								type="button"
								class="color-preview-button absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-sm border"
								style="background-color: {$formData[key]};"
								on:click|preventDefault|stopPropagation={(e) => handlePickerOpen(key, e)}
							></button>
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/each}
			<!-- <input type="hidden" name="atag" value={$formData.atag} /> -->
			<Button
				type="submit"
				class="hover:bg-brand/90 mt-4 min-w-28 bg-brand px-6"
				disabled={publishing}
			>
				<span class:hidden={!publishing} class="animate-spin">
					<LucideLoader class="h-5 w-5" />
				</span>
				<span class:hidden={publishing}>{$t('update')}</span>
			</Button>
		</form>
	</div>

	<!-- Portal for color picker -->
	{#if activeColor && activePickerPosition}
		<div
			class="color-picker-container fixed z-[9999]"
			style="top: {activePickerPosition.top}px; left: {activePickerPosition.left}px;"
		>
			<ColorPicker
				bind:hex={activeColor}
				label=""
				position="responsive"
				--picker-z-index="9999"
				--input-size="0"
				--picker-indicator-size="10px"
				isDialog={false}
				on:close={handlePickerClose}
				on:mousedown={handleMouseDown}
				on:mouseup={handleMouseUp}
				on:input={(e) => {
					if (e.detail && e.detail.hex) {
						updateColor(e.detail.hex);
						// Don't close while dragging - will close on mouse up
					}
				}}
			/>
		</div>
	{/if}
</div>
