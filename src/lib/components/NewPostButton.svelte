<script lang="ts">
	import { LucidePlus } from 'lucide-svelte';
	import profile from '$lib/stores/profile';
	import { t } from '$lib/i18n';
	import newPostOpen from '$lib/stores/newPostOpen';
</script>

{#if $profile}
	<button
		class="mb-5 flex cursor-pointer items-center justify-between rounded-lg border bg-white p-3 hover:drop-shadow-md"
		on:click={() => ($newPostOpen = true)}
	>
		<div class="flex items-center">
			{#if $profile.picture && $profile.picture !== ''}
				<img src={$profile.picture} alt={$profile.name} class="h-8 w-8 rounded-md object-cover" />
			{/if}
			<p class="pl-4 text-base text-gray-500">{$t('start-post')}</p>
		</div>
		<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
			<LucidePlus class="h-4" />
		</div>
	</button>
{/if}
