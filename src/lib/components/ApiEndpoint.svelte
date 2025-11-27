<script lang="ts">
	import { Globe } from '@lucide/svelte';
	import CodeBlock from './CodeBlock.svelte';

	interface Props {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		path: string;
		description: string;
		href?: string;
	}

	let { method, path, description, href }: Props = $props();

	let isHovered = $state(false);

	const methodColors = {
		GET: 'rgb(var(--color-success))',
		POST: 'rgb(var(--color-primary))',
		PUT: 'rgb(var(--color-primary))',
		DELETE: 'rgb(var(--color-error))'
	};
</script>

<li class="rounded-lg p-3" style="background-color: rgb(var(--color-surface))">
	{#if href}
		<a
			{href}
			class="flex items-center gap-4 no-underline"
			style="color: rgb(var(--color-text-primary))"
			onmouseenter={() => (isHovered = true)}
			onmouseleave={() => (isHovered = false)}
		>
			<span
				class="shrink-0 rounded px-2 py-1 text-xs font-bold"
				style="background-color: {methodColors[method]}; color: white"
			>
				{method}
			</span>
			<CodeBlock>{path}</CodeBlock>
			<span style="color: rgb(var(--color-text-secondary))">{description}</span>
			{#if isHovered}
				<Globe size={16} class="ml-auto shrink-0" style="color: rgb(var(--color-text-tertiary))" />
			{/if}
		</a>
	{:else}
		<div class="flex items-center gap-4" style="color: rgb(var(--color-text-primary))">
			<span
				class="shrink-0 rounded px-2 py-1 text-xs font-bold"
				style="background-color: {methodColors[method]}; color: white"
			>
				{method}
			</span>
			<CodeBlock>{path}</CodeBlock>
			<span style="color: rgb(var(--color-text-secondary))">{description}</span>
		</div>
	{/if}
</li>
