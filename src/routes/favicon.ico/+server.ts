/**
 * Favicon endpoint — returns 204 No Content.
 * The app doesn't ship a custom favicon; this prevents 404s in browser
 * devtools without the overhead of serving a real file.
 *
 * Must live at /favicon.ico: that is the path browsers request unprompted,
 * so a route nested any deeper never gets hit and the 404 comes back.
 */

import type { RequestHandler } from './$types';
import { HTTP } from '$lib/constants';

export const GET: RequestHandler = async () => {
	return new Response(null, {
		status: HTTP.NO_CONTENT
	});
};
