/**
 * Input validation and output-escaping helpers.
 *
 * Everything this service redirects to originates in a remote AT Protocol
 * record, and every shortcode originates in a user-controlled URL path.
 * Neither is trusted: targets must be explicit `http:`/`https:` URLs of
 * bounded length, and shortcodes must be escaped before they are ever
 * interpolated into an HTML response.
 */

import { LIMITS } from '$lib/constants';
import type { LinkCard } from '$lib/services/types';

/** Control characters (including CR/LF, which enable header injection). */
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

/** Schemes we are willing to place in a `Location` header. */
const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

/**
 * Normalises a card URL into a target that is safe to redirect to.
 *
 * Accepts absolute `http:`/`https:` URLs, and scheme-less values such as
 * `example.com/page` which are upgraded to `https://`. Anything else —
 * `javascript:`, `data:`, `vbscript:`, `file:`, values containing control
 * characters, or values over {@link LIMITS.MAX_URL_LENGTH} — is rejected.
 *
 * @param url - Raw URL from a Linkat card
 * @returns The absolute, safe URL, or `null` if it must not be used
 */
export function toSafeRedirectUrl(url: unknown): string | null {
	if (typeof url !== 'string') return null;

	const trimmed = url.trim();
	if (!trimmed || trimmed.length > LIMITS.MAX_URL_LENGTH) return null;

	// CR/LF or NUL in a redirect target would allow response-header injection.
	if (CONTROL_CHARS.test(trimmed)) return null;

	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		// No scheme (or an unparseable one): retry as https, matching the
		// assumption the shortcode hasher already makes for bare domains.
		try {
			parsed = new URL(`https://${trimmed}`);
		} catch {
			return null;
		}
	}

	if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;
	if (!parsed.hostname) return null;

	const href = parsed.toString();
	if (href.length > LIMITS.MAX_URL_LENGTH) return null;

	return href;
}

/**
 * Validates the shape of a single Linkat card.
 *
 * The upstream record is only schema-checked to the extent that `cards` is
 * an array, so each entry is verified here before it reaches the hasher.
 *
 * @param card - Candidate card from the board record
 * @returns True if the card has a usable text/url pair
 */
export function isValidCard(card: unknown): card is LinkCard {
	if (!card || typeof card !== 'object') return false;

	const { text, url, emoji } = card as Record<string, unknown>;

	if (typeof url !== 'string' || toSafeRedirectUrl(url) === null) return false;
	if (text !== undefined && typeof text !== 'string') return false;
	if (emoji !== undefined && typeof emoji !== 'string') return false;
	if (typeof text === 'string' && text.length > LIMITS.MAX_TITLE_LENGTH) return false;
	if (typeof emoji === 'string' && emoji.length > LIMITS.MAX_EMOJI_LENGTH) return false;

	return true;
}

/**
 * Escapes a string for safe interpolation into HTML text or attribute content.
 *
 * @param value - Untrusted string
 * @returns The string with HTML-significant characters replaced by entities
 */
export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
