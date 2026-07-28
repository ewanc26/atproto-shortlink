<script lang="ts">
	/**
	 * Full-screen modal that renders a QR code for the selected short link.
	 * Uses a dynamic import of the qrcode library so the payload is only fetched
	 * when the modal is first opened.
	 */
	import { X } from '@lucide/svelte';

	interface Props {
		url: string;
		isOpen: boolean;
		onClose: () => void;
	}

	let { url, isOpen, onClose }: Props = $props();

	let qrCodeContainer = $state<HTMLDivElement | undefined>();

	// Escape is bound at the window so it works regardless of where focus sits;
	// relying on a handler on the backdrop only fired after a click landed on it.
	function handleKeydown(e: KeyboardEvent) {
		if (isOpen && e.key === 'Escape') {
			onClose();
		}
	}

	$effect(() => {
		if (isOpen && qrCodeContainer && typeof window !== 'undefined') {
			import('qrcode').then(({ default: QRCode }) => {
				if (!qrCodeContainer) return;

				qrCodeContainer.innerHTML = '';
				QRCode.toCanvas(
					url,
					{
						errorCorrectionLevel: 'H',
						margin: 2,
						width: 256,
						color: {
							dark: '#000000',
							light: '#FFFFFF'
						}
					},
					(error: Error | null | undefined, canvas: HTMLCanvasElement) => {
						if (error) {
							console.error('QR Code generation error:', error);
							return;
						}
						if (qrCodeContainer) {
							qrCodeContainer.appendChild(canvas);
						}
					}
				);
			});
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Presentational backdrop. Click-to-close is a pointer convenience only:
	     keyboard users close via Escape (bound at the window) or the close
	     button, so no keyboard handler is needed here. -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
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
		onclick={(e) => {
			// Only a click on the backdrop itself closes; clicks inside the panel
			// bubble up here but must be ignored.
			if (e.target === e.currentTarget) onClose();
		}}
	>
		<div
			class="relative w-full max-w-md rounded-lg p-8 shadow-2xl"
			style="background-color: rgb(var(--color-surface)); color: rgb(var(--color-text-primary))"
			role="dialog"
			aria-modal="true"
			aria-labelledby="qr-modal-title"
			tabindex="-1"
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
