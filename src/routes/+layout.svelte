<script lang="ts">
	import '../app.css';
	import { ThemeToggle } from '$lib/components';

	let { children } = $props();
</script>

<svelte:head>
	<script>
		// Prevent flash of unstyled content (FOUC) by applying theme before page renders
		(function () {
			const stored = localStorage.getItem('theme');
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const htmlElement = document.documentElement;

			// Use stored theme if available, otherwise use system preference
			const shouldBeDark = stored === 'dark' || (!stored && prefersDark);

			if (shouldBeDark) {
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
	<ThemeToggle />
</div>
