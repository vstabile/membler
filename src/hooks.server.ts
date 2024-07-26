import redis from '$lib/redis';
import NodeCache from 'node-cache';
import { error } from '@sveltejs/kit';
import { PUBLIC_RESERVED_SUBDOMAINS } from '$env/static/public';

const cache = new NodeCache({ stdTTL: 600 });

export async function handle({ event, resolve }) {
	const split = event.url.hostname.split('.');
	const subdomain = split[0];
	const subdomainKey = `subdomain:${subdomain}`;

	if (!PUBLIC_RESERVED_SUBDOMAINS.split(',').includes(subdomain)) {
		let atag = cache.get(subdomainKey);

		if (!atag) {
			atag = await redis.get(subdomainKey);
			if (atag) cache.set(subdomainKey, atag);
		}

		if (atag) {
			event.locals.atag = atag as string;
		} else {
			error(404, {
				message: 'Community not found'
			});
		}
	}

	const response = await resolve(event);
	return response;
}
