/**
 * URL-to-shortcode encoding using FNV-1a hashing and base-N encoding.
 *
 * Shortcodes are structured as a 2-char domain prefix + URL content hash +
 * subdomain tail, producing collision-resistant identifiers without
 * requiring a database to track the next available slot.
 */

import { SHORTCODE } from '$lib/constants';
import { parse, getDomain } from 'tldts';

const BASE_CHARS = SHORTCODE.CHARS;
const BASE = BASE_CHARS.length;

// ── FNV-1a Hashing ───────────────────────────────────────

function hashString(text: string): bigint {
	let hash = 1469598103934665603n;
	for (let i = 0; i < text.length; i++) {
		hash = (hash ^ BigInt(text.charCodeAt(i))) * 1099511628211n;
	}
	return hash < 0n ? -hash : hash;
}

// ── Base-N Encoding ───────────────────────────────────────

function toBase(num: bigint, length: number, seed = ''): string {
	let encoded = '';
	let n = num;
	for (let i = 0; i < length; i++) {
		let rem: bigint;
		if (n > 0n) {
			rem = n % BigInt(BASE);
			n = n / BigInt(BASE);
		} else {
			// Fallback for zero — hash the position to stay deterministic
			const fallback = hashString(num.toString() + '::' + seed + '::' + i.toString());
			rem = fallback % BigInt(BASE);
		}
		encoded = BASE_CHARS[Number(rem)] + encoded;
	}
	return encoded;
}

// ── URL Normalisation ─────────────────────────────────────

function normaliseUrl(url: string): string {
	try {
		const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
		parsed.hash = '';
		// Sort query params for deterministic ordering
		const sortedParams = [...parsed.searchParams.entries()].sort((a, b) =>
			a[0].localeCompare(b[0])
		);
		parsed.search = '';
		for (const [key, value] of sortedParams) parsed.searchParams.append(key, value);
		parsed.hostname = parsed.hostname.toLowerCase();
		parsed.protocol = 'https:';
		return parsed.toString();
	} catch (e) {
		return url.trim();
	}
}

function getBaseDomain(url: string): string {
	try {
		const domain = getDomain(url, { allowPrivateDomains: false });
		if (domain) return domain.toLowerCase();
		const parsed = parse(url, { extractHostname: true });
		return (parsed.hostname ?? '').toLowerCase();
	} catch (e) {
		return '';
	}
}

// ── URL Encoding ──────────────────────────────────────────

export function encodeUrl(url: string, length: number = SHORTCODE.DEFAULT_LENGTH): string {
	if (!Number.isInteger(length) || length < 3) length = SHORTCODE.DEFAULT_LENGTH;

	const DOMAIN_PREFIX_LENGTH = 2;

	const normalised = normaliseUrl(url);
	const apex = getBaseDomain(normalised) || '';

	// Domain prefix — visual hint of the destination domain
	const domainHash = hashString(apex || normalised);
	const domainPrefix = toBase(domainHash, DOMAIN_PREFIX_LENGTH, 'domain');

	const remaining = Math.max(1, length - DOMAIN_PREFIX_LENGTH);

	let hostname = '';
	try {
		hostname = new URL(normalised).hostname.toLowerCase();
	} catch (e) {
		try {
			hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
		} catch {
			hostname = '';
		}
	}

	let subLevels: string[] = [];
	if (apex && hostname && hostname !== apex) {
		const sub = hostname.replace(new RegExp(`\.${apex}$`), '');
		subLevels = sub.split('.');
	}

	const MIN_URL_CORE = 1;
	const MIN_TAIL = 1;
	const tailLength = remaining;

	const urlHash = hashString(normalised + '::url');
	const urlCoreLength = remaining - subLevels.length;
	const urlCore = toBase(urlHash, Math.max(MIN_URL_CORE, urlCoreLength), 'url');

	// Subdomain tail — one character per subdomain level
	const subTail: string[] = [];
	const reversedSubLevels = subLevels.slice().reverse();
	for (let i = 0; i < reversedSubLevels.length; i++) {
		const h = hashString(reversedSubLevels[i] + '::sub');
		subTail.push(toBase(h, 1, 'sub' + i));
	}

	let tail = subTail.join('');
	if (!tail) {
		const fallbackHash = hashString(normalised + '::fallback');
		tail = toBase(fallbackHash, tailLength, 'sub');
	}

	let out = domainPrefix + urlCore + tail;
	if (out.length > length) out = out.slice(0, length);
	if (out.length < length) {
		let pad = '';
		let i = 0;
		while (out.length + pad.length < length) {
			const h = hashString(normalised + '::pad2::' + i);
			pad += toBase(h, Math.min(4, length - out.length - pad.length), 'pad2' + i);
			i++;
		}
		out += pad.slice(0, length - out.length);
	}

	// Log collision space for debugging
	const maxCombinations = BigInt(BASE) ** BigInt(length);
	console.log(`[Shortcode Info] URL: ${url}`);
	console.log(`[Shortcode Info] Length: ${length}, Charset: ${BASE} chars`);
	console.log(`[Shortcode Info] Max possible combinations: ${maxCombinations.toString()}`);
	console.log(
		`[Shortcode Info] Domain prefix: ${domainPrefix}, URL core: ${urlCore}, Subdomain tail: ${tail}`
	);

	return out;
}

// ── Validation & Metadata ────────────────────────────────

export function isValidShortcode(code: string): boolean {
	return /^[0-9a-zA-Z]+$/.test(code);
}

export function getMaxCombinations(length: number): number {
	return Math.pow(BASE, length);
}
