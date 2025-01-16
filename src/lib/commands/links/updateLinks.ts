import { LINKS_SET_EVENT_KIND } from '$lib/constants';
import ndk from '$lib/stores/ndk';
import session from '$lib/stores/session';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { get } from 'svelte/store';

const updateLinks = async (communityId: string, links: { title: string; url: string }[]) => {
	const $ndk = get(ndk);
	const $session = get(session);

	const pubkey = $session.pubkey!;
	const linkTags = links.map(({ title, url }) => ['r', url, title]);

	const event = new NDKEvent($ndk, {
		pubkey,
		content: '',
		created_at: Math.floor(Date.now() / 1000),
		kind: LINKS_SET_EVENT_KIND,
		tags: [...[['d', `${communityId}:links`]], ...linkTags]
	});

	return event.publish();
};

export default updateLinks;
