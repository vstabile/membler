<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from '$lib/stores/ndk';
	import session from '$lib/stores/session';
	import community from '$lib/stores/community';
	import Onboarding from '$lib/components/Onboarding.svelte';
	import { goto } from '$app/navigation';
	import { LucideLoader } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let loading = true;
	let publishing = false;

	$: if (loading && $community) {
		loading = false;
		let moderators = $community.moderators;
		if (!moderators.includes($session.pubkey!)) {
			toast.error($t('errors.not-moderator'), { duration: 5 * 1000 });
			goToParent();
		}
	}

	function publishEvent() {
		publishing = true;
		const pubkey = $session.pubkey!;

		// const events = selectedChannels.map(
		// 	(content, index) =>
		// 		new NDKEvent($ndk, {
		// 			pubkey,
		// 			content: JSON.stringify(content),
		// 			created_at: Math.floor(Date.now() / 1000) + index,
		// 			kind: CHANNEL_EVENT_KIND,
		// 			tags: [['a', data.atag]]
		// 		})
		// );

		// return events.map((e) => e.publish());
	}

	async function submit() {
		publishing = true;
		const timeout = new Promise((resolve) => setTimeout(resolve, 400));
		Promise.all([publishEvent(), timeout]).then(() => {
			goToParent();
		});
	}

	function goToParent() {
		const url = new URL($page.url);
		url.pathname = url.pathname.split('/').slice(0, -1).join('/');
		goto(url.pathname);
	}
</script>

<Onboarding
	community={$community}
	title={$t('onboarding.invite-title')}
	text={$t('onboarding.invite-text', { value: $community?.name })}
>
	<div class="mt-4 flex flex-col items-center sm:mt-8">
		<Button on:click={submit} class="bg-onboarding mb-2 min-w-32 px-8" disabled={publishing}>
			<span class:hidden={!publishing} class="animate-spin">
				<LucideLoader class="h-5 w-5" />
			</span>
			<span class:hidden={publishing}>{$t('onboarding.join')}</span>
		</Button>
		<Button variant="link" size="sm" class="text-onboarding" on:click={goToParent}>
			{$t('onboarding.ignore')}
		</Button>
	</div>
</Onboarding>
