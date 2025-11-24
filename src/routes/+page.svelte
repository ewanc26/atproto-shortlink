<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>AT Protocol Link Shortener</title>
	<meta name="description" content="A server-side link shortening service powered by Linkat" />
</svelte:head>

<main>
	<h1>AT Protocol Link Shortener</h1>

	<section>
		<h2>Service Status</h2>
		{#if data.error}
			<div class="error">
				<p><strong>⚠️ Configuration Error</strong></p>
				<p>{data.error}</p>
				{#if data.did === 'NOT_CONFIGURED'}
					<div class="help">
						<p><strong>Quick Fix:</strong></p>
						<ol>
							<li>Create a <code>.env</code> file in your project root</li>
							<li>
								Add: <code>ATPROTO_DID=did:plc:your-did-here</code>
							</li>
							<li>
								Find your DID at <a href="https://pdsls.dev/" target="_blank">pdsls.dev</a>
							</li>
							<li>Run <code>npm run test:config</code> to verify</li>
							<li>Restart the server</li>
						</ol>
					</div>
				{/if}
			</div>
		{:else}
			<div class="info">
				<p>✓ Service is running</p>
				<p>✓ Configured DID: <code>{data.did}</code></p>
				<p>✓ Active links: {data.linkCount}</p>
			</div>
		{/if}
	</section>

	<section>
		<h2>Available Short Links</h2>
		{#if data.links && data.links.length > 0}
			<ul class="links">
				{#each data.links as link}
					<li>
						<a href="/{link.shortcode}">
							{#if link.emoji}
								<span class="emoji">{link.emoji}</span>
							{/if}
							<code>/{link.shortcode}</code>
							<span class="title">{link.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else if !data.error}
			<p class="empty">
				No short links configured yet. Add links to your <a
					href="https://linkat.blue"
					target="_blank">Linkat board</a
				>!
			</p>
		{/if}
	</section>

	<section>
		<h2>API Endpoints</h2>
		<ul class="api">
			<li>
				<a href="/api/links">
					<code>GET /api/links</code>
					<span>List all short links (JSON)</span>
				</a>
			</li>
			<li>
				<code>GET /:shortcode</code>
				<span>Redirect to target URL (301)</span>
			</li>
		</ul>
	</section>

	<footer>
		<p>
			Powered by <a href="https://linkat.blue" target="_blank">Linkat</a>,
			<a href="https://atproto.com" target="_blank">AT Protocol</a>, and
			<a href="https://slingshot.microcosm.blue" target="_blank">Slingshot</a>
		</p>
	</footer>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
		line-height: 1.6;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
		color: #1a1a1a;
	}

	h2 {
		font-size: 1.5rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: #333;
	}

	section {
		margin-bottom: 3rem;
	}

	.info,
	.error {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.info {
		background: #e8f5e9;
		border: 1px solid #4caf50;
	}

	.error {
		background: #ffebee;
		border: 1px solid #f44336;
	}

	.help {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	.help ol {
		margin-left: 1.5rem;
		margin-top: 0.5rem;
		line-height: 1.8;
	}

	.help a {
		color: #d32f2f;
		text-decoration: underline;
	}

	code {
		background: #f5f5f5;
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
	}

	.links {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.links li {
		margin-bottom: 0.5rem;
	}

	.links a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: #f8f9fa;
		border-radius: 0.5rem;
		text-decoration: none;
		color: inherit;
		transition: background 0.2s;
	}

	.links a:hover {
		background: #e9ecef;
	}

	.emoji {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.title {
		color: #666;
	}

	.empty {
		color: #666;
		font-style: italic;
	}

	.empty a {
		color: #0066cc;
		text-decoration: none;
	}

	.empty a:hover {
		text-decoration: underline;
	}

	.api {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.api li {
		margin-bottom: 0.75rem;
		padding: 0.75rem;
		background: #f8f9fa;
		border-radius: 0.5rem;
	}

	.api a {
		display: flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
	}

	.api a:hover {
		text-decoration: underline;
	}

	.api span {
		color: #666;
	}

	footer {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid #e0e0e0;
		text-align: center;
		color: #666;
		font-size: 0.9rem;
	}

	footer a {
		color: #0066cc;
		text-decoration: none;
	}

	footer a:hover {
		text-decoration: underline;
	}
</style>
