<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Input } from '$lib/components/ui/input';
	import { t } from '$lib/i18n';
	import ndk from '$lib/stores/ndk';
	import session from '$lib/stores/session';
	import community from '$lib/stores/community';
	import isModerator from '$lib/stores/isModerator';
	import { LucideArrowUpRight, LucidePlus, LucideMoreHorizontal } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { NDKSubscription } from '@nostr-dev-kit/ndk';
	import updateLinks from '$lib/commands/links/updateLinks';
	import fetchLinks from '$lib/queries/fetchLinks';
	import { onDestroy } from 'svelte';
	import type { Link } from '$lib/db';
	import { liveQuery } from 'dexie';
	import db from '$lib/db';

	let subscription: NDKSubscription | undefined;
	let dialogOpen = false;
	let oldUrl: string | null = null;
	$: if (!dialogOpen) oldUrl = null;

	$: links = $community
		? liveQuery<Link[]>(() => db.links.where('communityId').equals($community.id).toArray())
		: null;

	$: if ($ndk && $community) {
		fetchLinks($community.id).then((s) => {
			subscription = s;
		});
	}

	onDestroy(() => {
		if (subscription) subscription.stop();
	});

	const formSchema = z.object({
		title: z.string().min(2, $t('link-title-short')).max(20, $t('link-title-long')),
		url: z.string().url($t('link-url-invalid'))
	});

	const form = superForm(
		{ title: '', url: '' },
		{
			validators: zodClient(formSchema),
			validationMethod: 'auto',
			SPA: true,
			onUpdate: ({ form }) => {
				if (form.valid) {
					dialogOpen = false;
					saveLink();
				}
			}
		}
	);

	async function saveLink() {
		const pubkey = $session.pubkey!;
		const dtag = $community!.atag.split(':')[2];
		const existingLinks = $links!.filter((l) => l.author === pubkey && l.url !== oldUrl);

		const updatedLinks = [
			...existingLinks,
			{
				title: $formData.title,
				url: $formData.url
			}
		];

		return updateLinks(dtag, updatedLinks);
	}

	async function removeLink(url: string) {
		const pubkey = $session.pubkey!;
		const dtag = $community!.atag.split(':')[2];
		const updatedLinks = $links!.filter((l) => l.author === pubkey && l.url !== url);

		return updateLinks(dtag, updatedLinks);
	}

	function openEditDialog(title: string, url: string) {
		$formData.title = title;
		$formData.url = url;
		oldUrl = url;
		dialogOpen = true;
	}

	const { form: formData, enhance } = form;
</script>

{#if $isModerator && $links}
	<div class="flex w-full flex-col p-3 text-sm">
		<div class="mb-2 px-2 font-semibold">
			{$t('links', { value: 2 })}
		</div>
		{#each $links as link}
			<a
				href={link.url}
				target="_blank"
				class="group mb-0.5 flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-itemHover"
			>
				<div class="flex">
					<LucideArrowUpRight class="mr-2 flex h-4 w-4" /> <span class="flex">{link.title}</span>
				</div>
				<button
					class="flex items-center rounded p-0.5 hover:bg-gray-300"
					on:click={(event) => event.stopPropagation()}
				>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<LucideMoreHorizontal class="h-4 w-4 opacity-0 group-hover:opacity-100" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Item>
									<button
										on:click={() => openEditDialog(link.title, link.url)}
										class="w-full text-left"
									>
										{$t('edit')}
									</button>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<button
										on:click={() => removeLink(link.url)}
										class="w-full text-left text-red-600"
									>
										{$t('remove')}
									</button>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</button>
			</a>
		{/each}
		{#if $isModerator}
			<Dialog.Root bind:open={dialogOpen}>
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
										<Input
											{...attrs}
											bind:value={$formData.url}
											placeholder="https://www.example.com"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer>
							<Button type="submit">{oldUrl ? $t('update-link') : $t('create-link')}</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>
{/if}
