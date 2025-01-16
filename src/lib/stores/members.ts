import { derived } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import { atag } from '$lib/stores/community';
import listMembers, { type Member } from '$lib/queries/listMembers';

let unsubscribe: any;

const members = derived<[typeof ndk, typeof atag], Member[]>(
	[ndk, atag],
	([$ndk, $atag], set, update) => {
		if (!$ndk || !$atag) return;

		const dTag = $atag.split(':')[2];

		if (unsubscribe) unsubscribe();

		const { subscribe } = listMembers(dTag);

		unsubscribe = subscribe((members) => set(members));
	},
	[]
);

export default members;
