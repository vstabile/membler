import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/schemas/community';
import redis from '$lib/redis';
import { fail } from '@sveltejs/kit';

export const load = async () => {
	const form = await superValidate(zod(formSchema));

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const form = await superValidate(data, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const subdomain = data.get('subdomain') as string;
		const subdomainKey = `subdomain:${subdomain}`;
		const existingValue = await redis.get(subdomainKey);

		if (existingValue) {
			return setError(form, 'subdomain', 'subdomain-taken');
		} else {
			const atag = data.get('atag') as string;
			const pubkey = atag.split(':')[1];

			await redis.multi().set(subdomainKey, atag).sadd(`subdomains:${pubkey}`, subdomain).exec();
		}

		return { form };
	}
};
