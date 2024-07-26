<script lang="ts">
	export let title: string;
	export let text: string;
</script>

<div class="flex min-h-screen w-full justify-center md:items-center md:bg-purple-100">
	<div
		class="m-auto flex h-full min-h-screen w-full flex-col items-center border-gray-200 bg-white p-6 py-0 pt-10 md:my-4 md:min-h-[600px] md:max-w-[520px] md:rounded-2xl md:border md:p-12 md:py-10"
	>
		<a href="/" class="pb-2 pt-4 text-2xl font-bold text-purple-900">Membler</a>
		<h1 class="mt-4 text-center text-xl font-bold md:mt-8 md:text-2xl">
			{title}
		</h1>
		<p class="text-light mt-3 text-center text-sm text-gray-600">
			{@html text}
		</p>
		<div class="mt-8 w-full">
			<slot></slot>
		</div>
	</div>
</div>

<style>
	:root(body) {
		background-color: #f3e8ff !important;
	}
</style>
