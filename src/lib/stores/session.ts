import { persisted } from 'svelte-persisted-store';
import { NDKUser } from '@nostr-dev-kit/ndk';

export type SignInMethod = 'pk' | 'nip07' | undefined;

export type Session = {
	signInMethod: SignInMethod;
	user: NDKUser | undefined;
	privateKey: string | undefined;
};

const emptySession: Session = {
	signInMethod: undefined,
	user: undefined,
	privateKey: undefined
};

function createSessionStore() {
	const { subscribe, set, update } = persisted<Session, Session>('session', emptySession);

	return {
		subscribe,
		set: (user: NDKUser, signInMethod: SignInMethod, privateKey?: string) => {
			update((session) => {
				if (signInMethod === 'pk' && !privateKey) {
					throw new Error('Private key required for pk sign in method');
				}
				return { ...session, user, signInMethod, privateKey };
			});
		},
		clear: () => set(emptySession)
	};
}

const session = createSessionStore();

export default session;
