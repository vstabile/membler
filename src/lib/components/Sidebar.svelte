<script lang="ts">
	import { page } from '$app/stores';
	import LucideHome from '~icons/lucide/home';
	import LucideUsers from '~icons/lucide/users';
	import LucideArrowUpRight from '~icons/lucide/arrow-up-right';
	import LucidePlus from '~icons/lucide/plus';
	import LucideChevronDown from '~icons/lucide/chevron-down';
	import LucideSettings from '~icons/lucide/settings';
	import LucidePalette from '~icons/lucide/palette';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t } from '$lib/i18n';
	import type { Community } from '$lib/stores/community';
	import { PUBLIC_DOMAIN, PUBLIC_PORT, PUBLIC_PROTOCOL } from '$env/static/public';

	export let community: Community | undefined;
</script>

<div class="flex h-full w-72 flex-col border-r-sidebarBorder bg-sidebarBg text-sidebarText">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<div
				class="flex h-16 w-full flex-none cursor-pointer items-center justify-between border-b border-b-sidebarBorder px-4"
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
				<LucideChevronDown />
			</div>
		</DropdownMenu.Trigger>
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
	</DropdownMenu.Root>
	<div class="flex flex-col overflow-y-auto">
		<div class="flex w-full flex-col p-5 text-sm">
			<a
				href="/communities/{community?.id}/home"
				class="flex items-center rounded-md px-1 py-2 hover:bg-itemHover"
			>
				<LucideHome class="mr-2" />
				{$t('home')}
			</a>
			<a
				href="/communities/{community?.id}/members"
				class="flex items-center rounded-md px-1 py-2 hover:bg-itemHover"
			>
				<LucideUsers class="mr-2" />
				{$t('members')}
			</a>
		</div>
		<div class="flex w-full flex-col p-4 pt-2 text-sm">
			<div class="mb-2 font-semibold">Get Started</div>
			<a
				href="/communities/{community?.id}/s/start-here"
				class="flex items-center rounded-md p-1 hover:bg-itemHover"
			>
				<span class="mr-2 text-lg">🏠</span><span>Start Here</span>
			</a>
			<a
				href="/communities/{community?.id}/s/say-hello"
				class="flex items-center rounded-md p-1 hover:bg-itemHover"
			>
				<span class="mr-2 text-lg">👋</span><span>Say Hello</span>
			</a>
			<a
				href="/communities/{community?.id}/s/resources"
				class="flex items-center rounded-md p-1 hover:bg-itemHover"
			>
				<span class="mr-2 text-lg">📖</span><span>Resources</span>
			</a>
		</div>
		<div class="flex w-full flex-col p-4 pt-2 text-sm">
			<div class="mb-2 font-semibold">Spaces</div>
			<a
				href="/communities/{community?.id}/s/add"
				class="flex items-center rounded-md px-1 py-2 hover:bg-itemHover"
			>
				<LucidePlus class="mr-2" />
				{$t('add-space')}
			</a>
		</div>
		<div class="flex w-full flex-col p-4 pt-2 text-sm">
			<div class="mb-2 ml-1 font-semibold">{$t('links')}</div>
			<a
				href="/communities/{community?.id}/s/start-here"
				class="flex items-center rounded-md px-1 py-2 hover:bg-itemHover"
			>
				<LucideArrowUpRight class="mr-2" /> Link 1
			</a>
			<a
				href="/communities/{community?.id}/s/say-hello"
				class="flex items-center rounded-md px-1 py-2 hover:bg-itemHover"
			>
				<LucideArrowUpRight class="mr-2" /> Link 2
			</a>
		</div>
	</div>
</div>
