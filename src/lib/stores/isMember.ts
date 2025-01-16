import { derived } from 'svelte/store';
import session from './session';
import members from './members';

const isMember = derived<[typeof session, typeof members], boolean>(
	[session, members],
	([$session, $members], set) => {
		if (!$session?.pubkey || $members.length === 0) return;
		set($members.map((m) => m.pubkey).includes($session.pubkey));
	},
	false
);

export default isMember;
