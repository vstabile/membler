import { get } from 'svelte/store';
import ndk from '$lib/stores/ndk';
import session from '$lib/stores/session';
import profile from '$lib/stores/profile';
import { type SignInMethod } from './stores/session';
import { goto } from '$app/navigation';
import { NDKPrivateKeySigner, NDKNip07Signer } from '@nostr-dev-kit/ndk';

const $ndk = get(ndk);

async function signIn(method?: SignInMethod) {
	const $session = get(session);
	method = $session.signInMethod;

	switch (method) {
		case 'pk': {
			await pkSignIn();
			break;
		}
		case 'nip07': {
			await nip07SignIn();
			break;
		}
	}
}

export default signIn;

export async function pkSignIn(privateKey?: string) {
	privateKey ??= get(session).privateKey;
	if (!privateKey) {
		session.clear();
		return null;
	}
	$ndk.signer = new NDKPrivateKeySigner(privateKey);
	const user = await $ndk.signer?.blockUntilReady();
	user.ndk = $ndk;
	session.set(user.pubkey, 'pk', privateKey);
}

export async function nip07SignIn() {
	if (window.nostr) {
		$ndk.signer = new NDKNip07Signer();
		const user = await $ndk.signer?.blockUntilReady();
		user.ndk = $ndk;
		session.set(user.pubkey, 'nip07');
	} else {
		session.clear();
	}
}

export function signOut(): void {
	$ndk.signer = undefined;
	session.clear();

	goto('/');
}
