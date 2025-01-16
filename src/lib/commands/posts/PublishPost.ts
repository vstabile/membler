import { MESSAGE_EVENT_KIND } from '$lib/constants';
import ndk from '$lib/stores/ndk';
import session from '$lib/stores/session';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { get } from 'svelte/store';

const publishPost = async (
	article: { title?: string; summary?: string; content?: string },
	naddr?: string
) => {
	const $ndk = get(ndk);
	const $session = get(session);

	// Validations
	if (!$ndk || !$session) return Promise.reject(new Error('User not connected'));

	const pubkey = $session.pubkey!;

	const event = new NDKEvent($ndk, {
		pubkey,
		content: '',
		created_at: Math.floor(Date.now() / 1000),
		kind: MESSAGE_EVENT_KIND,
		tags: [['e', $formData.channelId, PUBLIC_APP_RELAY, 'root']]
	});

	await event.publish();

	return Promise.resolve(event.encode());
};

export default publishPost;
