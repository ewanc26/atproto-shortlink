import { SHORTCODE } from '$lib/constants';
import type { LinkData, ShortLink } from '../types';
import { encodeUrl } from '$lib/utils/encoding';

/**
 * Converts Linkat card data to short links with generated shortcodes
 *
 * @param linkatData - Raw Linkat board data
 * @returns Array of short links with generated codes
 */
export function generateShortLinks(linkatData: LinkData): ShortLink[] {
	if (!linkatData || !linkatData.cards.length) {
		return [];
	}

	const shortLinks: ShortLink[] = [];
	const usedShortcodes = new Set<string>();

	for (const card of linkatData.cards) {
		// Generate encoded shortcode from URL
		let shortcode = encodeUrl(card.url);

		// Ensure uniqueness (very unlikely to collide, but just in case)
		let attempt = 0;
		while (usedShortcodes.has(shortcode) && attempt < SHORTCODE.MAX_COLLISION_ATTEMPTS) {
			shortcode = encodeUrl(card.url + attempt);
			attempt++;
		}

		usedShortcodes.add(shortcode);

		shortLinks.push({
			shortcode,
			url: card.url,
			title: card.text,
			emoji: card.emoji
		});
	}

	return shortLinks;
}

/**
 * Finds a short link by its shortcode
 *
 * @param links - Array of short links to search
 * @param shortcode - The shortcode to find
 * @returns The matching short link or null if not found
 */
export function findLinkByShortcode(links: ShortLink[], shortcode: string): ShortLink | null {
	return links.find((link) => link.shortcode === shortcode) || null;
}
