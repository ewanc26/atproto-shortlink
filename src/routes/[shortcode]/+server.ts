import type { RequestHandler } from './$types';
import { findShortLink } from '$lib/services/linkat';
import { HTTP } from '$lib/constants';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { shortcode } = params;

	console.log(`[Redirect] Looking up shortcode: ${shortcode}`);

	const link = await findShortLink(shortcode);

	if (!link) {
		console.warn(`[Redirect] Shortcode not found: ${shortcode}`);
		return new Response(
			`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Link Not Found - AT Protocol Link Shortener</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
			max-width: 600px;
			margin: 4rem auto;
			padding: 2rem;
			text-align: center;
		}
		h1 { font-size: 3rem; margin-bottom: 1rem; }
		p { color: #666; line-height: 1.6; margin-bottom: 1rem; }
		code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
		a { color: #0066cc; text-decoration: none; }
		a:hover { text-decoration: underline; }
	</style>
</head>
<body>
	<h1>🔍 404</h1>
	<h2>Short Link Not Found</h2>
	<p>The short link <code>/${shortcode}</code> doesn't exist.</p>
	<p><a href="/">← View all available links</a></p>
</body>
</html>`,
			{
				status: HTTP.NOT_FOUND,
				headers: {
					'Content-Type': 'text/html'
				}
			}
		);
	}

	console.log(`[Redirect] Redirecting to: ${link.url}`);

	// Permanent redirect
	throw redirect(HTTP.REDIRECT_PERMANENT, link.url);
};
