import { derived } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import session from '$lib/stores/session';
import { NDKEvent, type NDKFilter, profileFromEvent } from '@nostr-dev-kit/ndk';

export type Profile = {
	name: string | undefined;
	about: string | undefined;
	picture: string | undefined;
};

const profile = derived<[typeof ndk, typeof session], Profile | undefined>(
	[ndk, session],
	([$ndk, $session], set, update) => {
		const pubkey = $session.pubkey;

		if (!$ndk || !pubkey) return undefined;

		set({
			name: '',
			about: '',
			picture: `https://robohash.org/${pubkey}.png?set=set1&size=96x96`
		});

		const filters: NDKFilter = { authors: [pubkey], kinds: [0] };

		const subscription = $ndk.subscribe(filters, {
			closeOnEose: false,
			subId: `profile:${pubkey}`
		});

		const mostRecentEvents: Map<string, NDKEvent> = new Map();

		subscription.on('event', (event) => {
			const dedupKey = event.deduplicationKey();
			const existingEvent = mostRecentEvents.get(dedupKey);
			if (existingEvent && event.created_at! < existingEvent.created_at!) {
				return;
			}

			mostRecentEvents.set(dedupKey, event);

			const ndkProfile = profileFromEvent(event);

			set({
				name: ndkProfile.name,
				about: ndkProfile.about,
				picture: ndkProfile.image as string
			});
		});
	},
	undefined
);

export default profile;
