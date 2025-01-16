import { derived } from 'svelte/store';
import ndk from './ndk';
import session from './session';
import fetchProfile from '$lib/queries/fetchProfile';
import db from '$lib/db';
import { liveQuery } from 'dexie';

const profile = derived([ndk, session], ([$ndk, $session], set) => {
	if (!$ndk || !$session || !$session.pubkey) {
		set(undefined);
		return;
	}

	const { pubkey } = $session;

	fetchProfile(pubkey);

	const subscription = liveQuery(() => db.profiles.get($session.pubkey!)).subscribe({
		next: (profile) => set(profile)
	});

	return () => subscription.unsubscribe();
});

export default profile;
