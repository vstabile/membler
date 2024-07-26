<script lang="ts">
	import Onboarding from '$lib/components/Onboarding.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { t } from '$lib/i18n';
</script>

<Onboarding
	title={$t('sign-up-title')}
	text={`${$t('sign-up-text')} <a href="/sign-in">${$t('click-here')}</a>`}
>
	<div class="mt-6 flex justify-center gap-1.5">
		<div class="flex w-72 flex-col">
			<Label for="name">{$t('name')}</Label>
			<Input type="text" id="name" placeholder="Your Name" />
			<div class="mt-10 w-full text-center">
				<div class="mx-auto flex w-full justify-end">
					<Button href="/communities/3/templates" class="px-6">Next</Button>
				</div>
			</div>
		</div>
	</div>
</Onboarding>
