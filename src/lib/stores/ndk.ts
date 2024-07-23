import NDK from '@nostr-dev-kit/ndk';
import { writable } from 'svelte/store';
import { PUBLIC_RELAYS } from '$env/static/public';

const _ndk = new NDK({
	explicitRelayUrls: PUBLIC_RELAYS.split(',')
});

const ndk = writable(_ndk);

export default ndk;
