<script>
	import Searchbar from './Searchbar.svelte';
	import LucideBell from '~icons/lucide/bell';
	import LucideMessageCircle from '~icons/lucide/message-circle';
	import LucideUser from '~icons/lucide/user';
	import LucideLogOut from '~icons/lucide/log-out';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import profile from '$lib/stores/profile';
	import { signOut } from '$lib/sign-in';
	import { t } from 'svelte-i18n';
</script>

<div class="flex w-full items-center justify-between border-b bg-headerBg px-6 py-2">
	<div class="flex flex-grow justify-center">
		<Searchbar />
	</div>
	<div class="flex space-x-2">
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button title="Account" class="flex items-center justify-center">
					{#if $profile.picture && $profile.picture !== ''}
						<img src={$profile.picture} alt={$profile.name} class="h-8 w-8 rounded-md" />
					{:else}
						<LucideUser />
					{/if}
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="min-w-52">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="mb-1 text-xs font-medium">
						{$t('account').toUpperCase()}
					</DropdownMenu.Label>
					<DropdownMenu.Item class="text-sm">
						<a href="/account" class="flex w-full">
							<LucideUser class="mr-2" />
							{$t('view-profile')}
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="text-sm">
						<a href="/sign-out" class="flex w-full" on:click|preventDefault={signOut}>
							<LucideLogOut class="mr-2" />
							{$t('sign-out')}
						</a>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
