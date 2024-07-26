export function reroute({ url }) {
	const split = url.hostname.split('.');
	const subdomain = split[0];

	if (subdomain !== 'www') {
		return `/communities/${subdomain}${url.pathname}`;
	}
}
