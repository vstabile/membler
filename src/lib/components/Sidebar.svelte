<script lang="ts">
	import { page } from '$app/stores';
	import communities from '$lib/stores/communities';
	import LucideHome from '~icons/lucide/home';
	import LucideUsers from '~icons/lucide/users';
	import LucideArrowUpRight from '~icons/lucide/arrow-up-right';
	import LucidePlus from '~icons/lucide/plus';
	import LucideChevronDown from '~icons/lucide/chevron-down';
	import LucidePalette from '~icons/lucide/palette';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t } from 'svelte-i18n';

	$: id = $page.params.id;
	$: community = $communities.find((community) => community.id === id)!;
</script>

<nav class="text-sidebarText bg-sidebarBg w-72">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<div
				class="border-b-sidebarBorder flex h-16 w-full cursor-pointer items-center justify-between border-b px-4 py-3"
				use:builder.action
				{...builder}
			>
				{#if community.logo}
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
					<a href="/communities/{id}/settings/theme" class="flex w-full">
						<LucidePalette class="mr-2" />
						{$t('customize-theme')}
					</a>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<div class="h-screen overflow-y-scroll">
		<div class="flex w-full flex-col p-4 text-sm">
			<a
				href="/communities/{id}/home"
				class="hover:bg-itemHover flex items-center rounded-md px-1 py-2"
			>
				<LucideHome class="ml-1 mr-2" />
				{$t('home')}
			</a>
			<a
				href="/communities/{id}/members"
				class="hover:bg-itemHover flex items-center rounded-md px-1 py-2"
			>
				<LucideUsers class="ml-1 mr-2" />
				{$t('members')}
			</a>
		</div>
		<div class="flex w-full flex-col p-4 pt-2 text-sm">
			<div class="mb-2 ml-1 font-semibold">Get Started</div>
			<a
				href="/communities/{id}/s/start-here"
				class="hover:bg-itemHover flex items-center rounded-md p-1"
			>
				<span class="ml-1 mr-2 text-lg">🏠</span><span>Start Here</span>
			</a>
			<a
				href="/communities/{id}/s/say-hello"
				class="hover:bg-itemHover flex items-center rounded-md p-1"
			>
				<span class="ml-1 mr-2 text-lg">👋</span><span>Say Hello</span>
			</a>
			<a
				href="/communities/{id}/s/resources"
				class="hover:bg-itemHover flex items-center rounded-md p-1"
			>
				<span class="ml-1 mr-2 text-lg">📖</span><span>Resources</span>
			</a>
		</div>
		<div class="flex w-full flex-col p-4 pt-2 text-sm">
			<div class="mb-2 ml-1 font-semibold">Spaces</div>
			<a
				href="/communities/{id}/s/add"
				class="hover:bg-itemHover flex items-center rounded-md px-1 py-2"
			>
				<LucidePlus class="ml-1 mr-2" />
				{$t('add-space')}
			</a>
		</div>
		<div class="flex w-full flex-col p-4 pt-2 text-sm">
			<div class="mb-2 ml-1 font-semibold">{$t('links')}</div>
			<a
				href="/communities/{id}/s/start-here"
				class="hover:bg-itemHover flex items-center rounded-md px-1 py-2"
			>
				<LucideArrowUpRight class="ml-1 mr-2" /> Link 1
			</a>
			<a
				href="/communities/{id}/s/say-hello"
				class="hover:bg-itemHover flex items-center rounded-md px-1 py-2"
			>
				<LucideArrowUpRight class="ml-1 mr-2" /> Link 2
			</a>
		</div>
	</div>
</nav>
