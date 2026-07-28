/**
 * Shortcode redirect handler.
 *
 * Looks up a shortcode against the Linkat board and issues a 301 permanent
 * redirect to the target URL. Returns a styled 404 page if the shortcode
 * is unknown — including inline critical CSS so it renders correctly
 * without loading the full app stylesheet.
 */

import type { RequestHandler } from './$types';
import { findShortLink } from '$lib/services/linkat';
import { HTTP, LIMITS } from '$lib/constants';
import { redirect } from '@sveltejs/kit';
import { isValidShortcode } from '$lib/utils/encoding';
import { escapeHtml, toSafeRedirectUrl } from '$lib/utils/validation';

export const GET: RequestHandler = async ({ params }) => {
	const { shortcode } = params;

	// Reject malformed shortcodes before touching the network. The value is
	// attacker-controlled, so it is also escaped everywhere it is rendered.
	const wellFormed =
		typeof shortcode === 'string' &&
		shortcode.length > 0 &&
		shortcode.length <= LIMITS.MAX_SHORTCODE_LENGTH &&
		isValidShortcode(shortcode);

	const link = wellFormed ? await findShortLink(shortcode) : null;

	if (!link) {
		console.warn('[Redirect] Shortcode not found');
		const safeShortcode = escapeHtml((shortcode ?? '').slice(0, LIMITS.MAX_SHORTCODE_LENGTH));
		return new Response(
			`<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Link Not Found - AT Protocol Link Shortener</title>
	<style>
		/* Inline critical CSS for semantic colors */
		:root {
			--color-bg: 255 255 255;
			--color-text: 15 23 42;
			--color-text-secondary: 71 85 105;
			--color-surface: 248 250 252;
			--color-primary: 59 130 246;
		}

		@media (prefers-color-scheme: dark) {
			:root {
				--color-bg: 15 23 42;
				--color-text: 248 250 252;
				--color-text-secondary: 203 213 225;
				--color-surface: 30 41 59;
				--color-primary: 96 165 250;
			}
		}

		body {
			margin: 0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
			background: rgb(var(--color-bg));
			color: rgb(var(--color-text));
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh;
		}

		.container {
			max-width: 600px;
			padding: 2rem;
			text-align: center;
		}

		h1 {
			font-size: 3rem;
			margin-bottom: 1rem;
		}

		h2 {
			font-size: 1.5rem;
			font-weight: 600;
			margin-bottom: 1rem;
		}

		p {
			color: rgb(var(--color-text-secondary));
			line-height: 1.6;
			margin-bottom: 1rem;
		}

		code {
			background: rgb(var(--color-surface));
			padding: 0.2rem 0.5rem;
			border-radius: 0.25rem;
			font-family: 'Courier New', monospace;
			font-size: 0.875rem;
		}

		a {
			color: rgb(var(--color-primary));
			text-decoration: none;
		}

		a:hover {
			text-decoration: underline;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>🔍 404</h1>
		<h2>Short Link Not Found</h2>
		<p>
			The short link <code>/${safeShortcode}</code> doesn't exist.
		</p>
		<p>
			<a href="/">← View all available links</a>
		</p>
	</div>
</body>
</html>`,
			{
				status: HTTP.NOT_FOUND,
				headers: {
					'Content-Type': 'text/html; charset=utf-8',
					'X-Content-Type-Options': 'nosniff',
					'Cache-Control': 'no-store'
				}
			}
		);
	}

	// Defence in depth: the generator already drops unsafe cards, but a target
	// is re-validated immediately before it is placed in a `Location` header so
	// no `javascript:`/`data:` value or header-injection payload can escape.
	const target = toSafeRedirectUrl(link.url);

	if (!target) {
		console.error('[Redirect] Refusing to redirect to an unsafe target');
		return new Response('This short link points to an unsupported target.', {
			status: HTTP.BAD_GATEWAY,
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-store'
			}
		});
	}

	// Permanent redirect (301) — browsers and search engines will cache this
	throw redirect(HTTP.REDIRECT_PERMANENT, target);
};
