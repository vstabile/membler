<script lang="ts">
	import '../app.css';
	import '../i18n';
	import { onMount } from 'svelte';
	import ndk from '$lib/stores/ndk';
	import signIn from '$lib/sign-in';
	import { t, locale } from 'svelte-i18n';
	import thumbnail_en from '$lib/assets/thumbnail-en.png';
	import thumbnail_pt from '$lib/assets/thumbnail-pt.png';

	const thumbnails: Record<string, string> = { en: thumbnail_en, pt: thumbnail_pt };

	$: thumbnail = thumbnails[$locale || 'en'] || thumbnail_en;

	onMount(async () => {
		await $ndk.connect(10000);

		signIn();
	});
</script>

<svelte:head>
	<meta property="og:title" content={$t('og-title')} />
	<meta property="og:description" content={$t('og-description')} />
	<meta property="og:image" content={thumbnail} />
	<meta name="twitter:card" content={thumbnail} />
</svelte:head>

<slot></slot>
