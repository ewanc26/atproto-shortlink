<script lang="ts">
	import { Link as LinkIcon, ArrowRight, QrCode } from '@lucide/svelte';
	import CodeBlock from './CodeBlock.svelte';
	import CopyButton from './CopyButton.svelte';
	import QRCodeModal from './QRCodeModal.svelte';

	interface Props {
		shortcode: string;
		title: string;
		emoji?: string;
	}

	let { shortcode, title, emoji }: Props = $props();

	let isHovered = $state(false);
	let showQRModal = $state(false);

	// Get the full URL for copying
	const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}/${shortcode}` : '';
</script>

<li>
	<div
		class="flex items-center gap-3 rounded-lg p-3 transition-all"
		style="background-color: {isHovered
			? 'rgb(var(--color-surface-elevated))'
			: 'rgb(var(--color-surface))'}; color: rgb(var(--color-text-primary))"
		role="group"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
	>
		{#if emoji}
			<span class="shrink-0 text-2xl">{emoji}</span>
		{:else}
			<LinkIcon size={20} class="shrink-0" style="color: rgb(var(--color-text-secondary))" />
		{/if}

		<a href="/{shortcode}" class="flex items-center gap-2 no-underline">
			<CodeBlock>/{shortcode}</CodeBlock>
		</a>

		<span class="flex-1" style="color: rgb(var(--color-text-secondary))">{title}</span>

		{#if fullUrl}
			<button
				onclick={() => (showQRModal = true)}
				class="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
				style="color: rgb(var(--color-text-tertiary))"
				aria-label="Show QR code"
				title="Show QR code"
			>
				<QrCode size={16} class="shrink-0" />
			</button>

			<CopyButton text={fullUrl} />
		{/if}

		<a
			href="/{shortcode}"
			class="flex items-center gap-1 no-underline transition-colors"
			style="color: rgb(var(--color-text-tertiary))"
		>
			<ArrowRight
				size={16}
				class="shrink-0 transition-transform"
				style="transform: translateX({isHovered ? '4px' : '0'})"
			/>
		</a>
	</div>
</li>

<QRCodeModal url={fullUrl} isOpen={showQRModal} onClose={() => (showQRModal = false)} />
