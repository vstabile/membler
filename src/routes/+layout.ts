import type { LayoutLoad } from './$types';
import { atag } from '$lib/stores/community';

export const load: LayoutLoad = async ({ data }) => {
	atag.set(data.atag);

	return { atag: data.atag };
};
