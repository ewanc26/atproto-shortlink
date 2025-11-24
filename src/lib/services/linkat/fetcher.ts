import type { AtpAgent } from '@atproto/api';
import { ATPROTO } from '$lib/constants';
import type { LinkData } from '../types';

/**
 * Fetches Linkat board data from AT Protocol
 *
 * @param agent - AT Protocol agent to use for the request
 * @param did - DID of the user whose Linkat board to fetch
 * @returns Linkat board data or null if not found/invalid
 */
export async function fetchLinkatBoard(agent: AtpAgent, did: string): Promise<LinkData | null> {
	try {
		const response = await agent.com.atproto.repo.getRecord({
			repo: did,
			collection: ATPROTO.LINKAT_COLLECTION,
			rkey: ATPROTO.LINKAT_RKEY
		});

		const value = response.data.value;

		if (!value || !Array.isArray((value as any).cards)) {
			console.warn('[Linkat] Invalid data structure');
			return null;
		}

		return {
			cards: (value as any).cards
		};
	} catch (error) {
		console.error('[Linkat] Failed to fetch board data:', error);
		return null;
	}
}
