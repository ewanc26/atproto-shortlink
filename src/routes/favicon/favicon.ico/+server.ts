import type { RequestHandler } from './$types';
import { HTTP } from '$lib/constants';

export const GET: RequestHandler = async () => {
	// Return 204 No Content to indicate no favicon is available
	return new Response(null, {
		status: HTTP.NO_CONTENT
	});
};
