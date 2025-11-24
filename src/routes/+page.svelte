<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>AT Protocol Link Shortener</title>
	<meta name="description" content="A server-side link shortening service powered by Linkat" />
</svelte:head>

<main class="mx-auto max-w-3xl px-4 py-8 font-sans leading-relaxed">
	<h1 class="mb-8 text-3xl font-bold" style="color: rgb(var(--color-text-primary))">
		AT Protocol Link Shortener
	</h1>

	<section class="mb-12">
		<h2 class="mb-4 mt-8 text-2xl font-semibold" style="color: rgb(var(--color-text-primary))">
			Service Status
		</h2>
		{#if data.error}
			<div
				class="mb-4 rounded-lg border p-4"
				style="background-color: rgb(var(--color-error-bg)); border-color: rgb(var(--color-error-border))"
			>
				<p class="font-bold" style="color: rgb(var(--color-text-primary))">
					⚠️ Configuration Error
				</p>
				<p style="color: rgb(var(--color-text-primary))">{data.error}</p>
				{#if data.did === 'NOT_CONFIGURED'}
					<div class="mt-4 border-t pt-4" style="border-color: rgb(var(--color-error-border))">
						<p class="font-bold" style="color: rgb(var(--color-text-primary))">Quick Fix:</p>
						<ol
							class="ml-6 mt-2 list-decimal space-y-2 leading-8"
							style="color: rgb(var(--color-text-primary))"
						>
							<li>
								Create a <code
									class="rounded px-2 py-1 font-mono text-sm"
									style="background-color: rgb(var(--color-code-bg))">. env</code
								> file in your project root
							</li>
							<li>
								Add: <code
									class="rounded px-2 py-1 font-mono text-sm"
									style="background-color: rgb(var(--color-code-bg))"
									>ATPROTO_DID=did:plc:your-did-here</code
								>
							</li>
							<li>
								Find your DID at <a
									href="https://pdsls.dev/"
									target="_blank"
									class="underline"
									style="color: rgb(var(--color-error))">pdsls.dev</a
								>
							</li>
							<li>
								Run <code
									class="rounded px-2 py-1 font-mono text-sm"
									style="background-color: rgb(var(--color-code-bg))">npm run test:config</code
								> to verify
							</li>
							<li>Restart the server</li>
						</ol>
					</div>
				{/if}
			</div>
		{:else}
			<div
				class="mb-4 rounded-lg border p-4"
				style="background-color: rgb(var(--color-success-bg)); border-color: rgb(var(--color-success-border))"
			>
				<p style="color: rgb(var(--color-text-primary))">✓ Service is running</p>
				<p style="color: rgb(var(--color-text-primary))">
					✓ Configured DID: <code
						class="rounded px-2 py-1 font-mono text-sm"
						style="background-color: rgb(var(--color-code-bg))">{data.did}</code
					>
				</p>
				<p style="color: rgb(var(--color-text-primary))">✓ Active links: {data.linkCount}</p>
			</div>
		{/if}
	</section>

	<section class="mb-12">
		<h2 class="mb-4 mt-8 text-2xl font-semibold" style="color: rgb(var(--color-text-primary))">
			Available Short Links
		</h2>
		{#if data.links && data.links.length > 0}
			<ul class="m-0 list-none p-0">
				{#each data.links as link}
					<li class="mb-2">
						<a
							href="/{link.shortcode}"
							class="flex items-center gap-3 rounded-lg p-3 no-underline transition-colors"
							style="background-color: rgb(var(--color-surface)); color: rgb(var(--color-text-primary))"
							onmouseenter={(e) => {
								e.currentTarget.style.backgroundColor = `rgb(var(--color-surface-elevated))`;
							}}
							onmouseleave={(e) => {
								e.currentTarget.style.backgroundColor = `rgb(var(--color-surface))`;
							}}
						>
							{#if link.emoji}
								<span class="shrink-0 text-2xl">{link.emoji}</span>
							{/if}
							<code
								class="rounded px-2 py-1 font-mono text-sm"
								style="background-color: rgb(var(--color-code-bg))">/{link.shortcode}</code
							>
							<span style="color: rgb(var(--color-text-secondary))">{link.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else if !data.error}
			<p class="italic" style="color: rgb(var(--color-text-secondary))">
				No short links configured yet. Add links to your <a
					href="https://linkat.blue"
					target="_blank"
					class="no-underline hover:underline"
					style="color: rgb(var(--color-primary))"
					onmouseenter={(e) => {
						e.currentTarget.style.color = `rgb(var(--color-primary-hover))`;
					}}
					onmouseleave={(e) => {
						e.currentTarget.style.color = `rgb(var(--color-primary))`;
					}}>Linkat board</a
				>!
			</p>
		{/if}
	</section>

	<section class="mb-12">
		<h2 class="mb-4 mt-8 text-2xl font-semibold" style="color: rgb(var(--color-text-primary))">
			API Endpoints
		</h2>
		<ul class="m-0 list-none p-0">
			<li class="mb-3 rounded-lg p-3" style="background-color: rgb(var(--color-surface))">
				<a
					href="/api/links"
					class="flex items-center gap-4 no-underline hover:underline"
					style="color: rgb(var(--color-text-primary))"
				>
					<code
						class="rounded px-2 py-1 font-mono text-sm"
						style="background-color: rgb(var(--color-code-bg))">GET /api/links</code
					>
					<span style="color: rgb(var(--color-text-secondary))">List all short links (JSON)</span>
				</a>
			</li>
			<li class="mb-3 rounded-lg p-3" style="background-color: rgb(var(--color-surface))">
				<div class="flex items-center gap-4" style="color: rgb(var(--color-text-primary))">
					<code
						class="rounded px-2 py-1 font-mono text-sm"
						style="background-color: rgb(var(--color-code-bg))">GET /:shortcode</code
					>
					<span style="color: rgb(var(--color-text-secondary))">Redirect to target URL (301)</span>
				</div>
			</li>
		</ul>
	</section>

	<footer
		class="mt-16 border-t pt-8 text-center text-sm"
		style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text-secondary))"
	>
		<p class="mb-2">
			Powered by <a
				href="https://linkat.blue"
				target="_blank"
				rel="noopener noreferrer"
				class="no-underline hover:underline"
				style="color: rgb(var(--color-primary))"
				onmouseenter={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary-hover))`;
				}}
				onmouseleave={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary))`;
				}}>Linkat</a
			>,
			<a
				href="https://atproto.com"
				target="_blank"
				rel="noopener noreferrer"
				class="no-underline hover:underline"
				style="color: rgb(var(--color-primary))"
				onmouseenter={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary-hover))`;
				}}
				onmouseleave={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary))`;
				}}>AT Protocol</a
			>, and
			<a
				href="https://slingshot.microcosm.blue"
				target="_blank"
				rel="noopener noreferrer"
				class="no-underline hover:underline"
				style="color: rgb(var(--color-primary))"
				onmouseenter={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary-hover))`;
				}}
				onmouseleave={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary))`;
				}}>Slingshot</a
			>
		</p>
		<p>
			<a
				href="https://github.com/ewanc26/atproto-shortlink"
				target="_blank"
				rel="noopener noreferrer"
				class="no-underline hover:underline"
				style="color: rgb(var(--color-primary))"
				onmouseenter={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary-hover))`;
				}}
				onmouseleave={(e) => {
					e.currentTarget.style.color = `rgb(var(--color-primary))`;
				}}>Source Code on GitHub</a
			>
		</p>
	</footer>
</main>
