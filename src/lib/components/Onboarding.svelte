<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import LocaleSelector from './LocaleSelector.svelte';

	export let title: string;
	export let text: string;
	let originalBackgroundColor: string;

	function innerHtml(node: any, html: string) {
		node.innerHTML = html;

		return {
			update(html: string) {
				node.innerHTML = html;
			}
		};
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			originalBackgroundColor = document.body.style.backgroundColor;
			if (document) document.body.style.backgroundColor = '#f3e8ff';
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			document.body.style.backgroundColor = originalBackgroundColor || '';
		}
	});
</script>

<div class="flex min-h-screen w-full flex-grow flex-col justify-between sm:bg-purple-100 sm:pt-8">
	<div class="flex flex-grow items-center">
		<div
			class="m-auto flex h-full min-h-screen w-full flex-col items-center border-gray-200 bg-white p-6 py-0 pt-10 sm:min-h-[600px] sm:max-w-[520px] sm:rounded-2xl sm:border sm:p-12 sm:py-10"
		>
			<a href="/" class="pb-2 pt-4 text-2xl font-bold text-purple-900">Membler</a>
			<h1 class="mt-4 text-center text-xl font-bold sm:mt-8 sm:text-2xl">
				{title}
			</h1>
			<p class="text-light mt-3 text-center text-sm text-gray-600">
				<span use:innerHtml={text} />
			</p>
			<div class="mt-8 flex h-full w-full flex-grow flex-col">
				<slot></slot>
			</div>
		</div>
	</div>
	<div class="hidden w-full justify-center self-end py-8 sm:flex">
		<LocaleSelector />
	</div>
</div>
