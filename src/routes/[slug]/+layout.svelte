<script lang="ts">
	import NewPostDialog from '$lib/components/NewPostDialog.svelte';
	import CommunitiesBar from '$lib/components/CommunitiesBar.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import community from '$lib/stores/community';
	import themes from '$lib/stores/themes';
	import sidebarOpen from '$lib/stores/sidebarOpen.js';
	import { page } from '$app/stores';
	import { atag } from '$lib/stores/community';
	import { browser } from '$app/environment';
	import { PUBLIC_PROTOCOL, PUBLIC_DOMAIN, PUBLIC_PORT } from '$env/static/public';
	import PostDialog from '$lib/components/PostDialog.svelte';
	import CommunitySettingsDialog from '$lib/components/CommunitySettingsDialog.svelte';

	export let data;

	atag.set(data.atag);

	$: slug = $page.params.slug;
	$: themes.getThemeById(slug);
	$: if (browser && community == undefined)
		window.location.href = `${PUBLIC_PROTOCOL}://www.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`;
</script>

<div class="flex w-full">
	<div class="lg:hidden">
		<Sidebar community={$community} subdomain={data.subdomain} />
	</div>
	<div
		class="z-0 flex h-screen w-full flex-col max-lg:shadow-2xl lg:fixed {$sidebarOpen
			? 'max-lg:translate-x-72'
			: ''}"
	>
		<Menu />
		<div class="flex h-0 w-full flex-grow">
			<CommunitiesBar />
			<div class="max-lg:hidden">
				<Sidebar community={$community} subdomain={data.subdomain} />
			</div>
			<slot />
		</div>
	</div>
</div>

<NewPostDialog />

<CommunitySettingsDialog />

<PostDialog />
