<script lang="ts">
	import Typed from 'typed.js';
	import LucideGithub from '~icons/lucide/github';
	import { t, locale } from '$lib/i18n';
	import { onDestroy, onMount } from 'svelte';
	import session from '$lib/stores/session';
	import LocaleSelector from '$lib/components/LocaleSelector.svelte';
	import { signOut } from '$lib/sign-in';

	let typing: HTMLSpanElement | null;
	let typed: any;
	let originalBackgroundColor: string;

	function initTyped() {
		if (!typing) return;

		if (typed) typed.destroy();

		typed = new Typed(typing, {
			strings: [
				$t('homepage.developers'),
				$t('homepage.educators'),
				$t('homepage.events'),
				$t('homepage.influencers'),
				$t('homepage.creators')
			],
			loop: true,
			typeSpeed: 80,
			backSpeed: 30,
			backDelay: 2500,
			showCursor: false
		});
	}

	$: if ($locale) initTyped();

	onMount(() => {
		initTyped();
		if (typeof window !== 'undefined') {
			originalBackgroundColor = document.body.style.backgroundColor;
			if (document) document.body.style.backgroundColor = '#e9d5ff';
		}
	});

	onDestroy(() => {
		if (typed) typed.destroy();
		if (typeof window !== 'undefined') {
			document.body.style.backgroundColor = originalBackgroundColor || '';
		}
	});
</script>

<div class="flex min-h-screen flex-col justify-between bg-purple-200">
	<nav class="flex items-center justify-between px-8 py-6 md:px-10">
		<div>
			<a href="/" class="logo text-2xl font-bold text-purple-900 sm:text-3xl">Membler</a>
		</div>
		<div>
			{#if !$session.pubkey}
				<a href="/sign-in">{$t('sign-in')}</a>
			{:else}
				<a href="/sign-out" on:click|preventDefault={signOut}>
					{$t('sign-out')}
				</a>
			{/if}
			<a
				href="/communities/new"
				class="ml-4 hidden rounded bg-purple-800 px-4 py-2 text-white sm:inline-block"
				>{$t('homepage.get-started')}</a
			>
		</div>
	</nav>
	<div class="flex h-full w-full items-center p-6 md:p-9">
		<div class="flex w-full flex-col">
			<h1
				class="text-center text-4xl font-bold leading-tight sm:text-5xl md:text-6xl md:leading-tight"
			>
				{$t('homepage.title-line-1')}<br />
				{$t('homepage.title-line-2')}
				<br class="sm:hidden" />
				<span bind:this={typing} class="typing flex h-11 justify-center text-orange-700 sm:inline"
				></span>
			</h1>
			<p class="mt-8 text-center text-lg sm:text-xl">
				{$t('homepage.main-text')}
			</p>
			<div class="mt-12 text-center">
				<a
					href="/communities/new"
					class="glow rounded bg-gradient-to-r from-purple-600 to-purple-800 px-12 py-4 font-semibold text-white"
					>{$t('homepage.get-started')}</a
				>
			</div>
		</div>
	</div>
	<div class="flex justify-between px-8 pb-6 pt-10 md:px-10 md:pb-10">
		<a href="https://github.com/vstabile/membler" class="flex items-center" target="_blank">
			<LucideGithub class="mr-1" /> Github
		</a>
		<LocaleSelector />
	</div>
</div>

<style>
	.typing {
		background-image: linear-gradient(to right, #ea580c, #f97316);
		color: transparent;
		background-clip: text;
	}

	.glow:hover {
		box-shadow: 0 0 15px rgb(168 85 247);
	}
</style>
