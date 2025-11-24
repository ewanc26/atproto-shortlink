<script lang="ts">
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
				htmlElement.style.colorScheme = 'dark';
			} else {
				htmlElement.classList.remove('dark');
				htmlElement.style.colorScheme = 'light';
			}
		})();
	</script>
</svelte:head>

{@render children()}

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		min-height: 100vh;
		background: #ffffff;
		color: #1a1a1a;
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	:global(html.dark) {
		background: #1a1a1a;
		color: #e0e0e0;
	}

	:global(html.dark .info) {
		background: #1e3a1e;
		border-color: #4caf50;
		color: #e0e0e0;
	}

	:global(html.dark .error) {
		background: #3a1e1e;
		border-color: #f44336;
		color: #e0e0e0;
	}

	:global(html.dark code) {
		background: #2a2a2a;
		color: #e0e0e0;
	}

	:global(html.dark .links a),
	:global(html.dark .api li) {
		background: #2a2a2a;
	}

	:global(html.dark .links a:hover) {
		background: #333;
	}

	:global(html.dark h1),
	:global(html.dark h2) {
		color: #e0e0e0;
	}

	:global(html.dark .title),
	:global(html.dark .api span),
	:global(html.dark .empty),
	:global(html.dark footer) {
		color: #b0b0b0;
	}

	:global(html.dark footer) {
		border-top-color: #333;
	}
</style>
