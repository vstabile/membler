<script lang="ts">
	import { t } from '$lib/i18n';
	import newPostOpen from '$lib/stores/newPostOpen';
</script>

<div class="flex h-64 cursor-pointer items-center rounded-lg border bg-white p-3">
	<div class="flex w-full flex-col items-center">
		<p class="flex w-full justify-center text-lg font-semibold text-gray-900">
			{$t('start-discussion')}
		</p>
		<p class="mt-4 w-full justify-center text-center text-sm text-gray-500">
			<button on:click={() => ($newPostOpen = true)} class="text-blue-600"
				>{$t('create-first-post')}</button
			>
			<span class="px-1">{$t('and')}</span>
			<button class="text-blue-600">{$t('invite-some-members')}</button>
		</p>
		<br class="text-base" />
	</div>
</div>
