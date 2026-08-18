import { Client } from '@atproto/lex';

export type { Client } from '@atproto/lex';

/**
 * Creates a Client with optional fetch function injection
 *
 * @param service - Service URL for the client
 * @param fetchFn - Optional custom fetch function (useful for server-side contexts)
 * @returns Configured Client instance
 */
export function createAgent(service: string, fetchFn?: typeof fetch): Client {
	const wrappedFetch = fetchFn
		? async (url: URL | RequestInfo, init?: RequestInit) => {
				const urlStr = url instanceof URL ? url.toString() : url;
				const response = await fetchFn(urlStr, init);
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

	return new Client(service, wrappedFetch ? { fetch: wrappedFetch } : undefined);
}
