<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import NewPost from '$lib/components/NewPost.svelte';
	import { t } from '$lib/i18n';
	import { page } from '$app/stores';
</script>

<div class="flex h-full flex-grow flex-col border-l">
	<div class="flex h-16 flex-none items-center justify-between border-b px-6">
		<div class="flex items-center">
			<h1 class="text-lg font-semibold">{$t('home')}</h1>
		</div>
		<div>
			<button class="rounded-md bg-brand px-5 text-sm font-semibold leading-8 text-buttonText"
				>{$t('new-post')}</button
			>
		</div>
	</div>
	<div class="flex h-full w-full items-center justify-center overflow-y-auto bg-gray-100 p-5">
		<div class="flex h-full w-full max-w-2xl flex-col">
			<NewPost />

			<Post />
			<Post />
			<Post />
			<Post />
			<br class="h-5" />
		</div>
	</div>
</div>
