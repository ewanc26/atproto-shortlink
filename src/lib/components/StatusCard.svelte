<script lang="ts">
	import { CheckCircle2, AlertCircle } from '@lucide/svelte';

	interface Props {
		type: 'success' | 'error';
		children: import('svelte').Snippet;
	}

	let { type, children }: Props = $props();

	const styles = {
		success: {
			bg: 'rgb(var(--color-success-bg))',
			border: 'rgb(var(--color-success-border))',
			icon: CheckCircle2
		},
		error: {
			bg: 'rgb(var(--color-error-bg))',
			border: 'rgb(var(--color-error-border))',
			icon: AlertCircle
		}
	};

	const config = styles[type];
	const Icon = config.icon;
</script>

<div
	class="mb-4 rounded-lg border p-4"
	style="background-color: {config.bg}; border-color: {config.border}"
>
	<div class="flex items-start gap-3">
		<Icon size={24} class="shrink-0" style="color: rgb(var(--color-text-primary))" />
		<div class="flex-1">
			{@render children()}
		</div>
	</div>
</div>
