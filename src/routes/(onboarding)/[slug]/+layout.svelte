<script lang="ts">
	import community from '$lib/stores/community';
	import { atag } from '$lib/stores/community';
	import { browser } from '$app/environment';
	import { PUBLIC_PROTOCOL, PUBLIC_DOMAIN, PUBLIC_PORT } from '$env/static/public';

	export let data;

	atag.set(data.atag);

	$: if (browser && community == undefined)
		window.location.href = `${PUBLIC_PROTOCOL}://www.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`;
</script>

<slot />
