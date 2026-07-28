<script lang="ts">
	/**
	 * Fixed-position theme toggle (light/dark) with localStorage persistence.
	 * Only renders after mount to avoid hydration mismatch on the icon state.
	 */
	import { Sun, Moon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let isDark = $state(false);
	let mounted = $state(false);

	onMount(() => {
		// Check initial theme
		isDark = document.documentElement.classList.contains('dark');
		mounted = true;
	});

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);

		// Persistence is best-effort: localStorage throws in some privacy modes.
		try {
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		} catch {
			// Ignore — the theme still applies for this page view.
		}
	}
</script>

{#if mounted}
	<button
		onclick={toggleTheme}
		class="fixed bottom-6 right-6 rounded-full p-3 shadow-lg transition-all hover:scale-110"
		style="background-color: rgb(var(--color-surface-elevated)); color: rgb(var(--color-text-primary))"
		aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
		aria-pressed={isDark}
		title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
	>
		{#if isDark}
			<Sun size={20} />
		{:else}
			<Moon size={20} />
		{/if}
	</button>
{/if}
