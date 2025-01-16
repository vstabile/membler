<script lang="ts">
	import isMember from '$lib/stores/isMember';
	import { t } from '$lib/i18n';
	import NewPostButton from '$lib/components/NewPostButton.svelte';
	import newPostOpen from '$lib/stores/newPostOpen';
	import { liveQuery } from 'dexie';
	import db from '$lib/db';
	import { page } from '$app/stores';
	import PostCard from '$lib/components/PostCard.svelte';
	import type { NDKSubscription } from '@nostr-dev-kit/ndk';
	import ndk from '$lib/stores/ndk';
	import { browser } from '$app/environment';
	import fetchMessages from '$lib/queries/fetchMessages';
	import { onDestroy } from 'svelte';
	import channels from '$lib/stores/channels';

	$: slug = $page.params.slug;
	$: channelIds = $channels.flatMap((g) => g.channels.map((c) => c.id));

	let messages = liveQuery(() =>
		db.messages
			.orderBy('createdAt')
			.reverse()
			.filter(
				(item) => item.communityId === slug && !item.replyTo && !item.deletedAt && !item.hiddenAt
			)
			.toArray()
	);

	let subscription: NDKSubscription | undefined;

	$: if (slug && channelIds.length > 0 && browser && $ndk) {
		fetchMessages(slug, channelIds).then((s) => {
			subscription = s;
		});
	}

	onDestroy(() => {
		if (subscription) subscription.stop();
	});
</script>

<div class="flex h-full flex-grow flex-col">
	<div class="flex h-16 flex-none items-center justify-between border-b bg-white px-6">
		<div class="flex items-center">
			<h1 class="text-lg font-semibold">{$t('home')}</h1>
		</div>
		<div>
			{#if $isMember}
				<button
					class="rounded-md bg-brand px-5 text-sm font-semibold leading-8 text-buttonText"
					on:click={() => ($newPostOpen = true)}
				>
					{$t('new-post')}
				</button>
			{/if}
		</div>
	</div>
	<div class="flex h-full w-full items-center justify-center overflow-y-auto bg-gray-100 p-5">
		<div class="flex h-full w-full flex-col lg:max-w-2xl">
			{#if $isMember}
				<NewPostButton />
			{/if}

			{#if $messages && $messages.length > 0}
				{#each $messages as message (message.id)}
					<PostCard {message} />
				{/each}
			{/if}
			<br />
		</div>
	</div>
</div>
