<script lang="ts">
	import LucideMessageSquare from '~icons/lucide/message-square';
	import LucideThumbsUp from '~icons/lucide/thumbs-up';
	import { t } from '$lib/i18n';
	import currentPost from '$lib/stores/currentPost';
	import PostContent from './PostContent.svelte';
	import { type Message } from '$lib/db';

	export let message: Message;

	function comment() {
		$currentPost = message;
	}
</script>

<div class="mb-5 flex flex-col rounded-lg border bg-white">
	{#if message.title}
		<div class="p-5 pb-0 text-xl font-semibold">
			{message.title}
		</div>
	{/if}
	<div class="p-5">
		<PostContent {message} />
	</div>
	<div class="flex items-center justify-between border-t px-5 py-4 text-sm text-gray-600">
		<div class="flex">
			<button class="mr-3 flex items-center hover:text-black">
				<LucideThumbsUp class="mr-2" />
				{$t('like')}
			</button>
			<button class="flex items-center hover:text-black" on:click={comment}>
				<LucideMessageSquare class="mr-2" />
				{$t('comment')}
			</button>
		</div>
		<div>
			<button class="mr-3 hover:text-black">
				{message.likes}
				{$t('likes')}
			</button>
			<button class="hover:text-black" on:click={comment}>
				{message.comments}
				{$t('comments')}
			</button>
		</div>
	</div>
</div>
