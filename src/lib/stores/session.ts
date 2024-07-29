import { PUBLIC_DOMAIN } from '$env/static/public';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type SignInMethod = 'pk' | 'nip07' | null;

export type Session = {
	pubkey: string | null;
	signInMethod: SignInMethod;
	privateKey: string | undefined;
	locale: string;
	consent: boolean | undefined;
};

const emptySession: Session = {
	pubkey: null,
	signInMethod: null,
	privateKey: undefined,
	locale: 'en',
	consent: undefined
};

const restoreSession = () => {
	if (!browser) return emptySession;
	const cookie = document.cookie.split('; ').find((row) => row.startsWith('session='));
	return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : emptySession;
};

function createSessionStore() {
	const { subscribe, set, update } = writable<Session>(restoreSession());

	return {
		subscribe,
		update,
		set: (pubkey: string, signInMethod: SignInMethod, privateKey?: string) => {
			update((session) => {
				if (signInMethod === 'pk' && !privateKey) {
					throw new Error('Private key required for pk sign in method');
				}
				return { ...session, pubkey, signInMethod, privateKey };
			});
		},
		setLocale: (newLocale: string) => {
			update((session) => ({ ...session, locale: newLocale }));
		},
		setConsent: (consent: boolean) => {
			update((session) => ({ ...session, consent: consent }));
		},
		clear: () => set(emptySession)
	};
}

const session = createSessionStore();

session.subscribe((s) => {
	if (!browser) return;
	document.cookie = `session=${encodeURIComponent(JSON.stringify(s))}; path=/; domain=.${PUBLIC_DOMAIN}; SameSite=Lax;`;
});

export default session;
