import { ATPROTO_DID } from '$env/static/private';
import { CACHE } from '$lib/constants';
import { Cache } from '../cache';
import { createAgentForDID, createAgentWithFallback } from '../agent';
import { fetchLinkatBoard } from './fetcher';
import { generateShortLinks, findLinkByShortcode } from './generator';
import type { LinkData, ShortLink } from '../types';

/**
 * Cache instance for Linkat data
 */
const cache = new Cache<LinkData>();

/**
 * Fetches Linkat board data with caching
 *
 * @returns Linkat board data or null if fetch fails
 */
export async function fetchLinkatData(): Promise<LinkData | null> {
	const cacheKey = `${CACHE.LINKAT_PREFIX}${ATPROTO_DID}`;
	const cached = cache.get(cacheKey);

	if (cached) {
		console.log('[Linkat] Returning cached data');
		return cached;
	}

	console.log('[Linkat] Fetching from AT Protocol...');

	try {
		// Try PDS first, fallback to public API
		let agent;
		let usedPDS = false;

		try {
			agent = await createAgentForDID();
			usedPDS = true;
			console.log('[Linkat] Using PDS agent');
		} catch (error) {
			console.warn('[Linkat] PDS unavailable, using fallback');
			const result = await createAgentWithFallback();
			agent = result.agent;
			usedPDS = result.isPDS;
		}

		const data = await fetchLinkatBoard(agent, ATPROTO_DID);

		if (!data) {
			return null;
		}

		console.log(`[Linkat] Successfully fetched ${data.cards.length} links`);
		cache.set(cacheKey, data, CACHE.DEFAULT_TTL);
		return data;
	} catch (error) {
		console.error('[Linkat] Failed to fetch data:', error);
		return null;
	}
}

/**
 * Gets all short links from the Linkat board
 *
 * @returns Array of short links with generated codes
 */
export async function getShortLinks(): Promise<ShortLink[]> {
	const linkatData = await fetchLinkatData();

	if (!linkatData) {
		return [];
	}

	return generateShortLinks(linkatData);
}

/**
 * Finds a short link by its shortcode
 *
 * @param shortcode - The shortcode to find
 * @returns The matching short link or null if not found
 */
export async function findShortLink(shortcode: string): Promise<ShortLink | null> {
	const links = await getShortLinks();
	return findLinkByShortcode(links, shortcode);
}

/**
 * Clears the Linkat cache
 */
export function clearCache(): void {
	cache.clear();
}
