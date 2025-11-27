<script lang="ts">
	import { Loader2 } from '@lucide/svelte';

	interface Props {
		size?: number;
		text?: string;
	}

	let { size = 24, text }: Props = $props();
</script>

<div class="flex items-center gap-3" style="color: rgb(var(--color-text-secondary))">
	<Loader2 {size} class="animate-spin" />
	{#if text}
		<span>{text}</span>
	{/if}
</div>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	:global(.animate-spin) {
		animation: spin 1s linear infinite;
	}
</style>
