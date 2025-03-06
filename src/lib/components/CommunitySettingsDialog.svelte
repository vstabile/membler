<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import communitySettingsOpen from '$lib/stores/communitySettingsOpen';
	import ndk from '$lib/stores/ndk';
	import { t } from '$lib/i18n';
	import { Button } from '$lib/components/ui/button/index.js';
	import { formSchema } from '$lib/schemas/community';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import session from '$lib/stores/session';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { PUBLIC_APP_PUBKEY, PUBLIC_APP_RELAY, PUBLIC_NIP89_IDENTIFIER } from '$env/static/public';
	import community from '$lib/stores/community';
	import Input from './ui/input/input.svelte';
	import { LucideLoader } from 'lucide-svelte';
	import { COMMUNITY_EVENT_KIND } from '$lib/constants';

	let publishing = false;

	$: if ($community) {
		$formData = {
			name: $community?.name,
			description: $community?.description,
			atag: $community?.atag,
			icon: $community?.icon,
			logo: $community?.logo,
			locale: $community?.locale,
			subdomain: $community?.subdomain
		};
	}

	const form = superForm(
		{
			name: $community?.name,
			description: $community?.description,
			atag: $community?.atag,
			icon: $community?.icon,
			logo: $community?.logo,
			locale: $community?.locale,
			subdomain: $community?.subdomain
		},
		{
			validators: zodClient(formSchema),
			validationMethod: 'auto',
			SPA: true,
			onUpdate: ({ form }) => {
				if (form.valid) {
					publishing = true;
					publish().then(() => {
						publishing = false;
						$communitySettingsOpen = false;
					});
				}
			}
		}
	);

	async function publish() {
		publishing = true;

		const pubkey = $session.pubkey!;

		let tags = [
			['d', $community!.id],
			['name', $formData.name || ''],
			['membler', $community?.subdomain || ''],
			['locale', $community?.locale || 'en'],
			...$community!.moderators.map((p) => ['p', p, PUBLIC_APP_RELAY, 'moderator']),
			['alt', $formData.name || ''],
			[
				'client',
				'Membler',
				`31990:${PUBLIC_APP_PUBKEY}:${PUBLIC_NIP89_IDENTIFIER}`,
				PUBLIC_APP_RELAY
			],
			['relay', PUBLIC_APP_RELAY]
		];

		if ($formData.icon?.trim()) {
			tags.push(['icon', $formData.icon]);
		}
		if ($formData.logo?.trim()) {
			tags.push(['logo', $formData.logo]);
		}

		const event = new NDKEvent($ndk, {
			pubkey,
			content: '',
			created_at: Math.floor(Date.now() / 1000),
			kind: COMMUNITY_EVENT_KIND,
			tags
		});

		await event.publish();

		return;
	}

	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open={$communitySettingsOpen}>
	<Dialog.Content class="md:max-w-[720px]">
		<form method="POST" use:enhance>
			<Dialog.Header>
				<Dialog.Title class="text-left">{$t('community-settings')}</Dialog.Title>
				<Dialog.Description>
					<Form.Field {form} name="name">
						<Form.Control let:attrs>
							<Form.Label>{$t('community-name-label')}</Form.Label>
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
					<Form.Field {form} name="description">
						<Form.Control let:attrs>
							<Form.Label>{$t('community-description-label')}</Form.Label>
							<Textarea
								id="description"
								name="description"
								placeholder={$t('community-description-placeholder')}
								autocomplete="off"
								class="min-h-[60px] resize-none px-4 py-3"
								bind:value={$formData.description}
								disabled={publishing}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="icon">
						<Form.Control let:attrs>
							<Form.Label>{$t('community-icon-label')}</Form.Label>
							<Input
								type="text"
								id="icon"
								name="icon"
								autocomplete="off"
								bind:value={$formData.icon}
								disabled={publishing}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="logo">
						<Form.Control let:attrs>
							<Form.Label>{$t('community-logo-label')}</Form.Label>
							<Input
								type="text"
								id="logo"
								name="logo"
								autocomplete="off"
								bind:value={$formData.logo}
								disabled={publishing}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<input type="hidden" name="atag" value={$formData.atag} />
				<Button type="submit" class="min-w-28 px-6" disabled={publishing}>
					<span class:hidden={!publishing} class="animate-spin">
						<LucideLoader class="h-5 w-5" />
					</span>
					<span class:hidden={publishing}>{$t('update')}</span>
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
