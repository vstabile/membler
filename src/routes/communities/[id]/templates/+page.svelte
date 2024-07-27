<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import Onboarding from '$lib/components/Onboarding.svelte';

	$: id = $page.params.id;
</script>

<Onboarding title={$t('template-title')} text={$t('template-text')}>
	<div class="flex flex-grow flex-col items-center">
		<ToggleGroup.Root
			type="single"
			variant="outline"
			size="lg"
			class="mt-4 flex h-full w-full max-w-md flex-col sm:w-80"
		>
			<ToggleGroup.Item value="basic" class="w-full">Basic</ToggleGroup.Item>
			<ToggleGroup.Item value="none" class="mt-4 w-full">None</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>
	<div class="my-6 flex h-full w-full justify-end sm:mb-0">
		<Button variant="link" href={`/communities/${id}`}>Skip</Button>
		<Button href={`/communities/${id}`} class="px-8">Finish</Button>
	</div>
</Onboarding>
