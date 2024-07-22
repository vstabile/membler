<script>
	import Input from './ui/input/input.svelte';
	import LucideSearch from '~icons/lucide/search';
	import { t } from 'svelte-i18n';
</script>

<div class="relative flex w-[30rem] items-center">
	<LucideSearch class="absolute ml-2 text-gray-600" style="z-index: 10;" />
	<Input placeholder={$t('search')} class="h-8 py-2 pl-10" />
</div>
