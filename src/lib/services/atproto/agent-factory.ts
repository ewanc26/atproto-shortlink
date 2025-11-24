import { AtpAgent } from '@atproto/api';

/**
 * Creates an AtpAgent with optional fetch function injection
 *
 * @param service - Service URL for the agent
 * @param fetchFn - Optional custom fetch function (useful for server-side contexts)
 * @returns Configured AtpAgent instance
 */
export function createAgent(service: string, fetchFn?: typeof fetch): AtpAgent {
	// If we have an injected fetch, wrap it to ensure we handle headers correctly
	const wrappedFetch = fetchFn
		? async (url: URL | RequestInfo, init?: RequestInit) => {
				// Convert URL to string if needed
				const urlStr = url instanceof URL ? url.toString() : url;

				// Make the request with the injected fetch
				const response = await fetchFn(urlStr, init);

				// Create a new response with the same body but add content-type if missing
				const headers = new Headers(response.headers);
				if (!headers.has('content-type')) {
					headers.set('content-type', 'application/json');
				}

				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers
				});
			}
		: undefined;

	return new AtpAgent({
		service,
		...(wrappedFetch && { fetch: wrappedFetch })
	});
}
