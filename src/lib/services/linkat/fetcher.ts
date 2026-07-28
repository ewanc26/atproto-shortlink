import type { AtpAgent } from '@atproto/api';
import { ATPROTO, LIMITS } from '$lib/constants';
import { isValidCard } from '$lib/utils/validation';
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

		const value = response.data.value as { cards?: unknown } | undefined;

		if (!value || !Array.isArray(value.cards)) {
			console.warn('[Linkat] Invalid data structure');
			return null;
		}

		// The record is remote, user-editable data: validate every card rather
		// than trusting the declared type. Cards with a non-string or unsafe
		// URL are dropped here so they can never reach the hasher or a
		// `Location` header.
		const rawCards = value.cards.slice(0, LIMITS.MAX_CARDS);
		const cards = rawCards.filter(isValidCard);

		if (cards.length !== rawCards.length) {
			console.warn(`[Linkat] Discarded ${rawCards.length - cards.length} invalid card(s)`);
		}

		return { cards };
	} catch (error) {
		console.error('[Linkat] Failed to fetch board data:', error);
		return null;
	}
}
