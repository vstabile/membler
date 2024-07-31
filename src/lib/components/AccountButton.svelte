<script lang="ts">
	import LucideUser from '~icons/lucide/user';
	import LucideLogOut from '~icons/lucide/log-out';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import session from '$lib/stores/session';
	import profile from '$lib/stores/profile';
	import { signOut } from '$lib/sign-in';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { nip19 } from 'nostr-tools';

	export let name = false;

	$: redirectUrl = encodeURIComponent($page.url.toString());
</script>

<div class="flex items-center">
	{#if $session.pubkey}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button title="Account" class="flex items-center justify-center">
					{#if $profile}
						<img
							src={$profile.picture}
							alt={$profile.name}
							class="h-8 w-8 rounded-md bg-purple-200"
						/>

						{#if name}
							<div class="pl-3 text-sidebarText">
								{#if $profile?.name}
									{$profile.name}
								{:else}
									{nip19.npubEncode($session.pubkey).substring(0, 20) + '...'}
								{/if}
							</div>
						{/if}
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
	{:else}
		<a href="/sign-in?redirectUrl={redirectUrl}" class="text-sm">{$t('sign-in')}</a>
	{/if}
</div>
