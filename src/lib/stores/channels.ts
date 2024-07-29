import { derived } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import community from '$lib/stores/community';
import { CHANNEL_EVENT_KIND, CHANNEL_METADATA_EVENT_KIND } from '$lib/constants';
import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';

type ChannelGroup = {
	name?: string;
	channels: Channel[];
};

type Channel = {
	id: string;
	emoji: string;
	name: string;
};

const channels = derived<[typeof ndk, typeof community], ChannelGroup[]>(
	[ndk, community],
	([$ndk, $community], set, update) => {
		if (!$ndk || !$community) return;

		const atag = $community.atag;
		const moderators = $community.moderators;

		const filters: NDKFilter = {
			authors: moderators,
			kinds: [CHANNEL_EVENT_KIND, CHANNEL_METADATA_EVENT_KIND],
			'#a': [atag]
		};

		const subscription = $ndk.subscribe(filters, {
			closeOnEose: false,
			subId: `channels:${atag}`
		});

		const mostRecentEvents: Map<string, NDKEvent> = new Map();

		subscription.on('event', (event) => {
			const dedupKey = event.deduplicationKey();
			const existingEvent = mostRecentEvents.get(dedupKey);
			if (existingEvent && event.created_at! < existingEvent.created_at!) {
				return;
			}

			mostRecentEvents.set(dedupKey, event);

			const content = JSON.parse(event.content);
			const groupName = content.group;
			const id = event.kind === CHANNEL_EVENT_KIND ? event.id : event.tagValue('e');

			const channel = {
				id: id,
				emoji: content.emoji,
				name: content.name
			};

			update((groups: ChannelGroup[]) => {
				let targetGroup = groups.find((g) => g.name === groupName);

				// Create new group if it doesn't exist
				if (!targetGroup) {
					targetGroup = { name: groupName, channels: [] };
					groups = [...groups, targetGroup];
				}

				// Remove channel from old group
				groups.forEach((g) => {
					if (g.name !== groupName) {
						const channelIndex = g.channels.findIndex((c) => c.id === id);
						if (channelIndex !== -1) {
							g.channels.splice(channelIndex, 1);
						}
					}
				});

				// Add or update the channel in the target group
				const existingChannel = targetGroup.channels.find((c) => c.id === id);
				if (existingChannel) {
					existingChannel.name = channel.name;
				} else {
					targetGroup.channels = [...targetGroup.channels, channel];
				}

				// Remove empty groups
				groups = groups.filter((g) => g.channels.length > 0);

				return groups;
			});
		});
	},
	[]
);

export default channels;
