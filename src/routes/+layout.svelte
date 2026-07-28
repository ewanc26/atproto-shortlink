<script lang="ts">
	/**
	 * Root layout — applies the global stylesheet, injects a FOUC-prevention
	 * script that sets the theme class before the first paint, and renders
	 * the theme toggle in the bottom-right corner.
	 */
	import '../app.css';
	import { ThemeToggle } from '$lib/components';

	let { children } = $props();
</script>

<svelte:head>
	<script>
		// Prevent flash of unstyled content (FOUC) by applying theme before page renders
		(function () {
			// localStorage throws in some privacy modes; fall back to the OS preference.
			let stored = null;
			try {
				stored = localStorage.getItem('theme');
			} catch (e) {}

			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const htmlElement = document.documentElement;

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
