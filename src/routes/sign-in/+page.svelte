<script lang="ts">
	import Onboarding from '$lib/components/Onboarding.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import { t } from '$lib/i18n';
	import session from '$lib/stores/session';
	import { nip19 } from 'nostr-tools';
	import { bytesToHex } from '@noble/hashes/utils';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { nsecSchema } from './schema';
	import { pkSignIn, nip07SignIn } from '$lib/sign-in';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let redirectUrl = decodeURIComponent($page.url.searchParams.get('redirectUrl') || '');

	$: if ($session.pubkey && redirectUrl) {
		goto(redirectUrl);
	} else if ($session.pubkey) {
		goto('/');
	}

	const nsecForm = superForm(
		{ key: '' },
		{ validators: zodClient(nsecSchema), validationMethod: 'oninput' }
	);

	const { form: nsecData, errors: nsecErrors } = nsecForm;

	$: keyIsValid = $nsecData.key !== '' && !$nsecErrors.key;

	function signInWithKey() {
		if ($nsecData.key) {
			const key = nip19.decode($nsecData.key).data as Uint8Array;
			const hexkey = bytesToHex(key);
			pkSignIn(hexkey);
		} else {
			throw new Error('Invalid private key');
		}
	}
</script>

<Onboarding title={$t('sign-in-title')} text={`${$t('sign-in-text')}`}>
	<div class="mt-2 flex justify-center">
		<Button class="w-72" on:click={nip07SignIn}>{$t('sign-in-with-extension')}</Button>
	</div>
	<p class="mt-6 w-full text-center text-sm text-gray-400">{$t('or')}</p>
	<div class="mt-6 flex justify-center">
		<div class="flex w-72 flex-col">
			<Input
				id="nsec"
				type="text"
				placeholder="nsec..."
				autocomplete="off"
				bind:value={$nsecData.key}
			/>
			{#if $nsecData.key && $nsecErrors.key}
				<p class="mt-1 text-xs text-red-500">{$nsecErrors.key[0]}</p>
			{/if}
			<Button on:click={signInWithKey} class="mt-2" disabled={!keyIsValid}>
				{$t('sign-in-with-key')}
			</Button>
		</div>
	</div>
</Onboarding>
