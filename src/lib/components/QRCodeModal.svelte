<script lang="ts">
	import { X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	interface Props {
		url: string;
		isOpen: boolean;
		onClose: () => void;
	}

	let { url, isOpen, onClose }: Props = $props();

	let qrCodeContainer: HTMLDivElement;

	$effect(() => {
		if (isOpen && qrCodeContainer && typeof window !== 'undefined') {
			import('qrcode').then(({ default: QRCode }) => {
				qrCodeContainer.innerHTML = '';
				QRCode.toCanvas(url, {
					errorCorrectionLevel: 'H',
					margin: 2,
					width: 256,
					color: {
						dark: '#000000',
						light: '#FFFFFF'
					}
				}, (error: Error | null | undefined, canvas: HTMLCanvasElement) => {
					if (error) {
						console.error('QR Code generation error:', error);
						return;
					}
					if (qrCodeContainer) {
						qrCodeContainer.appendChild(canvas);
					}
				});
			});
		}
	});
</script>

{#if isOpen}
	<div
		style="
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.75);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 1rem;
			z-index: 9999;
		"
		onclick={onClose}
		role="dialog"
		aria-modal="true"
		aria-labelledby="qr-modal-title"
	>
		<div
			class="relative w-full max-w-md rounded-lg p-8 shadow-2xl"
			style="background-color: rgb(var(--color-surface)); color: rgb(var(--color-text-primary))"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<button
				onclick={onClose}
				class="absolute right-4 top-4 rounded-lg p-2 transition-colors"
				style="color: rgb(var(--color-text-secondary)); background-color: transparent;"
				onmouseenter={(e) => {
					e.currentTarget.style.backgroundColor = 'rgb(var(--color-surface-elevated))';
				}}
				onmouseleave={(e) => {
					e.currentTarget.style.backgroundColor = 'transparent';
				}}
				aria-label="Close modal"
			>
				<X size={20} />
			</button>

			<h2
				id="qr-modal-title"
				class="mb-6 text-xl font-semibold"
				style="color: rgb(var(--color-text-primary))"
			>
				QR Code
			</h2>

			<div class="flex flex-col items-center gap-4">
				<div
					bind:this={qrCodeContainer}
					class="rounded-lg p-4"
					style="background-color: white;"
				></div>
				<p
					class="max-w-xs break-all text-center text-sm"
					style="color: rgb(var(--color-text-secondary))"
				>
					{url}
				</p>
			</div>
		</div>
	</div>
{/if}
