<script lang="ts">
	import LucideHome from '~icons/lucide/home';
	import LucideUsers from '~icons/lucide/users';
	import LucideChevronDown from '~icons/lucide/chevron-down';
	import LucideSettings from '~icons/lucide/settings';
	import LucidePalette from '~icons/lucide/palette';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t } from '$lib/i18n';
	import type { Community } from '$lib/stores/community';
	import channels from '$lib/stores/channels';
	import isModerator from '$lib/stores/isModerator';
	import LinkList from './LinkList.svelte';

	export let community: Community | undefined;
	export let subdomain: string | undefined;

	$: communitySlug = subdomain ? '' : community?.naddr + '/';
</script>

<div class="flex h-full w-72 flex-col border-r-sidebarBorder bg-sidebarBg text-sidebarText">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<div
				class="flex h-16 w-full flex-none items-center justify-between border-b border-b-sidebarBorder px-4"
				class:cursor-pointer={$isModerator}
				use:builder.action
				{...builder}
			>
				{#if community === undefined}
					<Skeleton class="h-6 w-2/3 rounded bg-sidebarText" />
				{:else if community.logo}
					<img src={community.logo} alt={community.name} class="max-h-6" />
				{:else}
					<div class=" text-lg font-semibold">
						{community.name}
					</div>
				{/if}
				{#if $isModerator}<LucideChevronDown />{/if}
			</div>
		</DropdownMenu.Trigger>
		{#if $isModerator}
			<DropdownMenu.Content class="min-w-64">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="mb-1 text-xs font-medium">
						{$t('community').toUpperCase()}
					</DropdownMenu.Label>
					<DropdownMenu.Item class="text-sm">
						<a href="/communities/{community?.id}/settings" class="flex w-full">
							<LucideSettings class="mr-2" />
							{$t('settings')}
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="text-sm">
						<a href="/communities/{community?.id}/settings/theme" class="flex w-full">
							<LucidePalette class="mr-2" />
							{$t('customize-theme')}
						</a>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		{/if}
	</DropdownMenu.Root>
	<div class="flex flex-col overflow-y-auto">
		<div class="flex w-full flex-col p-3 text-sm">
			<a href="/{communitySlug}" class="flex items-center rounded-md p-2 hover:bg-itemHover">
				<LucideHome class="mr-2 h-4 w-4" />
				<span>{$t('home')}</span>
			</a>
			<a href="/{communitySlug}members" class="flex items-center rounded-md p-2 hover:bg-itemHover">
				<LucideUsers class="mr-2 h-4 w-4" />
				<span>{$t('members')}</span>
			</a>
		</div>
		{#each $channels as group}
			<div class="flex w-full flex-col p-3 pt-2 text-sm">
				<div class="mb-2 px-2 font-semibold">{group.name}</div>
				{#each group.channels as channel}
					<a
						href="/{communitySlug}c/{channel.id}"
						class="flex items-center rounded-md px-2 py-1 hover:bg-itemHover"
					>
						{#if channel.emoji}<span class="mr-2 text-lg">{channel.emoji}</span>{/if}
						<span>{channel.name}</span>
					</a>
				{/each}
			</div>
		{/each}
		<LinkList />
	</div>
</div>
