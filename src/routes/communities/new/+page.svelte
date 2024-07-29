<script lang="ts">
	import Onboarding from '$lib/components/Onboarding.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import LucideLoader from '~icons/lucide/loader';
	import session from '$lib/stores/session';
	import profile from '$lib/stores/profile';
	import { t } from '$lib/i18n';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './schema';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { v4 as uuidv4 } from 'uuid';
	import { uuidToBase64 } from '$lib/utils';
	import ndk from '$lib/stores/ndk';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { replaceState } from '$app/navigation';
	import {
		COMMUNITIES_LIST_EVENT_KIND,
		COMMUNITY_EVENT_KIND,
		MEMBERS_SET_EVENT_KIND
	} from '$lib/constants';
	import { communitiesList } from '$lib/stores/communities';
	import {
		PUBLIC_DOMAIN,
		PUBLIC_PORT,
		PUBLIC_PROTOCOL,
		PUBLIC_APP_PUBKEY,
		PUBLIC_APP_RELAY,
		PUBLIC_NIP89_IDENTIFIER
	} from '$env/static/public';

	export let data: { form: SuperValidated<Infer<FormSchema>> };

	let publishing = false;
	const encodedPath = encodeURIComponent('/communities/new');

	if (browser && !$session.pubkey) {
		const previousPath = sessionStorage.getItem('previousPath') || '/';
		replaceState(previousPath, {});
		goto(`/sign-in?redirectUrl=${encodedPath}`);
	}

	const dtag = uuidToBase64(uuidv4());
	$: atag = `${COMMUNITY_EVENT_KIND}:${$session.pubkey}:${dtag}`;
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
			publishing = true;
		},
		onResult: ({ result }) => {
			if (result.type !== 'success') {
				publishing = false;
				return;
			}
			const data = result.data!.form.data;
			const timeout = new Promise((resolve) => setTimeout(resolve, 400));
			Promise.all([publishEvents(data), timeout]).then(() => {
				window.location.href = `${PUBLIC_PROTOCOL}://${data.subdomain}.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`;
			});
		}
	});

	const { form: formData, enhance } = form;

	$: if (
		$profile &&
		$formData.name === '' &&
		$formData.subdomain === '' &&
		$formData.locale === 'en'
	) {
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

	async function publishEvents(data: any) {
		const pubkey = $session.pubkey!;
		const dtag = data.atag.split(':')[2];

		const communityEvent = new NDKEvent($ndk, {
			pubkey,
			content: '',
			created_at: Math.floor(Date.now() / 1000),
			kind: COMMUNITY_EVENT_KIND,
			tags: [
				['d', dtag],
				['name', data.name],
				['membler', data.subdomain],
				['locale', data.locale],
				['p', pubkey, PUBLIC_APP_RELAY, 'moderator'],
				['alt', data.name],
				[
					'client',
					'Membler',
					`31990:${PUBLIC_APP_PUBKEY}:${PUBLIC_NIP89_IDENTIFIER}`,
					PUBLIC_APP_RELAY
				],
				['relay', PUBLIC_APP_RELAY]
			]
		});

		const listEvent = new NDKEvent($ndk, {
			pubkey,
			content: '',
			created_at: Math.floor(Date.now() / 1000),
			kind: COMMUNITIES_LIST_EVENT_KIND,
			tags: [...$communitiesList, data.atag].map((atag) => ['a', atag])
		});

		const membersEvent = new NDKEvent($ndk, {
			pubkey,
			content: '',
			created_at: Math.floor(Date.now() / 1000),
			kind: MEMBERS_SET_EVENT_KIND,
			tags: [
				['d', dtag],
				['a', data.atag],
				['p', pubkey]
			]
		});

		return Promise.all([communityEvent.publish(), listEvent.publish(), membersEvent.publish()]);
	}
</script>

<Onboarding title={$t('create-community-title')} text={$t('create-community-text')}>
	<form method="POST" use:enhance class="flex w-full flex-grow flex-col">
		<div class="flex w-full flex-grow flex-col">
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
							disabled={publishing}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="flex w-full flex-col gap-1.5 pt-2">
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
								disabled={publishing}
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
			<div class="flex w-full flex-col gap-1.5 pt-2">
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
							disabled={publishing}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder={$t('select')} />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="en" label="English" on:click={() => session.setLocale('en')} />
								<Select.Item
									value="pt"
									label="Portuguese"
									on:click={() => session.setLocale('pt')}
								/>
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.locale} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</div>
		<div class="my-6 w-full text-center sm:mb-0">
			<div class="mx-auto flex w-full justify-end">
				<input type="hidden" name="atag" value={atag} />
				<Button type="submit" class="min-w-28 px-6" disabled={publishing}>
					<span class:hidden={!publishing} class="animate-spin">
						<LucideLoader class="h-5 w-5" />
					</span>
					<span class:hidden={publishing}>{$t('next')}</span>
				</Button>
			</div>
		</div>
	</form>
</Onboarding>
