<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<script>
		// Prevent flash of unstyled content (FOUC) by applying theme before page renders
		(function () {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const htmlElement = document.documentElement;

			if (prefersDark) {
				htmlElement.classList.add('dark');
			} else {
				htmlElement.classList.remove('dark');
			}
		})();
	</script>
</svelte:head>

<div
	style="min-height: 100vh; background-color: rgb(var(--color-background)); color: rgb(var(--color-text-primary))"
>
	{@render children()}
</div>
