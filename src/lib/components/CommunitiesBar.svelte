<script lang="ts">
	import { page } from '$app/stores';
	import communities from '$lib/stores/communities';
	import LucidePlus from '~icons/lucide/plus';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { t } from '$lib/i18n';
	import session from '$lib/stores/session';
	import { PUBLIC_DOMAIN, PUBLIC_PROTOCOL, PUBLIC_PORT } from '$env/static/public';

	let token = '';
	$: id = $page.params.id;
	$: if ($session) token = encodeURIComponent(JSON.stringify($session));
</script>

<div>
	{#each $communities as community}
		<div
			class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-sidebarText"
			class:outline={community.id === id}
			class:outline-2={community.id === id}
			class:outline-offset-2={community.id === id}
		>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="{PUBLIC_PROTOCOL}://{community.subdomain}.{PUBLIC_DOMAIN}:{PUBLIC_PORT}#session={token}"
						use:builder.action
						{...builder}
					>
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
	<div class="flex h-10 w-10 rounded-lg bg-itemHover">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="{PUBLIC_PROTOCOL}://www.{PUBLIC_DOMAIN}:{PUBLIC_PORT}/communities/new"
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
