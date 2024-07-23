<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { t } from 'svelte-i18n';
	import session from '$lib/stores/session';
	import { pkSignIn, nip07SignIn } from '$lib/sign-in';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let redirectUrl = decodeURIComponent($page.url.searchParams.get('redirectUrl') || '');

	$: if ($session.user && redirectUrl) {
		goto(redirectUrl);
	} else if ($session.user) {
		goto('/communities');
	}
</script>

<div class="flex min-h-screen w-full justify-center md:items-center md:bg-purple-100">
	<div class="w-full md:my-4 md:max-w-[520px]">
		<div
			class="m-auto flex min-h-screen w-full flex-col items-center border-gray-200 bg-white p-6 py-0 pt-10 md:min-h-0 md:rounded-2xl md:border md:p-12 md:py-10"
		>
			<div class="pb-2 pt-4 text-2xl font-bold text-purple-900">Membler</div>
			<h1 class="mt-4 text-center text-xl font-bold md:mt-8 md:text-2xl">
				{$t('sign-in-title')}
			</h1>
			<p class="text-light mt-3 text-center text-sm">
				{$t('sign-in-text')} <a href="/sign-up">{$t('click-here')}</a>
			</p>
			<div class="mt-8 w-72">
				<Button class="w-full" on:click={nip07SignIn}>{$t('sign-in-with-extension')}</Button>
			</div>
			<p class="mt-4 text-gray-500">{$t('or')}</p>
			<div class="mt-4 w-72">
				<div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="nsec">{$t('private-key')}</Label>
						<Input type="text" id="nsec" placeholder="nsec..." />
						<Button class="mt-1">{$t('sign-in-with-key')}</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
