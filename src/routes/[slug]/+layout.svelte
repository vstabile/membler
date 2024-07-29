<script lang="ts">
	import CommunitiesBar from '$lib/components/CommunitiesBar.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import community from '$lib/stores/community';
	import themes from '$lib/stores/themes';
	import { page } from '$app/stores';
	import { atag } from '$lib/stores/community';
	import { browser } from '$app/environment';
	import { PUBLIC_PROTOCOL, PUBLIC_DOMAIN, PUBLIC_PORT } from '$env/static/public';

	export let data;

	atag.set(data.atag);

	$: slug = $page.params.slug;
	$: themes.getThemeById(slug);
	$: if (browser && community == undefined)
		window.location.href = `${PUBLIC_PROTOCOL}://www.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`;
</script>

<div class="fixed flex h-screen w-full flex-col">
	<Menu />
	<div class="flex h-0 w-full flex-grow">
		<CommunitiesBar />
		<Sidebar community={$community} subdomain={data.subdomain} />
		<slot />
	</div>
</div>
