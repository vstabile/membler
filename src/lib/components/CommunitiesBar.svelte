<script lang="ts">
	import { page } from '$app/stores';
	import communities from '$lib/stores/communities';
	import LucidePlus from '~icons/lucide/plus';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { t } from 'svelte-i18n';

	$: id = $page.params.id;
</script>

<div>
	{#each $communities as community}
		<div
			class="text-sidebarText mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
			class:outline={community.id === id}
			class:outline-2={community.id === id}
			class:outline-offset-2={community.id === id}
		>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a href="/communities/{community.id}" use:builder.action {...builder}>
						{#if community.icon}
							<img alt={community.name} src={community.icon} class="rounded-lg" />
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 font-bold text-gray-100"
							>
								{community.name.charAt(0).toUpperCase()}
							</div>
						{/if}
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">
					<p>{community.name}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/each}
	<div class="bg-itemHover flex h-10 w-10 rounded-lg">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="/communities/new"
					class="flex h-full w-full items-center justify-center"
					use:builder.action
					{...builder}
				>
					<LucidePlus class="text-sidebarText" />
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">
				<p>{$t('create-new-community')}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
