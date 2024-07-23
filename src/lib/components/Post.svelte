<script lang="ts">
	import { onMount } from 'svelte';
	import LucideThumbsUp from '~icons/lucide/thumbs-up';
	import LucideMessageSquare from '~icons/lucide/message-square';
	import LucideMoreHorizontal from '~icons/lucide/more-horizontal';
	import LucideBookmark from '~icons/lucide/bookmark';
	import currentUser from '$lib/stores/currentUser';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { browser } from '$app/environment';
	import DOMPurify from 'dompurify';
	import { t } from 'svelte-i18n';

	const TRUCATION_HEIGHT = 240;
	let content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dapibus sollicitudin luctus. Vestibulum ut dapibus sem. Curabitur eu hendrerit turpis. Curabitur vulputate pulvinar mi, eu vehicula libero sollicitudin eget.
	
	Integer dapibus sed purus quis mollis. Mauris lobortis nisi sed tortor placerat, eu convallis nisi ultrices. Integer convallis ex quis quam convallis, in sollicitudin sem rhoncus. Sed consectetur suscipit libero id convallis. Donec et aliquam orci, id condimentum sem. Aenean a diam ut ex auctor laoreet id quis mi. Etiam lobortis sem eget turpis vestibulum, condimentum dignissim urna mollis. Ut tempor justo sem, quis auctor enim iaculis vel. Curabitur egestas at lorem in tempor.
	
	Integer et tincidunt ex, nec fringilla erat. Cras commodo suscipit volutpat.
	
	Sed congue eu massa nec volutpat. Aliquam vel odio a odio ornare laoreet sit amet at mi. Quisque sit amet placerat ante. Phasellus sed nunc et arcu lobortis porttitor in et quam. Praesent gravida gravida eros eu interdum. Aliquam luctus, mauris in tempus condimentum, libero tellus venenatis augue, in pellentesque massa justo vel neque. Sed in nisl sodales, tempor diam et, ultricies turpis. Sed nec elit eget lectus pretium pellentesque rutrum hendrerit neque.`;
	content = browser ? DOMPurify.sanitize(content) : content;
	content = content.replace(/\n/g, '<br>');
	let truncated = false;

	onMount(() => {
		const contentElement = document.getElementById('content');
		if (contentElement && contentElement.offsetHeight > 240) {
			truncated = true;
		}
	});
</script>

<div class="mt-5 flex flex-col rounded-lg border bg-white">
	<div class="flex items-start justify-between p-5">
		<div class="flex">
			<img src={$currentUser.picture} alt={$currentUser.name} class="mr-3 h-10 w-10 rounded-md" />
			<div>
				<div class="flex items-center">
					<span class="mr-2 text-sm">{$currentUser.name}</span>
					<span class="text-xs font-light text-gray-600">4d</span>
				</div>
				<div class="mt-1 text-xs text-gray-600">
					{$currentUser.about}
				</div>
			</div>
		</div>

		<div class="flex text-gray-700">
			<button class="mr-1 rounded p-1 hover:bg-gray-100">
				<LucideBookmark class="h-5 w-5" />
			</button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<button class="rounded p-1 hover:bg-gray-100" use:builder.action {...builder}>
						<LucideMoreHorizontal class="h-5 w-5" />
					</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-52">
					<DropdownMenu.Group>
						<DropdownMenu.Item class="text-sm">
							<a href="/bookmark" class="flex w-full">
								{$t('bookmark-post')}
							</a>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="text-sm">
							<a href="/report" class="flex w-full text-red-600">
								{$t('report-post')}
							</a>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="px-5 pb-5 leading-normal text-gray-700">
		<div id="content" class:h-[240px]={truncated} class:overflow-hidden={truncated}>
			{@html content}
		</div>
		{#if truncated}
			<button
				class="mt-1 cursor-pointer text-gray-400 hover:text-gray-700"
				on:click={() => (truncated = false)}
			>
				See more
			</button>
		{/if}
	</div>
	<div class="flex items-center justify-between border-t px-5 py-4 text-sm text-gray-600">
		<div class="flex">
			<button class="flex items-center hover:text-black">
				<LucideThumbsUp class="mr-2" />
				{$t('like')}
			</button>
			<button class="ml-5 flex items-center hover:text-black">
				<LucideMessageSquare class="mr-2" />
				{$t('comment')}
			</button>
		</div>
		<button class="hover:text-black">
			2 {$t('comments')}
		</button>
	</div>
</div>
