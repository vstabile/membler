<script lang="ts">
	import LucideHome from '~icons/lucide/home';
	import LucideUsers from '~icons/lucide/users';
	import LucideSearch from '~icons/lucide/search';
	import LucideBell from '~icons/lucide/bell';
	import LucideMessageCircle from '~icons/lucide/message-circle';
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
	import { page } from '$app/stores';
	import { PUBLIC_DOMAIN, PUBLIC_PORT, PUBLIC_PROTOCOL } from '$env/static/public';
	import AccountButton from './AccountButton.svelte';

	export let community: Community | undefined;
	export let subdomain: string | undefined;

	$: communitySlug = subdomain ? '' : community?.naddr + '/';
</script>

<div
	class="flex h-full w-72 flex-none flex-col border-r border-r-sidebarBorder bg-sidebarBg text-sidebarText max-lg:fixed"
>
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
					<!-- <DropdownMenu.Item class="text-sm">
						<a href="/communities/{community?.id}/settings" class="flex w-full">
							<LucideSettings class="mr-2" />
							{$t('settings')}
						</a>
					</DropdownMenu.Item> -->
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
	<div class="flex h-full flex-col overflow-y-auto pb-24 lg:pb-11">
		<div class="flex w-full flex-col p-3 text-sm">
			<a href="/{communitySlug}" class="mb-0.5 flex items-center rounded-md px-2 py-1.5 lg:hidden">
				<LucideSearch class="mr-2 h-4 w-4" />
				<span>{$t('search')}</span>
			</a>
			<a
				href="/{communitySlug}"
				class="mb-0.5 flex items-center rounded-md px-2 py-1.5"
				class:hover:bg-itemHover={$page.route.id !== '/[slug]'}
				class:bg-itemActive={$page.route.id === '/[slug]'}
				class:text-itemActiveText={$page.route.id === '/[slug]'}
			>
				<LucideHome class="mr-2 h-4 w-4" />
				<span>{$t('home')}</span>
			</a>
			<a href="/{communitySlug}" class="mb-0.5 flex items-center rounded-md px-2 py-1.5 lg:hidden">
				<LucideBell class="mr-2 h-4 w-4" />
				<span>{$t('notifications')}</span>
			</a>

			<a
				href="/{communitySlug}/messages"
				class="mb-0.5 flex items-center rounded-md px-2 py-1.5 lg:hidden"
			>
				<LucideMessageCircle class="mr-2 h-4 w-4" />
				<span>{$t('dms')}</span>
			</a>
			<a
				href="/{communitySlug}members"
				class="flex items-center rounded-md px-2 py-1.5"
				class:hover:bg-itemHover={$page.route.id !== '/[slug]/members'}
				class:bg-itemActive={$page.route.id === '/[slug]/members'}
				class:text-itemActiveText={$page.route.id === '/[slug]/members'}
			>
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
						class="mb-0.5 flex items-center rounded-md px-2 py-1"
						class:hover:bg-itemHover={channel.id !== $page.params.id}
						class:bg-itemActive={channel.id === $page.params.id}
						class:text-itemActiveText={channel.id === $page.params.id}
					>
						{#if channel.emoji}<span class="mr-2 text-base">{channel.emoji}</span>{/if}
						<span>{channel.name}</span>
					</a>
				{/each}
			</div>
		{/each}
		<LinkList />
	</div>
	<div
		class="fixed bottom-0 w-[inherit] border-r border-t border-sidebarBorder bg-sidebarBg text-xs text-sidebarText"
	>
		<div class="flex border-b p-3 text-sm lg:hidden">
			<AccountButton name={true} />
		</div>
		<div class="flex p-3 opacity-50">
			<a href={`${PUBLIC_PROTOCOL}://www.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`}
				>{$t('powered-by-membler')}
			</a>
		</div>
	</div>
</div>
