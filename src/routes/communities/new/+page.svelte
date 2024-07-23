<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import session from '$lib/stores/session';
	import profile from '$lib/stores/profile';
	import { t } from 'svelte-i18n';
	import { locale } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const encodedPath = encodeURIComponent('/communities/new');
	if (browser && !$session.user) goto(`/sign-in?redirectUrl=${encodedPath}`);

	$: name = `${$profile.name}'s Community`;
	$: slug = name
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
	$: console.log($profile);
</script>

<div class="flex min-h-screen w-full justify-center md:items-center md:bg-purple-100">
	<div class="w-full md:my-4 md:max-w-[520px]">
		<div
			class="m-auto flex min-h-screen w-full flex-col items-center border-gray-200 bg-white p-6 py-0 pt-10 md:min-h-0 md:rounded-2xl md:border md:p-12 md:py-10"
		>
			<div class="pb-2 pt-4 text-2xl font-bold text-purple-900">Membler</div>
			<h1 class="mt-4 text-center text-xl font-bold md:mt-8 md:text-2xl">
				{$t('create-community-title')}
			</h1>
			<p class="text-light mt-3 text-center text-sm">
				{$t('create-community-text')}
			</p>
			<div class="mt-8 w-full">
				<div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="name">{$t('name')}</Label>
						<Input type="text" id="name" placeholder="Community's Name" value={name} />
					</div>
					<div class="flex w-full flex-col gap-1.5 pt-6">
						<Label for="slug">{$t('community-url')}</Label>
						<div class="flex">
							<Input
								type="text"
								id="slug"
								placeholder="community-name"
								class="rounded-r-none"
								value={slug}
							/>
							<div
								class="flex h-10 items-center justify-center rounded-r-md border-[1px] border-l-0 border-gray-200 bg-white px-4 text-sm text-gray-500"
							>
								membler.club
							</div>
						</div>
					</div>
					<div class="flex w-full flex-col gap-1.5 pt-6">
						<Label for="locale">{$t('default-language')}</Label>
						<Select.Root selected={{ label: 'English', value: 'en' }}>
							<Select.Trigger>
								<Select.Value placeholder="Select" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="en" on:click={() => locale.set('en')}>English</Select.Item>
								<Select.Item value="pt" on:click={() => locale.set('pt')}>Portuguese</Select.Item>
							</Select.Content>
						</Select.Root>
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
