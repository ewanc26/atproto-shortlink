import { ATPROTO } from '$lib/constants';

/**
 * Resolved identity from Slingshot
 */
export interface ResolvedIdentity {
	did: string;
	pds: string;
	handle?: string;
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

	return {
		did: data.did,
		pds: data.pds,
		handle: data.handle
	};
}

/**
 * Resolves a DID to get the user's handle
 *
 * @param did - The DID to resolve
 * @param fetchFn - Optional custom fetch function
 * @returns The user's handle
 * @throws Error if resolution fails
 */
export async function resolveHandle(
	did: string,
	fetchFn?: typeof fetch
): Promise<string> {
	console.info(`[Identity] Resolving handle for DID: ${did}`);

	const identity = await resolveIdentity(did, fetchFn);

	if (identity.handle) {
		console.info(`[Identity] Found handle from Slingshot: ${identity.handle}`);
		return identity.handle;
	}

	// Fallback: fetch profile from public API if handle not in identity response
	console.info('[Identity] Handle not in Slingshot response, fetching from public API');
	const _fetch = fetchFn ?? globalThis.fetch;
	const response = await _fetch(
		`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`
	);

	if (!response.ok) {
		console.error(`[Identity] Profile fetch failed: ${response.status} ${response.statusText}`);
		throw new Error(
			`Failed to fetch profile from Bluesky API: ${response.status} ${response.statusText}`
		);
	}

	const profile = await response.json();

	if (!profile.handle) {
		throw new Error('No handle found in profile response');
	}

	console.info(`[Identity] Resolved handle from API: ${profile.handle}`);
	return profile.handle;
}
