<script lang="ts">
	import type { Message } from '$lib/db';
	import { robohash, truncatedNpub } from '$lib/utils';
	import { liveQuery } from 'dexie';
	import TimeAgo from 'javascript-time-ago';
	import session from '$lib/stores/session';
	import db from '$lib/db';
	import { t } from '$lib/i18n';
	import DOMPurify from 'dompurify';
	import { browser } from '$app/environment';
	import Input from './ui/input/input.svelte';
	import profile from '$lib/stores/profile';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from '$lib/stores/ndk';
	import { PUBLIC_APP_RELAY } from '$env/static/public';
	import { MESSAGE_EVENT_KIND } from '$lib/constants';
	import Textarea from './ui/textarea/textarea.svelte';
	import Comment from './Comment.svelte';

	export let message: Message;

	let replying = false;
	let reply = '';

	const timeAgo = new TimeAgo($session.locale);

	const pubkey = message.pubkey;
	const author = pubkey ? liveQuery(() => db.profiles.get(pubkey)) : null;
	const createdAt = message.createdAt ?? Math.floor(Date.now() / 1000);

	let content = message.content;
	content = browser ? DOMPurify.sanitize(content) : content;
	content = content.replace(/\n/g, '<br>');

	$: name = $author?.name ?? truncatedNpub(pubkey);
	$: picture = $author?.picture ?? robohash(pubkey);
	$: about = $author?.about;

	$: replies = liveQuery<Message[]>(() =>
		db.messages.where('replyTo').equals(message.id).sortBy('createdAt')
	);

	async function publish() {
		const pubkey = $session.pubkey!;

		const event = new NDKEvent($ndk, {
			pubkey,
			content: reply,
			created_at: Math.floor(Date.now() / 1000),
			kind: MESSAGE_EVENT_KIND,
			tags: [
				['e', message.channelId, PUBLIC_APP_RELAY, 'root'],
				['e', message.id, PUBLIC_APP_RELAY, 'reply'],
				['p', message.pubkey, PUBLIC_APP_RELAY]
			]
		});

		await event.publish();

		reply = '';
		replying = false;
	}
</script>

<div class="flex flex-row">
	<img src={picture} alt={name} class="mr-3 h-10 w-10 rounded-full object-cover" />
	<div class="flex w-full flex-col">
		<div class="flex items-center">
			<span class="mr-2 text-sm">{name}</span>
			<span class="text-xs text-gray-400">{timeAgo.format(createdAt * 1000)}</span>
		</div>
		<div class="mt-1 text-xs text-gray-600">
			{about}
		</div>
		<div class="my-2 text-base text-gray-800">
			{@html content}
		</div>
		<div class="mb-4 flex justify-between">
			<div>
				<button class="mr-2">Like</button>
				<button on:click={() => (replying = true)}>Reply</button>
			</div>
			<button class="hover:text-black">
				{message.likes}
				{$t('likes')}
			</button>
		</div>
		{#if $replies}
			{#each $replies as reply (reply.id)}
				<Comment message={reply} />
			{/each}
		{/if}
		{#if replying && $profile}
			<div class="relative mb-8 mt-4 flex w-full flex-row">
				<img
					src={$profile.picture}
					alt={$profile.name}
					class="mr-3 h-10 w-10 rounded-full object-cover"
				/>
				<Textarea
					bind:value={reply}
					class="flex w-full resize-none"
					placeholder={$t('replying-to', { value: name })}
				/>
				<button
					class="absolute bottom-2 right-2 rounded-full bg-brand px-3 py-1 text-sm text-buttonText"
					class:bg-gray-300={reply.length === 0}
					disabled={reply.length === 0}
					on:click={publish}>{$t('reply')}</button
				>
			</div>
		{/if}
	</div>
</div>
