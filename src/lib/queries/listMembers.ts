import { get, writable } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import {
	profileFromEvent,
	type NDKEvent,
	type NDKFilter,
	type NDKSubscription,
	type NDKTag
} from '@nostr-dev-kit/ndk';
import { COMMUNITY_EVENT_KIND, MEMBERS_SET_EVENT_KIND } from '$lib/constants';

export type Member = {
	pubkey: string;
	invitedBy: string[];
	name?: string;
	picture?: string;
	isModerator?: boolean;
};

let subscription: NDKSubscription | undefined;

export default function listMembers(dTag: string) {
	const { subscribe, set, update } = writable<Member[] | []>([]);

	const $ndk = get(ndk)!;

	if (subscription) subscription.stop();

	$ndk
		.fetchEvent({
			kinds: [COMMUNITY_EVENT_KIND as number],
			'#d': [dTag]
		})
		.then((communityEvent) => {
			if (!communityEvent) return;

			const moderators = communityEvent
				.getMatchingTags('p')
				.filter((t: string[]) => t[t.length - 1] === 'moderator')
				.map((t: string[]) => t[1]);

			set(moderators.map((pubkey) => ({ pubkey, invitedBy: [], isModerator: true })));

			const filter: NDKFilter = {
				authors: moderators,
				kinds: [MEMBERS_SET_EVENT_KIND],
				'#d': [dTag]
			};

			subscription = $ndk.subscribe(filter, { groupable: false });

			const mostRecentEvents: Map<string, Map<string, NDKEvent>> = new Map();

			subscription.on('event', (event) => {
				let moderatorsEvents = mostRecentEvents.get(event.pubkey);
				if (!moderatorsEvents) {
					moderatorsEvents = new Map();
					mostRecentEvents.set(event.pubkey, moderatorsEvents);
				}

				const dedupKey = event.deduplicationKey();
				const existingEvent = moderatorsEvents?.get(dedupKey);
				if (existingEvent && event.created_at! < existingEvent.created_at!) {
					return;
				}

				moderatorsEvents.set(dedupKey, event);

				update((members) => {
					const previouslyInvited = members
						.filter((member) => {
							member.invitedBy.includes(event.pubkey);
						})
						.map((member) => member.pubkey);

					const currentlyInvited = event.tags
						.filter((tag: NDKTag) => tag[0] === 'p')
						.map((tag: NDKTag) => tag[1]);

					let added = currentlyInvited.filter(
						(pubkey: string) => !previouslyInvited.includes(pubkey)
					);
					const removed = previouslyInvited.filter(
						(pubkey: string) => !currentlyInvited.includes(pubkey)
					);

					const oldMembers = members
						.map((member) => {
							if (removed.includes(member.pubkey)) {
								member.invitedBy = member.invitedBy.filter((pubkey) => pubkey !== event.pubkey);
							} else if (added.includes(member.pubkey)) {
								member.invitedBy.push(event.pubkey);
								added = added.filter((pubkey: string) => pubkey !== member.pubkey);
							}
							return member;
						})
						.filter((member) => member.invitedBy.length > 0);

					const newMembers = added.map((pubkey: string) => ({ pubkey, invitedBy: [event.pubkey] }));

					const updatedMembers = [...oldMembers, ...newMembers];

					fetchProfiles(updatedMembers);

					return updatedMembers;
				});
			});

			function fetchProfiles(members: Member[]) {
				const pubkeys = members
					.filter((member) => !member.name && !member.picture)
					.map((member) => member.pubkey);

				$ndk.fetchEvents({ authors: pubkeys, kinds: [0] }).then((events) => {
					update((members) => {
						events.forEach((event) => {
							let member = members.find((m) => m.pubkey === event.pubkey);
							const profile = profileFromEvent(event);

							member!.name = profile.name;
							member!.picture = profile.image;
						});

						return members;
					});
				});
			}
		});

	return {
		subscribe
	};
}
