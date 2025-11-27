<script lang="ts">
	import { Github, Link as LinkIcon } from '@lucide/svelte';
	import {
		StatusCard,
		CodeBlock,
		Link,
		ShortLinkItem,
		ApiEndpoint,
		Section
	} from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>AT Protocol Link Shortener</title>
	<meta name="description" content="A server-side link shortening service powered by Linkat" />
</svelte:head>

<main class="mx-auto max-w-3xl px-4 py-8 font-sans leading-relaxed">
	<header class="mb-8">
		<h1 class="mb-2 text-3xl font-bold" style="color: rgb(var(--color-text-primary))">
			AT Protocol Link Shortener
		</h1>
		<p style="color: rgb(var(--color-text-secondary))">
			A self-hosted link shortening service powered by Linkat and AT Protocol
		</p>
	</header>

	<Section title="Service Status">
		{#if data.error}
			<StatusCard type="error">
				<p class="mb-2 font-bold" style="color: rgb(var(--color-text-primary))">
					Configuration Error
				</p>
				<p class="mb-2" style="color: rgb(var(--color-text-primary))">{data.error}</p>

				{#if data.did === 'NOT_CONFIGURED'}
					<div class="mt-4 border-t pt-4" style="border-color: rgb(var(--color-error-border))">
						<p class="mb-3 font-bold" style="color: rgb(var(--color-text-primary))">Quick Fix:</p>
						<ol class="ml-6 space-y-2" style="color: rgb(var(--color-text-primary))">
							<li>
								Create a <CodeBlock>.env</CodeBlock> file in your project root
							</li>
							<li>
								Add: <CodeBlock>ATPROTO_DID=did:plc:your-did-here</CodeBlock>
							</li>
							<li>
								Find your DID at <Link href="https://pdsls.dev/" external>pdsls.dev</Link>
							</li>
							<li>
								Run <CodeBlock>npm run test:config</CodeBlock> to verify
							</li>
							<li>Restart the server</li>
						</ol>
					</div>
				{/if}
			</StatusCard>
		{:else}
			<StatusCard type="success">
				<div class="space-y-1" style="color: rgb(var(--color-text-primary))">
					<p>Service is running</p>
					<p class="flex items-center gap-2">
						Configured DID: <CodeBlock>{data.did}</CodeBlock>
					</p>
					<p>Active links: {data.linkCount}</p>
				</div>
			</StatusCard>
		{/if}
	</Section>

	<Section title="Available Short Links">
		{#if data.links && data.links.length > 0}
			<ul class="m-0 space-y-2 list-none p-0">
				{#each data.links as link}
					<ShortLinkItem shortcode={link.shortcode} title={link.title} emoji={link.emoji} />
				{/each}
			</ul>
		{:else if !data.error}
			<div
				class="rounded-lg border p-6 text-center"
				style="background-color: rgb(var(--color-surface)); border-color: rgb(var(--color-border))"
			>
				<LinkIcon size={48} class="mx-auto mb-4" style="color: rgb(var(--color-text-tertiary))" />
				<p class="mb-2" style="color: rgb(var(--color-text-primary))">
					No short links configured yet
				</p>
				<p style="color: rgb(var(--color-text-secondary))">
					Add links to your <Link href="https://linkat.blue" external>Linkat board</Link> to get started!
				</p>
			</div>
		{/if}
	</Section>

	<Section title="API Endpoints">
		<ul class="m-0 space-y-3 list-none p-0">
			<ApiEndpoint
				method="GET"
				path="/api/links"
				description="List all short links (JSON)"
				href="/api/links"
			/>
			<ApiEndpoint method="GET" path="/:shortcode" description="Redirect to target URL (301)" />
		</ul>
	</Section>

	<footer
		class="mt-16 border-t pt-8 space-y-4 text-center text-sm"
		style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text-secondary))"
	>
		<p>
			Powered by
			<Link href="https://linkat.blue" external>Linkat</Link>,
			<Link href="https://atproto.com" external>AT Protocol</Link>, and
			<Link href="https://slingshot.microcosm.blue" external>Slingshot</Link>
		</p>
		<p>
			<Link href="https://github.com/ewanc26/atproto-shortlink" external>
				<Github size={14} />
				Source Code on GitHub
			</Link>
		</p>
	</footer>
</main>
