import type { LayoutLoad } from './$types';
import { loadTranslations, locale } from '$lib/i18n';
import { get } from 'svelte/store';
import { atag } from '$lib/stores/community';

export const load: LayoutLoad = async ({ data }) => {
	atag.set(data.atag);

	return {};
};
