<script lang="ts">
	import { LucidePlus } from 'lucide-svelte';
	import currentUser from '$lib/stores/currentUser';
	import { t } from 'svelte-i18n';
</script>

<div
	class="flex cursor-pointer items-center justify-between rounded-lg border bg-white p-3 hover:drop-shadow-md"
>
	<div class="flex items-center">
		{#if $currentUser.picture && $currentUser.picture !== ''}
			<img src={$currentUser.picture} alt={$currentUser.name} class="h-8 w-8 rounded-md" />
		{/if}
		<p class="text-md pl-4 font-light text-gray-500">{$t('start-post')}</p>
	</div>
	<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
		<LucidePlus class="h-4" />
	</div>
</div>
