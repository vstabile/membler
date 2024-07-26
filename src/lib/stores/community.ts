import { derived, writable } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';

export type Community = {
	id: string;
	name: string;
	icon?: string;
	logo?: string;
	subdomain: string;
	locale: string;
	moderators: string[];
};

export const atag = writable<string | null>(null);

const community = derived<[typeof ndk, typeof atag], Community>(
	[ndk, atag],
	([$ndk, $atag], set, update) => {
		if ($atag === null) return;

		const atagParts = $atag.split(':');
		const kind = parseInt(atagParts[0]);
		const pubkey = atagParts[1];
		const dtag = atagParts[2];

		const filters: NDKFilter = { authors: [pubkey], kinds: [kind], '#d': [dtag] };

		const subscription = $ndk.subscribe(filters, {
			closeOnEose: false,
			subId: `community:${$atag}`
		});

		const mostRecentEvents: Map<string, NDKEvent> = new Map();

		subscription.on('event', (event) => {
			const dedupKey = event.deduplicationKey();
			const existingEvent = mostRecentEvents.get(dedupKey);
			if (existingEvent && event.created_at! < existingEvent.created_at!) {
				return;
			}

			mostRecentEvents.set(dedupKey, event);

			const moderators = event
				.getMatchingTags('p')
				.filter((t: string[]) => t[t.length - 1] === 'moderator');

			const community = {
				id: dtag,
				name: event.tagValue('name'),
				icon: event.tagValue('icon'),
				logo: event.tagValue('logo'),
				subdomain: event.tagValue('membler'),
				locale: event.tagValue('locale'),
				moderators
			};

			set(community);
		});
	},
	undefined
);

export default community;
