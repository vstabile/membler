import { derived } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import session from '$lib/stores/session';
import {
	NDKEvent,
	type NDKFilter,
	type NDKUserProfile,
	profileFromEvent
} from '@nostr-dev-kit/ndk';

export type Profile = {
	name: string | undefined;
	about: string | undefined;
	picture: string | undefined;
};

const emptyProfile: Profile = {
	name: undefined,
	about: undefined,
	picture: undefined
};

// function createProfileStore() {
// 	const { subscribe, set, update } = persisted<Profile>('profile', emptyProfile);

// 	return {
// 		subscribe,
// 		set: (ndkProfile: NDKUserProfile) => {
// 			set({
// 				name: ndkProfile.name,
// 				about: ndkProfile.about,
// 				picture: ndkProfile.picture as string
// 			});
// 		},
// 		clear: () => set(emptyProfile)
// 	};
// }

const profile = derived(
	[ndk, session],
	([$ndk, $session], set) => {
		const pubkey = $session.user?.pubkey;

		if (!$ndk || !$session.user || !pubkey) return set(emptyProfile);

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
	emptyProfile
);

export default profile;
