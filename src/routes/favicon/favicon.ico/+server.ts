/**
 * Favicon endpoint — returns 204 No Content.
 * The app doesn't ship a custom favicon; this prevents 404s in browser
 * devtools without the overhead of serving a real file.
 */

import type { RequestHandler } from './$types';
import { HTTP } from '$lib/constants';

export const GET: RequestHandler = async () => {
	return new Response(null, {
		status: HTTP.NO_CONTENT
	});
};
