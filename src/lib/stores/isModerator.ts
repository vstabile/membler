import { derived } from 'svelte/store';
import session from '$lib/stores/session';
import community from '$lib/stores/community';

const isModerator = derived<[typeof session, typeof community], boolean>(
	[session, community],
	([$session, $community]) => {
		if (!$session?.pubkey || !$community) return false;

		return $community.moderators.includes($session.pubkey);
	}
);

export default isModerator;
