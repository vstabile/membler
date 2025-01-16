import ndk from '$lib/stores/ndk';
import { get } from 'svelte/store';
import debounce from 'lodash.debounce';
import type { NDKEvent } from '@nostr-dev-kit/ndk';
import db, { type Profile } from '$lib/db';

const REFRESH_INTERVAL = 24 * 60 * 60;

const queue: Set<string> = new Set();

async function fetchProfiles() {
	if (queue.size === 0) return;

	const pubkeys = Array.from(queue);
	queue.clear();

	const expiredTime = Date.now() / 1000 - REFRESH_INTERVAL;

	const existingProfiles = await db.profiles
		.where('pubkey')
		.anyOf(pubkeys)
		.filter((profile) => profile.updatedAt < expiredTime)
		.toArray();

	const existingPubkeys = existingProfiles.map((profile) => profile.pubkey);

	const filter = {
		authors: pubkeys.filter((pubkey) => !existingPubkeys.includes(pubkey)),
		kinds: [0]
	};

	const $ndk = get(ndk);

	$ndk.fetchEvents(filter).then((events) => {
		const profiles = Array.from(events).map((event: NDKEvent) => {
			const content = JSON.parse(event.content);

			return {
				pubkey: event.pubkey,
				name: content.name,
				picture: content.picture,
				about: content.about,
				updatedAt: event.created_at || Math.floor(Date.now() / 1000)
			};
		});

		db.profiles.bulkAdd(profiles);
	});
}

const debouncedFetchProfiles = debounce(fetchProfiles, 300);

export default function fetchProfile(pubkey: string) {
	queue.add(pubkey);

	debouncedFetchProfiles();
}
