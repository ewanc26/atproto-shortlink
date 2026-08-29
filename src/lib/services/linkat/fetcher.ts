import { asAtIdentifierString, type Client } from '@atproto/lex';
import { com } from '@bsky/sdk/lexicons';
import { ATPROTO, LIMITS } from '$lib/constants';
import { isValidCard } from '$lib/utils/validation';
import type { LinkData } from '../types';

/**
 * Fetches Linkat board data from AT Protocol
 *
 * @param client - AT Protocol client to use for the request
 * @param did - DID of the user whose Linkat board to fetch
 * @returns Linkat board data or null if not found/invalid
 */
export async function fetchLinkatBoard(client: Client, did: string): Promise<LinkData | null> {
	try {
		const response = await client.call(com.atproto.repo.getRecord, {
			repo: asAtIdentifierString(did),
			collection: ATPROTO.LINKAT_COLLECTION,
			rkey: ATPROTO.LINKAT_RKEY
		});

		const value = response.value as { cards?: unknown } | undefined;

		if (!value || !Array.isArray(value.cards)) {
			console.warn('[Linkat] Invalid data structure');
			return null;
		}

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
