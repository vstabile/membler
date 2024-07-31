<script lang="ts">
	import { LucideChevronDown } from 'lucide-svelte';
	import LucideTrash2 from '~icons/lucide/trash-2';
	import LucideLogOut from '~icons/lucide/log-out';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t } from '$lib/i18n';
	import { page } from '$app/stores';
	import channels from '$lib/stores/channels';
	import NewFirstPost from '$lib/components/NewFirstPost.svelte';
	import isModerator from '$lib/stores/isModerator';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	$: id = $page.params.id;
	$: slug = $page.params.slug;
	$: channel = $channels.flatMap((g) => g.channels).find((c) => c.id === id);
</script>

<div class="flex h-full flex-grow flex-col border-l">
	<div class="flex h-16 flex-none items-center justify-between border-b bg-white px-6">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<div class="flex cursor-pointer items-center" use:builder.action {...builder}>
					{#if !channel}
						<Skeleton class="h-6 w-32 rounded bg-sidebarText" />
					{:else}
						<h1 class="text-lg font-semibold">{channel?.name}</h1>
					{/if}
					<LucideChevronDown class="ml-2 h-5" />
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="min-w-52">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="mb-1 text-xs font-medium">
						{$t('channel').toUpperCase()}
					</DropdownMenu.Label>
					<DropdownMenu.Item class="text-sm">
						<a href="/{slug}/c/1/leave" class="flex w-full">
							<LucideLogOut class="mr-2" />
							{$t('leave-channel')}
						</a>
					</DropdownMenu.Item>
					{#if $isModerator}
						<DropdownMenu.Item class="text-sm">
							<a href="/{slug}/c/1/delete" class="flex w-full text-red-600">
								<LucideTrash2 class="mr-2" />
								{$t('delete-channel')}
							</a>
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<div>
			<button class="rounded-md bg-brand px-5 text-sm font-semibold leading-8 text-buttonText"
				>{$t('new-post')}</button
			>
		</div>
	</div>
	<div class="flex h-full w-full items-center justify-center overflow-y-auto bg-gray-100 p-5">
		<div class="flex h-full w-full max-w-2xl flex-col">
			<NewFirstPost />
			<br class="h-5" />
		</div>
	</div>
</div>
