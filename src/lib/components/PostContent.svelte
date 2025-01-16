<script lang="ts">
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import { browser } from '$app/environment';
	import { robohash, truncatedNpub } from '$lib/utils';
	import { liveQuery } from 'dexie';
	import session from '$lib/stores/session';
	import db, { type Message } from '$lib/db';
	import TimeAgo from 'javascript-time-ago';

	export let message: Message;
	export let truncated: boolean | null = null;

	const timeAgo = new TimeAgo($session.locale);
	const TRUCATION_HEIGHT = 240;

	let mounted = false;
	let contentElement: HTMLElement;

	const pubkey = message.pubkey;
	const createdAt = message.createdAt;

	let content = message.content;
	content = browser ? DOMPurify.sanitize(content) : content;
	content = content.replace(/\n/g, '<br>');

	let profile = liveQuery(() => db.profiles.get(pubkey));

	$: name = $profile?.name ?? truncatedNpub(pubkey);
	$: picture = $profile?.picture ?? robohash(pubkey);
	$: about = $profile?.about;

	$: if (mounted && content && truncated === null) {
		if (contentElement && contentElement.offsetHeight > TRUCATION_HEIGHT) {
			truncated = true;
		}
	}

	onMount(() => (mounted = true));
</script>

<div class="flex items-start justify-between pb-5">
	<div class="flex">
		<img src={picture} alt={name} class="mr-3 h-10 w-10 rounded-full object-cover" />
		<div>
			<div class="flex items-center">
				<span class="mr-2 text-sm">{name}</span>
				<span class="text-xs text-gray-400">{timeAgo.format(createdAt * 1000)}</span>
			</div>
			<div class="mt-1 text-xs text-gray-600">
				{about}
			</div>
		</div>
	</div>

	<!-- <div class="flex text-gray-700">
        <button class="mr-1 rounded p-1 hover:bg-gray-100">
            <LucideBookmark class="h-5 w-5" />
        </button>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <button class="rounded p-1 hover:bg-gray-100" use:builder.action {...builder}>
                    <LucideMoreHorizontal class="h-5 w-5" />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="min-w-52">
                <DropdownMenu.Group>
                    <DropdownMenu.Item class="text-sm">
                        <a href="/bookmark" class="flex w-full">
                            {$t('bookmark-post')}
                        </a>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item class="text-sm">
                        <a href="/report" class="flex w-full text-red-600">
                            {$t('report-post')}
                        </a>
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div> -->
</div>
<div class="leading-normal text-gray-700">
	<div bind:this={contentElement} class:h-[240px]={truncated} class:overflow-hidden={truncated}>
		{@html content}
	</div>
	{#if truncated}
		<button
			class="mt-1 cursor-pointer text-gray-400 hover:text-gray-700"
			on:click={() => (truncated = false)}
		>
			See more
		</button>
	{/if}
</div>
