import { z } from 'zod';
import { PUBLIC_RESERVED_SUBDOMAINS } from '$env/static/public';

const SUBDOMAIN_REGEX = /^[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?$/;
const ATAG_REGEX = /^34550:[a-f0-9]{64}:[^:]+$/;
const FORBIDDEN_SUBDOMAINS = PUBLIC_RESERVED_SUBDOMAINS.split(',');

export const formSchema = z.object({
	name: z.string().min(1, { message: 'community-name-required' }),
	subdomain: z
		.string()
		.max(63, { message: 'subdomain-length' })
		.regex(SUBDOMAIN_REGEX, {
			message: 'subdomain-regex'
		})
		.refine((value) => !FORBIDDEN_SUBDOMAINS.includes(value), {
			message: 'subdomain-forbidden'
		}),
	locale: z.enum(['en', 'pt'], { required_error: 'community-locale-required' }),
	atag: z.string().regex(ATAG_REGEX)
});

export type FormSchema = typeof formSchema;
