<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from '$lib/stores/ndk';
	import session from '$lib/stores/session';
	import community from '$lib/stores/community';
	import Onboarding from '$lib/components/Onboarding.svelte';
	import { CHANNEL_EVENT_KIND } from '$lib/constants';
	import { goto } from '$app/navigation';
	import { LucideLoader } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	let loading = true;
	let publishing = false;
	let channels: { name: string; emoji: string; group: string }[] = [];
	let channelGroups: string[] = [];
	let selectedItems: number[] = [];

	$: if (loading && $community) {
		loading = false;
		let moderators = $community.moderators;
		if (!moderators.includes($session.pubkey!)) {
			toast.error($t('errors.not-moderator'), { duration: 5 * 1000 });
			goToParent();
		}

		if (channels.length === 0) translateChannels($community.locale);
	}

	function publishEvent() {
		publishing = true;
		const pubkey = $session.pubkey!;
		const selectedChannels = channels.filter((_, index) => selectedItems.includes(index));

		const events = selectedChannels.map(
			(content, index) =>
				new NDKEvent($ndk, {
					pubkey,
					content: JSON.stringify(content),
					created_at: Math.floor(Date.now() / 1000) + index,
					kind: CHANNEL_EVENT_KIND,
					tags: [['a', data.atag]]
				})
		);

		return events.map((e) => e.publish());
	}

	async function submitTemplate() {
		publishing = true;
		const timeout = new Promise((resolve) => setTimeout(resolve, 400));
		Promise.all([publishEvent(), timeout]).then(() => {
			goToParent();
		});
	}

	async function translateChannels(locale: string) {
		const loader = await import(`$lib/locales/${locale}.json`);
		const templates = loader['templates'];

		channels = [
			{ name: templates['start-here'], emoji: '🏠', group: templates['get-started'] },
			{ name: templates['introduce-yourself'], emoji: '👋', group: templates['get-started'] },
			{ name: templates['resources'], emoji: '📖', group: templates['get-started'] }
		];

		channelGroups = Array.from(new Set(channels.map((channel) => channel.group)));
		selectedItems = channels.map((_, index) => index);
	}

	function goToParent() {
		const url = new URL($page.url);
		url.pathname = url.pathname.split('/').slice(0, -1).join('/');
		goto(url.pathname);
	}
</script>

<Onboarding title={$t('onboarding.template-title')} text={$t('onboarding.template-text')}>
	<div class="flex flex-grow flex-col items-center">
		{#if channels.length === 0}
			<LucideLoader class="mt-8 h-6 w-6 animate-spin text-purple-900" />
		{:else}
			<div>
				{#each channelGroups as group, index}
					<div class="mt-2">
						<div class="mb-2 flex items-center">
							<Checkbox
								id={`group-${index}`}
								checked={selectedItems.length > 0}
								onCheckedChange={(v) => {
									selectedItems = v ? channels.map((_, index) => index) : [];
								}}
							/>
							<span class="ml-4 text-lg font-semibold">{group}</span>
						</div>
						<div class="pl-1 pt-1">
							{#each channels as channel, index}
								{@const checked = selectedItems.includes(index)}
								<div class="flex items-center text-base font-normal">
									<Checkbox
										id={`channel-${index}`}
										class="h-3 w-3"
										{checked}
										onCheckedChange={(v) => {
											if (v) {
												selectedItems = [...selectedItems, index];
											} else {
												selectedItems = selectedItems.filter((i) => i !== index);
											}
										}}
									/>
									<span class="ml-4">
										<span class="mr-2 text-lg">{channel.emoji}</span>
										<span class="text-base">{channel.name}</span>
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div class="my-6 flex h-full w-full justify-end sm:mb-0">
		<Button variant="link" on:click={goToParent}>
			{$t('onboarding.skip')}
		</Button>
		<Button on:click={submitTemplate} class="min-w-32 px-8" disabled={publishing}>
			<span class:hidden={!publishing} class="animate-spin">
				<LucideLoader class="h-5 w-5" />
			</span>
			<span class:hidden={publishing}>{$t('onboarding.finish')}</span>
		</Button>
	</div>
</Onboarding>
