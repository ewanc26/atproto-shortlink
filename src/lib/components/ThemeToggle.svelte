<script lang="ts">
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
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

{#if mounted}
	<button
		onclick={toggleTheme}
		class="fixed bottom-6 right-6 rounded-full p-3 shadow-lg transition-all hover:scale-110"
		style="background-color: rgb(var(--color-surface-elevated)); color: rgb(var(--color-text-primary))"
		aria-label="Toggle theme"
	>
		{#if isDark}
			<Sun size={20} />
		{:else}
			<Moon size={20} />
		{/if}
	</button>
{/if}
