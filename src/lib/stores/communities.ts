import { derived, writable } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import session from '$lib/stores/session';
import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { COMMUNITY_EVENT_KIND, COMMUNITIES_LIST_EVENT_KIND } from '$lib/constants';

type Community = {
	id: string;
	name: string;
	icon?: string;
	logo?: string;
	subdomain?: string;
};

const mockCommunities: Community[] = [
	{
		id: 'a',
		name: 'Comunidade Micro-SaaS',
		subdomain: 'a',
		icon: 'https://assets.circle.so/2xwyg99ougbzfoa1qe9ikcmzfi04',
		logo: 'https://assets.circle.so/5sh1p5yvgndaup8ppkioo0qkuxy6'
	},
	{
		id: 'b',
		name: 'Próspera City Builders Network',
		subdomain: 'b',
		icon: 'https://app.circle.so/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCRW91QWdFPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--442507973b2e039c83628ee85eb3e82080547602/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNITUdscE9ncHpZWFpsY25zR09ncHpkSEpwY0ZRPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--d6fcae52537a39639a1a2b8c72a020b984e78eaf/Prospera%20Logo%20Arrows@3x.png',
		logo: 'https://app.circle.so/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCQjdXTndFPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--228a082f36af5f9840760e7faa587c05d7507055/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNITUdrQ2FBRTZDbk5oZG1WeWV3WTZDbk4wY21sd1ZBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e7ed929538cfb0e8497fbd036110b7591e89532a/logo-prospera-color@2x.png'
	},
	{
		id: 'c',
		subdomain: 'c',
		name: "Victor's Community"
	}
];

export const communitiesList = derived<[typeof ndk, typeof session], string[]>(
	[ndk, session],
	([$ndk, $session], set, update) => {
		if (!$session?.pubkey) return;

		const pubkey = $session.pubkey;

		const filters: NDKFilter = { kinds: [COMMUNITIES_LIST_EVENT_KIND], authors: [pubkey] };

		const subscription = $ndk.subscribe(filters, {
			closeOnEose: false,
			subId: `communities-list`
		});

		const mostRecentEvents: Map<string, NDKEvent> = new Map();

		subscription.on('event', (event: NDKEvent) => {
			const dedupKey = event.deduplicationKey();
			const existingEvent = mostRecentEvents.get(dedupKey);
			if (existingEvent && event.created_at! < existingEvent.created_at!) {
				return;
			}

			mostRecentEvents.set(dedupKey, event);

			const list = event.tags.filter((t) => t[0] === 'a').map((t) => t[1]);

			set(list);
		});
	},
	[]
);

const communities = derived<[typeof ndk, typeof communitiesList], Community[]>(
	[ndk, communitiesList],
	([$ndk, $communitiesList], set, update) => {
		if ($communitiesList.length === 0) return;

		const filters: NDKFilter[] = Array.from($communitiesList).map((m: string) => ({
			kinds: [COMMUNITY_EVENT_KIND as number],
			authors: [m.split(':')[1]],
			'#d': [m.split(':')[2]]
		}));

		const subscription = $ndk.subscribe(filters, {
			closeOnEose: false,
			subId: `memberships`
		});

		const mostRecentEvents: Map<string, NDKEvent> = new Map();

		subscription.on('event', (event) => {
			const dedupKey = event.deduplicationKey();
			const existingEvent = mostRecentEvents.get(dedupKey);
			if (existingEvent && event.created_at! < existingEvent.created_at!) {
				return;
			}

			mostRecentEvents.set(dedupKey, event);

			const community_id = event.tagValue('d');
			const community_name = event.tagValue('name');
			if (!community_id || !community_name) return;

			const community = {
				id: community_id,
				name: community_name,
				icon: event.tagValue('icon'),
				logo: event.tagValue('logo'),
				subdomain: event.tagValue('membler')
			};

			update((communities) => {
				const existingCommunityIndex = communities.findIndex((c) => c.id === community.id);
				if (existingCommunityIndex > -1) {
					communities[existingCommunityIndex] = community;
				} else {
					communities.push(community);
				}

				communities.sort((a, b) => a.name.localeCompare(b.name));

				return communities;
			});
		});
	},
	[]
);

export default communities;
