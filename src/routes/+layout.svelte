<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import ndk from '$lib/stores/ndk';
	import signIn from '$lib/sign-in';
	import { t, loading, locale } from '$lib/i18n';
	import thumbnail_en from '$lib/assets/thumbnail-en.png';
	import thumbnail_pt from '$lib/assets/thumbnail-pt.png';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';

	const thumbnails: Record<string, string> = { en: thumbnail_en, pt: thumbnail_pt };

	$: thumbnail = thumbnails[$locale || 'en'] || thumbnail_en;

	onMount(async () => {
		const currentPath = $page.url.pathname;
		sessionStorage.setItem('previousPath', currentPath);

		await $ndk.connect(10000);

		signIn();
	});
</script>

<svelte:head>
	{#if !$loading}
		<meta property="og:title" content={$t('og-title')} />
		<meta property="og:description" content={$t('og-description')} />
		<meta property="og:image" content={thumbnail} />
		<meta name="twitter:card" content={thumbnail} />
	{/if}
</svelte:head>

<Toaster richColors />

<slot></slot>
