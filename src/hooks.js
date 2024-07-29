import { PUBLIC_RESERVED_SUBDOMAINS } from '$env/static/public';

const SHARED_PATHS = ['/sign-in', '/sign-up'];

export function reroute({ url }) {
	const split = url.hostname.split('.');
	const subdomain = split[0];

	if (
		!PUBLIC_RESERVED_SUBDOMAINS.split(',').includes(subdomain) &&
		!SHARED_PATHS.includes(url.pathname)
	) {
		return `/${subdomain}${url.pathname}`;
	}
}
