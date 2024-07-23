import { persisted } from 'svelte-persisted-store';
import { type NDKUserProfile } from '@nostr-dev-kit/ndk';

export type Profile = {
	name: string | undefined;
	about: string | undefined;
	picture: string | undefined;
};

const emptyProfile: Profile = {
	name: undefined,
	about: undefined,
	picture: undefined
};

function createProfileStore() {
	const { subscribe, set, update } = persisted<Profile>('profile', emptyProfile);

	return {
		subscribe,
		set: (ndkProfile: NDKUserProfile) => {
			set({
				name: ndkProfile.name,
				about: ndkProfile.about,
				picture: ndkProfile.picture as string
			});
		},
		clear: () => set(emptyProfile)
	};
}

const profile = createProfileStore();

export default profile;
