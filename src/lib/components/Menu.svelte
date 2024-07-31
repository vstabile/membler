<script>
	import Searchbar from './Searchbar.svelte';
	import LucideBell from '~icons/lucide/bell';
	import LucideMessageCircle from '~icons/lucide/message-circle';
	import LucideMenu from '~icons/lucide/menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import community from '$lib/stores/community';
	import menuOpen from '$lib/stores/menuOpen';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import Skeleton from './ui/skeleton/skeleton.svelte';
	import AccountButton from './AccountButton.svelte';
</script>

<div
	class="flex w-full items-center justify-between border-b bg-headerBg px-6 py-2 max-lg:h-16"
	class:menu-open={menuOpen}
>
	<button class="flex lg:hidden" on:click={() => ($menuOpen = !$menuOpen)}>
		<LucideMenu class="h-6 w-6" />
	</button>
	<div class="flex flex-grow justify-center">
		<Searchbar />
		<div class="lg:hidden">
			{#if $community === undefined}
				<Skeleton class="h-6 w-44 rounded bg-sidebarText" />
			{:else if $community.logo}
				<img src={$community.logo} alt={$community.name} class="max-h-6" />
			{:else}
				<div class=" text-lg font-semibold">
					{$community.name}
				</div>
			{/if}
		</div>
	</div>
	<div class="flex space-x-2">
		<div class="flex max-lg:hidden">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<button class="pr-2" use:builder.action {...builder}><LucideBell /></button>
				</Tooltip.Trigger>
				<Tooltip.Content side="bottom">
					<p>{$t('notifications')}</p>
				</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<button class="pr-2" use:builder.action {...builder}><LucideMessageCircle /></button>
				</Tooltip.Trigger>
				<Tooltip.Content side="bottom">
					<p>{$t('dms')}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<AccountButton />
	</div>
</div>
