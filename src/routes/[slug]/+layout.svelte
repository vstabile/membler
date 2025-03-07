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
	import type { NDKEvent, NDKFilter, NDKSubscription } from '@nostr-dev-kit/ndk';
	import { THEME_SETTINGS_EVENT_KIND } from '$lib/constants.js';
	import ndk from '$lib/stores/ndk.js';

	export let data;

	atag.set(data.atag);

	$: slug = $page.params.slug;
	$: themes.getThemeById(slug);
	$: if (browser && community == undefined)
		window.location.href = `${PUBLIC_PROTOCOL}://www.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`;

	let filters: NDKFilter | undefined;

	let subscription: NDKSubscription | undefined;

	$: if (slug && $community) {
		filters = {
			authors: $community?.moderators,
			kinds: [THEME_SETTINGS_EVENT_KIND],
			'#d': [`membler:theme:${slug}`]
		};

		if (subscription) {
			subscription.stop();
		}

		subscription = $ndk.subscribe(filters, {
			closeOnEose: false,
			subId: `theme:${slug}`,
			groupable: false
		});

		const mostRecentEvents: Map<string, NDKEvent> = new Map();

		subscription.on('event', (event: NDKEvent) => {
			const dedupKey = event.deduplicationKey();
			const existingEvent = mostRecentEvents.get(dedupKey);
			if (existingEvent && event.created_at! < existingEvent.created_at!) {
				return;
			}

			mostRecentEvents.set(dedupKey, event);

			themes.applyThemeEvent(event);
		});
	}
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
