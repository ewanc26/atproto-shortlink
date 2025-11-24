import { ATPROTO } from '$lib/constants';

/**
 * Resolved identity from Slingshot
 */
export interface ResolvedIdentity {
	did: string;
	pds: string;
}

/**
 * Resolves a DID to find its PDS endpoint using Slingshot
 *
 * @param did - The DID to resolve
 * @param fetchFn - Optional custom fetch function
 * @returns Resolved identity with DID and PDS endpoint
 * @throws Error if resolution fails
 */
export async function resolveIdentity(
	did: string,
	fetchFn?: typeof fetch
): Promise<ResolvedIdentity> {
	console.info(`[Identity] Resolving DID: ${did}`);

	// Prefer an injected fetch (from SvelteKit load), fall back to global fetch
	const _fetch = fetchFn ?? globalThis.fetch;

	const url = `${ATPROTO.SLINGSHOT_ENDPOINT}/xrpc/com.bad-example.identity.resolveMiniDoc?identifier=${encodeURIComponent(did)}`;

	const response = await _fetch(url);

	if (!response.ok) {
		console.error(`[Identity] Resolution failed: ${response.status} ${response.statusText}`);
		throw new Error(
			`Failed to resolve identifier via Slingshot: ${response.status} ${response.statusText}`
		);
	}

	const rawText = await response.text();
	console.debug(`[Identity] Raw response:`, rawText);

	let data: any;
	try {
		data = JSON.parse(rawText);
	} catch (err) {
		console.error('[Identity] Failed to parse identity resolver response as JSON', err);
		throw err;
	}

	if (!data.did || !data.pds) {
		throw new Error('Invalid response from identity resolver');
	}

	return data;
}
