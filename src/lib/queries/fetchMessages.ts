import { get } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import { type NDKEvent, type NDKFilter, type NDKSubscription } from '@nostr-dev-kit/ndk';
import { MESSAGE_EVENT_KIND } from '$lib/constants';
import db from '$lib/db';
import fetchProfile from './fetchProfile';

let subscription: NDKSubscription | undefined;

async function incrementComments(replyTo: string) {
	await db
		.transaction('rw', db.messages, async () => {
			const stack = [replyTo];

			while (stack.length > 0) {
				const currentReplyTo = stack.pop();

				await db.messages
					.where('id')
					.equals(currentReplyTo!)
					.modify((message) => {
						message.comments += 1;

						if (message.replyTo) {
							stack.push(message.replyTo);
						}
					});
			}
		})
		.catch((error) => {
			console.error('Failed to increment comments:', error);
		});
}

export default async function fetchMessages(communityId: string, channelIds: string | string[]) {
	const $ndk = get(ndk)!;

	if (subscription) subscription.stop();

	const lastMessage = await db.messages.orderBy('createdAt').last();

	const filter: NDKFilter = {
		kinds: [MESSAGE_EVENT_KIND],
		'#e': typeof channelIds === 'string' ? [channelIds] : channelIds,
		since: lastMessage ? lastMessage.createdAt + 1 : 0
	};

	subscription = $ndk.subscribe(filter, { groupable: false });

	const mostRecentEvents: Map<string, NDKEvent> = new Map();

	subscription.on('event', (event) => {
		const dedupKey = event.deduplicationKey();
		const existingEvent = mostRecentEvents.get(dedupKey);
		if (!event.created_at || (existingEvent && event.created_at! < existingEvent.created_at!)) {
			return;
		}

		mostRecentEvents.set(dedupKey, event);

		const channelId = event
			.getMatchingTags('e')
			.filter((tag) => tag[tag.length - 1] === 'root')[0]?.[1];
		const replyTo = event
			.getMatchingTags('e')
			.filter((tag) => tag[tag.length - 1] === 'reply')[0]?.[1];
		const title = event.tagValue('title');

		db.messages.add({
			id: event.id,
			communityId: communityId,
			channelId: channelId,
			replyTo,
			title,
			content: event.content,
			pubkey: event.pubkey,
			likes: 0,
			comments: 0,
			createdAt: event.created_at
		});

		if (replyTo) incrementComments(replyTo);

		fetchProfile(event.pubkey);
	});

	return subscription;
}
