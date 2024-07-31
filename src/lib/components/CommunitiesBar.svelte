<script lang="ts">
	import { page } from '$app/stores';
	import communities from '$lib/stores/communities';
	import LucidePlus from '~icons/lucide/plus';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { t } from '$lib/i18n';
	import { PUBLIC_DOMAIN, PUBLIC_PROTOCOL, PUBLIC_PORT } from '$env/static/public';

	$: id = $page.params.id;
</script>

<div
	class="flex h-full flex-col overflow-y-auto border-r border-r-sidebarBorder bg-sidebarBg p-3 max-lg:hidden"
>
	{#each $communities as community}
		<div
			class="mb-3 flex items-center justify-center rounded-lg text-sidebarText"
			class:outline={community.id === id}
			class:outline-2={community.id === id}
			class:outline-offset-2={community.id === id}
		>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="{PUBLIC_PROTOCOL}://{community.subdomain}.{PUBLIC_DOMAIN}:{PUBLIC_PORT}"
						use:builder.action
						{...builder}
					>
						{#if community.icon}
							<div class="flex h-10 w-10 items-center justify-center">
								<img alt={community.name} src={community.icon} class=" rounded-lg" />
							</div>
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

	<div class="flex items-center rounded-lg bg-itemHover">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="{PUBLIC_PROTOCOL}://www.{PUBLIC_DOMAIN}:{PUBLIC_PORT}/communities/new"
					class="flex h-10 w-10 items-center justify-center"
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
