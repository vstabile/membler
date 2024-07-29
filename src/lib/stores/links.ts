import { derived } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import community from '$lib/stores/community';
import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { LINKS_SET_EVENT_KIND } from '$lib/constants';

type Link = {
	title: string;
	url: string;
	author: string;
};

const links = derived<[typeof ndk, typeof community], Link[]>(
	[ndk, community],
	([$ndk, $community], set, update) => {
		if (!$ndk || !$community) return;

		const dtag = $community.atag.split(':')[2];
		const moderators = $community.moderators;

		const filters: NDKFilter = {
			authors: moderators,
			kinds: [LINKS_SET_EVENT_KIND],
			'#d': [dtag]
		};

		const subscription = $ndk.subscribe(filters, {
			closeOnEose: false,
			subId: `links:${$community.atag}`
		});

		const mostRecentEvents: Map<string, NDKEvent> = new Map();

		subscription.on('event', (event: NDKEvent) => {
			const dedupKey = event.deduplicationKey();
			const existingEvent = mostRecentEvents.get(dedupKey);
			if (existingEvent && event.created_at! < existingEvent.created_at!) {
				return;
			}

			mostRecentEvents.set(dedupKey, event);

			update((links) => {
				// Remove previous links from the same moderator
				links = links.filter((l) => l.author !== event.author.pubkey);

				const newLinks = event.tags
					.filter((t) => t[0] === 'r')
					.map((t) => ({
						title: t[2],
						url: t[1],
						author: event.author.pubkey
					}));

				return [...links, ...newLinks];
			});
		});
	},
	[]
);

export default links;
