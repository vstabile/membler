<script lang="ts">
	import LucideMessageSquare from '~icons/lucide/message-square';
	import LucideThumbsUp from '~icons/lucide/thumbs-up';
	import * as Dialog from '$lib/components/ui/dialog';
	import currentPost from '$lib/stores/currentPost.js';
	import ndk from '$lib/stores/ndk';
	import { t } from '$lib/i18n';
	import { MESSAGE_EVENT_KIND } from '$lib/constants';
	import session from '$lib/stores/session';
	import profile from '$lib/stores/profile';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import { PUBLIC_APP_RELAY } from '$env/static/public';
	import db from '$lib/db';
	import { liveQuery } from 'dexie';
	import type { Message } from '$lib/db';
	import Comment from './Comment.svelte';
	import PostContent from './PostContent.svelte';
	import Textarea from './ui/textarea/textarea.svelte';

	let button: HTMLElement;
	let content = '';

	$: message = $currentPost ? liveQuery(() => db.messages.get($currentPost!.id)) : null;

	$: comments = $currentPost
		? liveQuery<Message[]>(() =>
				db.messages.where('replyTo').equals($currentPost!.id).sortBy('createdAt')
			)
		: null;

	async function submit() {
		button?.classList.add('hidden');
		console.log('submitting...');
		await publish(content);
		content = '';
	}

	async function publish(content: string) {
		const pubkey = $session.pubkey!;

		const event = new NDKEvent($ndk, {
			pubkey,
			content: content,
			created_at: Math.floor(Date.now() / 1000),
			kind: MESSAGE_EVENT_KIND,
			tags: [
				['e', $currentPost!.channelId, PUBLIC_APP_RELAY, 'root'],
				['e', $currentPost!.id, PUBLIC_APP_RELAY, 'reply'],
				['p', $currentPost!.pubkey, PUBLIC_APP_RELAY]
			]
		});

		return event.publish();
	}
</script>

<Dialog.Root open={$currentPost !== null} onOpenChange={() => (content = '')}>
	<Dialog.Content class="flex pr-0 md:max-w-[800px]">
		<Dialog.Header class="w-full">
			{#if $message}
				<Dialog.Title class="pb-2 text-left">{$message.title ?? $t('post')}</Dialog.Title>
				<Dialog.Description class="h-full max-h-[80vh] w-full overflow-y-auto pr-4">
					<div class="mb-5 text-base">
						<PostContent message={$message} truncated={false} />
					</div>
					<div class="flex items-center justify-between border-t pb-6 pt-3 text-sm text-gray-600">
						<div class="flex">
							<button class="mr-3 flex items-center hover:text-black">
								<LucideThumbsUp class="mr-2" />
								{$t('like')}
							</button>
							<button class="flex items-center hover:text-black">
								<LucideMessageSquare class="mr-2" />
								{$t('comment')}
							</button>
						</div>
						<div>
							<button class="mr-3 hover:text-black">
								{$message.likes}
								{$t('likes')}
							</button>
							<button class="hover:text-black">
								{$message.comments}
								{$t('comments')}
							</button>
						</div>
					</div>
					<div class="pb-4">
						{#if $comments}
							{#each $comments as comment (comment.id)}
								<Comment message={comment} />
							{/each}
						{/if}
					</div>
					{#if $session}
						<div class="absolute bottom-0 left-0 z-10 flex w-full rounded-b-lg bg-white px-6 py-4">
							<img
								src={$profile?.picture}
								alt={$profile?.name}
								class="mr-3 h-10 w-12 rounded-full object-cover"
							/>

							<Textarea
								bind:value={content}
								placeholder={$t('what-are-your-thoughts')}
								class="h-10 min-h-10 resize-none focus:h-20"
								on:focus={() => button?.classList.remove('hidden')}
							/>
							<button
								bind:this={button}
								on:click={submit}
								class="absolute bottom-6 right-8 hidden rounded-full bg-brand px-3 py-1 text-buttonText"
								class:bg-gray-300={content.length === 0}
								disabled={content.length === 0}
							>
								{$t('publish')}
							</button>
						</div>
					{/if}
				</Dialog.Description>
			{/if}
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
