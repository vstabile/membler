import { derived, writable } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';

export type Community = {
	id: string;
	name?: string;
	icon?: string;
	logo?: string;
	subdomain?: string;
	locale?: string;
	atag: string;
	naddr: string;
	moderators: string[];
};

export const atag = writable<string | null>(null);

const community = derived<[typeof ndk, typeof atag], Community | null>(
	[ndk, atag],
	([$ndk, $atag], set, update) => {
		if (!$atag) return;

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
				.filter((t: string[]) => t[t.length - 1] === 'moderator')
				.map((t: string[]) => t[1]);

			const naddr = nip19.naddrEncode({
				kind: event.kind!,
				pubkey: event.pubkey,
				identifier: event.tagValue('d')!
			});

			const community = {
				id: dtag,
				name: event.tagValue('name'),
				icon: event.tagValue('icon'),
				logo: event.tagValue('logo'),
				subdomain: event.tagValue('membler'),
				locale: event.tagValue('locale'),
				atag: $atag,
				naddr,
				moderators
			};

			set(community);
		});
	},
	undefined
);

export default community;
