<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { t } from '$lib/i18n';
	import ndk from '$lib/stores/ndk';
	import session from '$lib/stores/session';
	import community from '$lib/stores/community';
	import isModerator from '$lib/stores/isModerator';
	import links from '$lib/stores/links';
	import { LucideArrowUpRight, LucidePlus } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { LINKS_SET_EVENT_KIND } from '$lib/constants';

	const formSchema = z.object({
		title: z.string().min(2, $t('link-title-short')).max(20, $t('link-title-long')),
		url: z.string().url($t('link-url-invalid'))
	});

	const form = superForm(
		{ title: '', url: '' },
		{
			validators: zodClient(formSchema),
			validationMethod: 'onsubmit',
			onResult: ({ result, formElement, cancel }) => {
				// if (result.status ==)
				console.log('onResult');
				// if
				// publishEvent
				cancel();
			}
		}
	);

	async function publishEvent() {
		console.log($formData);
		const pubkey = $session.pubkey!;
		const dtag = $community.atag.split(':')[2];
		const existingLinks = $links.filter((l) => l.author === pubkey);

		const event = new NDKEvent($ndk, {
			pubkey,
			content: '',
			created_at: Math.floor(Date.now() / 1000),
			kind: LINKS_SET_EVENT_KIND,
			tags: [...[['d', dtag]], []]
		});

		// return event.sign();
	}

	const { form: formData, enhance } = form;
</script>

{#if $isModerator || $links.length > 0}
	<div class="flex w-full flex-col p-3 text-sm">
		<div class="mb-2 px-2 font-semibold">
			{$t('links', { value: 2 })}
		</div>
		{#each $links as link}
			<a href={link.url} class="flex items-center rounded-md p-2 hover:bg-itemHover">
				<LucideArrowUpRight class="mr-2 h-4 w-4" /> <span>{link.title}</span>
			</a>
		{/each}
		{#if $isModerator}
			<Dialog.Root>
				<Dialog.Trigger asChild let:builder>
					<button
						class="flex items-center rounded-md p-2 hover:bg-itemHover"
						use:builder.action
						{...builder}
					>
						<LucidePlus class="mr-2 h-4 w-4" />
						{$t('add-link')}
					</button>
				</Dialog.Trigger>
				<Dialog.Content class="max-w-96">
					<form method="POST" use:enhance>
						<Dialog.Header>
							<Dialog.Title>{$t('add-link')}</Dialog.Title>
							<Dialog.Description>
								<Form.Field {form} name="title">
									<Form.Control let:attrs>
										<Form.Label>{$t('link-title')}</Form.Label>
										<Input {...attrs} bind:value={$formData.title} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="url" class="mt-4">
									<Form.Control let:attrs>
										<Form.Label>{$t('link-url')}</Form.Label>
										<Input {...attrs} bind:value={$formData.url} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer>
							<Button type="submit">{$t('create-link')}</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>
{/if}
