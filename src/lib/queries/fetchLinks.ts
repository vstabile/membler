import { get } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import community from '$lib/stores/community';
import { type NDKEvent, type NDKFilter, type NDKSubscription } from '@nostr-dev-kit/ndk';
import { LINKS_SET_EVENT_KIND } from '$lib/constants';
import db from '$lib/db';

let subscription: NDKSubscription | undefined;

export default async function fetchLinks(communityId: string) {
	const $ndk = get(ndk)!;
	const $community = get(community)!;

	if (subscription) subscription.stop();

	const lastLink = await db.links.orderBy('createdAt').last();

	let mostRecent = lastLink ? lastLink.createdAt + 1 : 0;

	const filter: NDKFilter = {
		authors: $community.moderators,
		kinds: [LINKS_SET_EVENT_KIND],
		'#d': [`${communityId}:links`],
		since: mostRecent
	};

	subscription = $ndk.subscribe(filter, { groupable: false });

	subscription.on('event', (event) => {
		if (!event.created_at || event.created_at < mostRecent) {
			return;
		}

		mostRecent = event.created_at;

		const updatedLinks = event.tags
			.filter((t) => t[0] === 'r')
			.map((t) => ({
				author: event.author.pubkey,
				communityId: communityId,
				title: t[2],
				url: t[1],
				createdAt: event.created_at!
			}));

		// Remove previous links from the same moderator
		db.links.where('[communityId+author]').equals([communityId, event.pubkey]).delete();

		// Add updated links
		db.links.bulkAdd(updatedLinks);
	});

	return subscription;
}
