<script>
	import '../app.css';
	import '../i18n.ts';
	import { onMount } from 'svelte';
	import ndk from '$lib/stores/ndk';
	import signIn from '$lib/sign-in';

	onMount(async () => {
		await $ndk.connect(10000);

		signIn();
	});
</script>

<slot></slot>
