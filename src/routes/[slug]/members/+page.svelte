<script lang="ts">
	import { t } from '$lib/i18n';
	import members from '$lib/stores/members';
	import isModerator from '$lib/stores/isModerator';
	import { robohash } from '$lib/utils';
</script>

<div class="flex h-full flex-grow flex-col">
	<div class="flex h-16 flex-none items-center justify-between border-b bg-white px-6">
		<div class="flex items-center">
			<h1 class="text-lg font-semibold">{$t('members')}</h1>
		</div>
		<div>
			{#if $isModerator}
				<button class="rounded-md bg-brand px-5 text-sm font-semibold leading-8 text-buttonText">
					{$t('manage')}
				</button>
			{/if}
		</div>
	</div>
	<div class="flex h-full w-full items-center justify-center overflow-y-auto bg-gray-100 p-5">
		<div
			class="grid h-full w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
		>
			{#each $members as member}
				<div class="h-32 rounded-lg border bg-white">
					<img
						src={member.picture ?? robohash(member.pubkey)}
						alt={member.name}
						class="h-[80%] w-full rounded-t-lg object-cover object-top"
					/>
					<div class="flex h-[20%] items-center justify-center p-2 text-xs">{member.name}</div>
				</div>
			{/each}
			<br class="h-5" />
		</div>
	</div>
</div>
