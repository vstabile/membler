<script lang="ts">
	import { page } from '$app/stores';

	$: slug = $page.params.slug;
</script>

<h1>{slug}</h1>
