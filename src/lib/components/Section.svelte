<script lang="ts">
	interface Props {
		title: string;
		children: import('svelte').Snippet;
	}

	let { title, children }: Props = $props();
</script>

<section class="mb-12">
	<h2 class="mb-4 mt-8 text-2xl font-semibold" style="color: rgb(var(--color-text-primary))">
		{title}
	</h2>
	{@render children()}
</section>
