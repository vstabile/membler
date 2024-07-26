<script lang="ts">
	import Onboarding from '$lib/components/Onboarding.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import LucideLoader from '~icons/lucide/loader';
	import session from '$lib/stores/session';
	import profile from '$lib/stores/profile';
	import { t, locale } from '$lib/i18n';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './schema';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { v4 as uuidv4 } from 'uuid';
	import ndk from '$lib/stores/ndk';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { replaceState } from '$app/navigation';
	import { PUBLIC_DOMAIN, PUBLIC_PORT, PUBLIC_PROTOCOL } from '$env/static/public';

	export let data: { form: SuperValidated<Infer<FormSchema>> };

	let loading = false;
	const encodedPath = encodeURIComponent('/communities/new');

	if (browser && !$session.user) {
		const previousPath = sessionStorage.getItem('previousPath') || '/';
		replaceState(previousPath, {});
		goto(`/sign-in?redirectUrl=${encodedPath}`);
	}

	$: atag = `34550:${$session.user?.pubkey}:${uuidv4()}`;
	$: name = $profile?.name ? `${$profile.name}'s Community` : '';
	$: subdomain = $profile?.name
		? `${$profile.name}-community`
				.toLowerCase()
				.trim()
				.replace(/[\W_]+/g, '-')
		: '';

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		resetForm: false,
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			if (result.type !== 'success') {
				loading = false;
				return;
			}
			const data = result.data!.form.data;
			const timeout = new Promise((resolve) => setTimeout(resolve, 400));
			Promise.all([publishEvent(data), timeout]).then(() => {
				window.location.href = `${PUBLIC_PROTOCOL}://${data.subdomain}.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`;
			});
		}
	});

	const { form: formData, enhance } = form;

	$: if ($profile && $formData.name === '' && $formData.subdomain === '') {
		$formData = {
			name: name,
			subdomain: subdomain,
			locale: 'en',
			atag
		};
	}

	$: selectedLocale = $formData.locale
		? {
				label: $t(`locales.${$formData.locale}`),
				value: $formData.locale
			}
		: undefined;

	async function publishEvent(data: any) {
		const pubkey = $session.user!.pubkey;

		const event = new NDKEvent($ndk, {
			pubkey: pubkey,
			content: '',
			created_at: Math.floor(Date.now() / 1000),
			kind: 34550,
			tags: [
				['d', data.atag.split(':')[2]],
				['name', data.name],
				['membler', data.subdomain],
				['locale', data.locale],
				['p', pubkey, 'wss://relay.membler.club', 'moderator'],
				['relay', 'wss://relay.membler.club']
			]
		});

		return event.publish();
	}
</script>

<Onboarding title={$t('create-community-title')} text={$t('create-community-text')}>
	<form method="POST" use:enhance>
		<div>
			<div class="flex w-full flex-col gap-1.5">
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>{$t('name')}</Form.Label>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder={$t('community-name-placeholder')}
							autocomplete="off"
							bind:value={$formData.name}
							disabled={loading}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="flex w-full flex-col gap-1.5 pt-6">
				<Form.Field {form} name="subdomain">
					<Form.Control let:attrs>
						<Form.Label>{$t('community-url')}</Form.Label>
						<div class="flex">
							<Input
								{...attrs}
								name="subdomain"
								type="text"
								id="subdomain"
								placeholder={$t('community-subdomain-placeholder')}
								class="rounded-r-none"
								autocomplete="off"
								bind:value={$formData.subdomain}
								disabled={loading}
							/>
							<div
								class="flex h-10 items-center justify-center rounded-r-md border-[1px] border-l-0 border-gray-200 bg-white px-4 text-sm text-gray-500"
							>
								membler.club
							</div>
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="flex w-full flex-col gap-1.5 pt-6">
				<Form.Field {form} name="locale">
					<Form.Control let:attrs>
						<Form.Label>{$t('default-locale')}</Form.Label>
						<Select.Root
							selected={selectedLocale}
							onSelectedChange={(v) => {
								if (v && (v.value === 'en' || v.value === 'pt')) {
									$formData.locale = v.value;
								}
							}}
							disabled={loading}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder={$t('select')} />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="en" label="English" on:click={() => locale.set('en')} />
								<Select.Item value="pt" label="Portuguese" on:click={() => locale.set('pt')} />
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.locale} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</div>
		<div class="mt-10 w-full text-center">
			<div class="mx-auto flex w-full justify-end">
				<input type="hidden" name="atag" value={atag} />
				<Button type="submit" class="min-w-28 px-6" disabled={loading}>
					<span class:hidden={!loading} class="animate-spin"><LucideLoader /></span>
					<span class:hidden={loading}>{$t('next')}</span>
				</Button>
			</div>
		</div>
	</form>
</Onboarding>
