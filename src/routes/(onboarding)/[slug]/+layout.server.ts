import { nip19 } from 'nostr-tools';
import { t } from '$lib/i18n';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params, locals }) {
	const $t = get(t);
	let atag = locals.atag;
	const slug = params.slug;

	if (!atag && slug && slug.startsWith('naddr')) {
		let bech32;
		try {
			bech32 = nip19.decode(slug);
		} catch (e) {
			error(400, $t('errors.naddr-invalid'));
		}
		const naddrData = bech32.data as { kind: number; pubkey: string; identifier: string };
		atag = `${naddrData.kind}:${naddrData.pubkey}:${naddrData.identifier}`;
	} else if (!atag) {
		error(400, $t('errors.naddr-invalid'));
	}

	return {
		atag: atag,
		subdomain: locals.subdomain
	};
}
