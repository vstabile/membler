<script lang="ts">
	import CommunitiesBar from '$lib/components/CommunitiesBar.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Post from '$lib/components/Post.svelte';
	import NewPost from '$lib/components/NewPost.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	// import communities from '$lib/stores/communities';
	import community from '$lib/stores/community';
	import themes from '$lib/stores/themes';
	import { page } from '$app/stores';
	import { LucideChevronDown } from 'lucide-svelte';
	import LucideTrash2 from '~icons/lucide/trash-2';
	import LucideLogOut from '~icons/lucide/log-out';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t } from '$lib/i18n';
	import session from '$lib/stores/session';
	import { PUBLIC_DOMAIN, PUBLIC_PORT, PUBLIC_PROTOCOL } from '$env/static/public';
	import { browser } from '$app/environment';

	$: id = $page.params.id;
	$: fragment = $page.url.hash;
	$: themes.getThemeById(id);
	// $: community = $communities.find((community) => community.id === id)!;
	$: if (browser && community == undefined)
		window.location.href = `${PUBLIC_PROTOCOL}://www.${PUBLIC_DOMAIN}:${PUBLIC_PORT}`;

	$: if (fragment && fragment.split('=')[0] === '#session') {
		const s = fragment.split('=')[1];
		session.fromFragment(s);
	}
</script>

<Menu />
<div class="fixed flex h-screen w-full">
	<div class="h-full w-16 border-r border-r-sidebarBorder bg-sidebarBg p-3">
		<CommunitiesBar />
	</div>
	<div class="h-full border-r-sidebarBorder bg-sidebarBg">
		<Sidebar community={$community} />
	</div>
	<div class="h-full w-full border-l">
		<div class="flex h-16 items-center justify-between border-b px-6">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<div class="flex cursor-pointer items-center" use:builder.action {...builder}>
						<h1 class="text-lg font-semibold">Space {id}</h1>
						<LucideChevronDown class="ml-2 h-5" />
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-52">
					<DropdownMenu.Group>
						<DropdownMenu.Label class="mb-1 text-xs font-medium">
							{$t('space').toUpperCase()}
						</DropdownMenu.Label>
						<DropdownMenu.Item class="text-sm">
							<a href="/communities/{id}/s/1/leave" class="flex w-full text-red-600">
								<LucideLogOut class="mr-2" />
								{$t('leave-space')}
							</a>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="text-sm">
							<a href="/communities/{id}/s/1/delete" class="flex w-full text-red-600">
								<LucideTrash2 class="mr-2" />
								{$t('delete-space')}
							</a>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<div>
				<button class="rounded-md bg-brand px-5 text-sm font-semibold leading-8 text-buttonText"
					>{$t('new-post')}</button
				>
			</div>
		</div>
		<div
			class="flex h-screen w-full flex-col items-center justify-start overflow-y-scroll bg-gray-100 p-5"
		>
			<div class="w-full max-w-2xl">
				<NewPost />

				<Post />
				<Post />
				<Post />
				<Post />
			</div>
		</div>
	</div>
</div>
