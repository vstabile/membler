<script lang="ts">
	import Typed from 'typed.js';
	import LucideGithub from '~icons/lucide/github';
	import LucideChevronDown from '~icons/lucide/chevron-down';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t, locale, locales } from '$lib/i18n';
	import { onMount } from 'svelte';
	import { changeLocale } from '$lib/utils';

	let typing: HTMLSpanElement | null;
	let typed: any;

	function initTyped() {
		if (!typing) return;

		if (typed) {
			typed.destroy();
		}
		typed = new Typed(typing, {
			strings: [$t('developers'), $t('educators'), $t('events'), $t('influencers'), $t('creators')],
			loop: true,
			typeSpeed: 80,
			backSpeed: 30,
			backDelay: 2500,
			showCursor: false
		});
	}

	$: if ($locale) initTyped();

	onMount(initTyped);
</script>

<div class="flex min-h-screen flex-col justify-between bg-purple-200">
	<nav class="flex items-center justify-between px-8 py-6 md:px-10">
		<div>
			<a href="/" class="logo text-2xl font-bold text-purple-900 sm:text-3xl">Membler</a>
		</div>
		<div>
			<a href="/sign-in">{$t('sign-in')}</a>
			<a
				href="/communities/new"
				class="ml-4 hidden rounded bg-purple-800 px-4 py-2 text-white sm:inline-block"
				>{$t('get-started')}</a
			>
		</div>
	</nav>
	<div class="flex h-full w-full items-center p-6 md:p-9">
		<div class="flex w-full flex-col">
			<h1
				class="text-center text-4xl font-bold leading-tight sm:text-5xl md:text-6xl md:leading-tight"
			>
				{@html $t('home-title')}
				<br class="sm:hidden" />
				<span bind:this={typing} class="typing flex h-11 justify-center text-orange-700 sm:inline"
				></span>
			</h1>
			<p class="mt-8 text-center text-lg sm:text-xl">
				{$t('home-text')}
			</p>
			<div class="mt-12 text-center">
				<a
					href="/communities/new"
					class="glow rounded bg-gradient-to-r from-purple-600 to-purple-800 px-12 py-4 font-semibold text-white"
					>{$t('get-started')}</a
				>
			</div>
		</div>
	</div>
	<div class="flex justify-between px-8 pb-6 pt-10 md:px-10 md:pb-10">
		<a href="https://github.com/vstabile/membler" class="flex items-center" target="_blank">
			<LucideGithub class="mr-1" /> Github
		</a>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex items-center text-sm text-gray-600">
				{$t(`locales.${$locale}`)}
				<LucideChevronDown class="ml-1" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content side="top">
				<DropdownMenu.Group>
					{#each $locales as l}
						<DropdownMenu.Item on:click={() => changeLocale(l)}>
							{$t(`locales.${l}`)}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>

<style>
	:global(body) {
		background-color: #e9d5ff !important;
	}

	.typing {
		background-image: linear-gradient(to right, #ea580c, #f97316);
		color: transparent;
		background-clip: text;
	}

	.glow:hover {
		box-shadow: 0 0 15px rgb(168 85 247);
	}
</style>
