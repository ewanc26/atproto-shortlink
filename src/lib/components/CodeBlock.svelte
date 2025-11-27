<script lang="ts">
	import { Code2 } from '@lucide/svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<code
	class="inline-flex items-center gap-1.5 rounded px-2 py-1 font-mono text-sm"
	style="background-color: rgb(var(--color-code-bg))"
>
	<Code2 size={14} style="color: rgb(var(--color-text-secondary))" />
	{@render children()}
</code>
