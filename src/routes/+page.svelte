<script lang="ts">
	import { onMount } from 'svelte';
	import Typed from 'typed.js';
	import LucideGithub from '~icons/lucide/github';

	onMount(() => {
		const typed = new Typed('#typing', {
			strings: ['developers', 'educators', 'organizers'],
			loop: true,
			typeSpeed: 80,
			backSpeed: 30,
			backDelay: 2500,
			showCursor: false
		});
	});
</script>

<div class="flex h-screen flex-col justify-center bg-purple-200">
	<nav class="flex items-center justify-between px-6 py-6 md:px-10">
		<div>
			<a href="/" class="text-3xl font-bold text-purple-900">Membler</a>
		</div>
		<div>
			<a href="/sign-in" class="mr-4">Sign In</a>
			<a href="/communities/new" class="rounded bg-purple-800 px-4 py-2 text-white">Get Started</a>
		</div>
	</nav>
	<div class="flex h-full w-full items-center p-6 md:p-9">
		<div class="flex w-full flex-col">
			<h1 class="text-center text-4xl font-bold leading-tight md:text-5xl md:leading-tight">
				The Nostr community <br />
				platform for
				<span id="typing"></span>
			</h1>
			<p class="mt-8 text-center text-xl">
				Build a home for your community, events, and courses — all on Nostr.
			</p>
			<div class="mt-12 text-center">
				<a
					href="/communities/new"
					class="rounded bg-gradient-to-r from-purple-600 to-purple-800 px-12 py-4 font-semibold text-white hover:drop-shadow-lg"
					>Get Started</a
				>
			</div>
		</div>
	</div>
	<div class="flex justify-end px-6 py-10 md:px-10">
		<a href="https://github.com/vstabile/membler" class="flex items-center" target="_blank">
			<LucideGithub class="mr-1" /> Github
		</a>
	</div>
</div>
