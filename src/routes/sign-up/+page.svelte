<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import currentUser from '$lib/stores/currentUser';
	import { t } from 'svelte-i18n';
	import { locale } from 'svelte-i18n';
</script>

<div class="flex min-h-screen w-full justify-center md:items-center md:bg-purple-100">
	<div class="w-full md:my-4 md:max-w-[520px]">
		<div
			class="m-auto flex min-h-screen w-full flex-col items-center border-gray-200 bg-white p-6 py-0 pt-10 md:min-h-0 md:rounded-2xl md:border md:p-12 md:py-10"
		>
			<div class="pb-2 pt-4 text-2xl font-bold text-purple-900">Membler</div>
			<h1 class="mt-4 text-center text-xl font-bold md:mt-8 md:text-2xl">
				{$t('sign-up-title')}
			</h1>
			<p class="text-light mt-3 text-center text-sm">
				{$t('sign-up-text')} <a href="/sign-in">{$t('click-here')}</a>
			</p>
			<div class="mt-8 w-full">
				<div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="name">{$t('name')}</Label>
						<Input type="text" id="name" placeholder="Your Name" />
					</div>
				</div>
				<div class="mt-10 w-full text-center">
					<div class="mx-auto flex w-full justify-end">
						<Button href="/communities/3/templates" class="px-6">Next</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
