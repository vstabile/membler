<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import newPostOpen from '$lib/stores/newPostOpen.js';
	import ndk from '$lib/stores/ndk';
	import { t } from '$lib/i18n';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';
	import { MESSAGE_EVENT_KIND } from '$lib/constants';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import session from '$lib/stores/session';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { PUBLIC_APP_RELAY } from '$env/static/public';
	import { z } from 'zod';
	import { page } from '$app/stores';
	import channels from '$lib/stores/channels';
	import Input from './ui/input/input.svelte';

	let channelsOpen = false;
	$: channelId = $page.params.id;
	$: flatChannels = $channels.flatMap((group) => group.channels);
	$: channelIds = flatChannels.map((c) => c.id);
	$: $formData.channelId = channelId;

	function closeAndFocusTrigger(triggerId: string) {
		channelsOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	const formSchema = z.object({
		title: z.string().optional().or(z.literal('')),
		content: z.string().min(1, $t('post-content-short')).max(3000, $t('post-content-long')),
		channelId: z
			.string({ required_error: $t('invalid-channel-id') })
			.refine((value) => channelIds.includes(value), {
				message: $t('invalid-channel-id')
			})
	});

	const form = superForm(
		{ content: '', channelId: channelId, title: '' },
		{
			validators: zodClient(formSchema),
			validationMethod: 'auto',
			SPA: true,
			onUpdate: ({ form }) => {
				if (form.valid) {
					// $newPostOpen = false;
					publish();
				}
			}
		}
	);

	async function publish() {
		const pubkey = $session.pubkey!;

		let tags = [['e', $formData.channelId, PUBLIC_APP_RELAY, 'root']];

		if ($formData.title !== '') {
			tags.push(['title', $formData.title]);
		}

		const event = new NDKEvent($ndk, {
			pubkey,
			content: $formData.content,
			created_at: Math.floor(Date.now() / 1000),
			kind: MESSAGE_EVENT_KIND,
			tags
		});

		return event.publish();
	}

	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open={$newPostOpen}>
	<Dialog.Content class="md:max-w-[720px]">
		<form method="POST" use:enhance>
			<Dialog.Header>
				<Dialog.Title class="text-left">{$t('new-post')}</Dialog.Title>
				<Dialog.Description>
					<Form.Field {form} name="content">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								placeholder={$t('title-optional')}
								class="px-4 py-3 font-semibold"
								bind:value={$formData.title}
							/>
						</Form.Control>
						<Form.FieldErrors />
						<Form.Control let:attrs>
							<Textarea
								{...attrs}
								placeholder={$t('write-something')}
								class="min-h-[300px] resize-none px-4 py-3"
								bind:value={$formData.content}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Form.Field {form} name="channelId">
					<Popover.Root bind:open={channelsOpen} let:ids>
						<Form.Control let:attrs>
							<Popover.Trigger asChild let:builder>
								<Button
									builders={[builder]}
									variant="outline"
									role="combobox"
									aria-expanded={channelsOpen}
									class="w-[200px] justify-between"
								>
									{flatChannels.find((c) => c.id === $formData.channelId)?.name ??
										$t('select-a-channel')}
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<input hidden value={$formData.channelId} name={attrs.name} />
						</Form.Control>
						<Popover.Content class="w-[200px] p-0" side="top">
							<Command.Root>
								<Command.Input placeholder={$t('search-channel')} />
								<Command.Empty>{$t('no-channel-found')}</Command.Empty>
								{#each $channels as group}
									<Command.Group heading={group.name}>
										{#each group.channels as channel}
											<Command.Item
												value={channel.name}
												onSelect={() => {
													$formData.channelId = channel.id;
													closeAndFocusTrigger(ids.trigger);
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														channel.id !== $formData.channelId && 'text-transparent'
													)}
												/>
												{channel.emoji ? `${channel.emoji} ${channel.name}` : channel.name}
											</Command.Item>
										{/each}
									</Command.Group>
								{/each}
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
					<Form.FieldErrors />
				</Form.Field>
				<button class="h-10 rounded-md bg-brand px-4 py-2 text-buttonText">
					{$t('publish')}
				</button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
