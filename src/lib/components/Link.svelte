<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';

	interface Props {
		href: string;
		children: import('svelte').Snippet;
		external?: boolean;
	}

	let { href, children, external = false }: Props = $props();

	let isHovered = $state(false);
</script>

<a
	{href}
	class="inline-flex items-center gap-1.5 no-underline transition-colors"
	style="color: {isHovered ? 'rgb(var(--color-primary-hover))' : 'rgb(var(--color-primary))'}"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
>
	{@render children()}
	{#if external}
		<ExternalLink size={14} class="shrink-0" />
	{/if}
</a>
