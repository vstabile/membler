<script lang="ts">
	import profile from '$lib/stores/profile';
	import LucideX from '~icons/lucide/x';

	export let open: boolean;

	function close() {
		open = false;
	}
</script>

{#if $profile && open}
	<div class="absolute right-0 top-0 z-10 flex h-screen w-[450px] flex-col bg-white shadow-2xl">
		<div class="flex justify-between px-6 py-5">
			<span class="text-lg font-semibold">Account</span>
			<button on:click={close}>
				<LucideX class="text-sm text-gray-500" />
			</button>
		</div>
		<div class="flex flex-row px-6 py-4">
			<img
				src={$profile.picture}
				alt={$profile.name}
				class="h-24 w-24 rounded-full bg-purple-200 object-cover"
			/>
			<div class="flex flex-col pl-6">
				<div class="mb-1 font-semibold">{$profile.name}</div>
				<div class="text-sm text-gray-600">{$profile.about}</div>
			</div>
		</div>
	</div>
{/if}
