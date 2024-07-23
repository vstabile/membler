<script lang="ts">
	import Typed from 'typed.js';
	import LucideGithub from '~icons/lucide/github';
	import { locale, locales, waitLocale } from 'svelte-i18n';
	import { t } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	locale.set('en');
	const localeParam = $page.url.searchParams.get('locale');
	if (localeParam && $locales.includes(localeParam)) {
		locale.set(localeParam);
	} else if (browser) {
		const browserLocale = window.navigator.language.split('-')[0];
		if ($locales.includes(browserLocale)) {
			locale.set(browserLocale);
		}
	}

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

	waitLocale().then(initTyped);

	$: $t, initTyped();
</script>

<div class="flex h-screen flex-col justify-center bg-purple-200">
	<nav class="flex items-center justify-between px-6 py-6 md:px-10">
		<div>
			<a href="/" class="logo text-3xl font-bold text-purple-900">Membler</a>
		</div>
		<div>
			<a href="/sign-in" class="mr-4">{$t('sign-in')}</a>
			<a
				href="/communities/new"
				class="hidden rounded bg-purple-800 px-4 py-2 text-white md:inline-block"
				>{$t('get-started')}</a
			>
		</div>
	</nav>
	<div class="flex h-full w-full items-center p-6 md:p-9">
		<div class="flex w-full flex-col">
			<h1 class="text-center text-4xl font-bold leading-tight md:text-5xl md:leading-tight">
				{@html $t('home-title')}
				<br class="md:hidden" />
				<span bind:this={typing}></span>
			</h1>
			<p class="mt-8 text-center text-xl">
				{$t('home-text')}
			</p>
			<div class="mt-12 text-center">
				<a
					href="/communities/new"
					class="rounded bg-gradient-to-r from-purple-600 to-purple-800 px-12 py-4 font-semibold text-white hover:drop-shadow-lg"
					>{$t('get-started')}</a
				>
			</div>
		</div>
	</div>
	<div class="flex justify-end px-6 py-10 md:px-10">
		<a href="https://github.com/vstabile/membler" class="flex items-center" target="_blank">
			<LucideGithub class="mr-1" /> Github
		</a>
	</div>
</div>
