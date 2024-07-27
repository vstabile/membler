<script lang="ts">
	import LucideChevronDown from '~icons/lucide/chevron-down';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t, locale, locales } from '$lib/i18n';
	import session from '$lib/stores/session';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="flex items-center text-sm text-gray-600">
		{$t(`locales.${$locale}`)}
		<LucideChevronDown class="ml-1" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="top">
		<DropdownMenu.Group>
			{#each $locales as l}
				<DropdownMenu.Item on:click={() => session.setLocale(l)}>
					{$t(`locales.${l}`)}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
