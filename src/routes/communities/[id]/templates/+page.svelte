<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { page } from '$app/stores';

	$: id = $page.params.id;
</script>

<div class="flex min-h-screen w-full justify-center bg-gray-300 md:items-center md:bg-gray-100">
	<div class="w-full md:my-4 md:max-w-[520px]">
		<div
			class="m-auto flex min-h-screen w-full flex-col items-center border-gray-200 bg-gray-50 p-6 py-0 pt-10 md:min-h-0 md:rounded-2xl md:border md:p-12 md:py-10"
		>
			<div class="py-4">Membler</div>
			<h1 class="mt-4 text-center text-xl font-bold md:mt-8 md:text-2xl">
				Pick a community template
			</h1>
			<p class="mt-3 text-center text-sm text-gray-500">
				Optionally, pick a template to start your community with. Templates include a default set of
				spaces and can be customized later.
			</p>
			<div class="mt-8 w-full">
				<ToggleGroup.Root type="single" variant="outline" size="lg" class="block">
					<ToggleGroup.Item value="basic" class="w-full">Basic</ToggleGroup.Item>
					<ToggleGroup.Item value="course" class="mt-4 w-full">Course</ToggleGroup.Item>
					<ToggleGroup.Item value="none" class="mt-4 w-full">None</ToggleGroup.Item>
				</ToggleGroup.Root>
				<!-- <div>
					<Button variant="outline" size="lg" class="w-full">Basic</Button>
					<Button variant="outline" size="lg" class="mt-4 w-full">Course</Button>
					<Button variant="outline" size="lg" class="mt-4 w-full">None</Button>
				</div> -->
				<div>
					<div class="mt-10 w-full text-center">
						<div class="mx-auto flex w-full justify-end">
							<Button variant="link" href={`/communities/${id}`}>Skip</Button>
							<Button href={`/communities/${id}`}>Finish</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
