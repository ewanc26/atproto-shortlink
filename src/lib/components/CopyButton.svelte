<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';

	interface Props {
		text: string;
		size?: number;
	}

	let { text, size = 16 }: Props = $props();

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;

			// Clear existing timeout
			if (timeout) clearTimeout(timeout);

			// Reset after 2 seconds
			timeout = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<button
	onclick={copyToClipboard}
	class="rounded p-1 transition-colors hover:bg-opacity-20"
	style="color: rgb(var(--color-text-secondary))"
	aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
	title={copied ? 'Copied!' : 'Copy to clipboard'}
>
	{#if copied}
		<Check {size} style="color: rgb(var(--color-success))" />
	{:else}
		<Copy {size} />
	{/if}
</button>
