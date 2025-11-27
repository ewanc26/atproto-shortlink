import { SHORTCODE } from '$lib/constants';  // Import constants for shortcode configuration
import { parse, getDomain } from 'tldts';  // Import utility functions for domain parsing

// Constants related to the character set for encoding
const BASE_CHARS = SHORTCODE.CHARS;  // Charset for the shortcode encoding
const BASE = BASE_CHARS.length;     // Base (the number of unique characters in the charset)

// Hashes a given string into a bigint value
function hashString(text: string): bigint {
	let hash = 1469598103934665603n;  // FNV-1a hash initialisation value
	for (let i = 0; i < text.length; i++) {
		const char = BigInt(text.charCodeAt(i));  // Convert each character to a bigint
		hash = (hash ^ char) * 1099511628211n;   // FNV-1a hashing algorithm
	}
	return hash < 0n ? -hash : hash;  // Ensure the hash is positive
}

// Converts a number (bigint) into a base encoded string with a given length
function toBase(num: bigint, length: number, seed = ''): string {
	let encoded = '';  // The resulting encoded string
	let n = num;
	for (let i = 0; i < length; i++) {
		let rem: bigint;
		// Calculate remainder and divide to get the next digit
		if (n > 0n) {
			rem = n % BigInt(BASE);
			n = n / BigInt(BASE);
		} else {
			// Fallback if number is 0, use a hash for deterministic behaviour
			const fallback = hashString(num.toString() + '::' + seed + '::' + i.toString());
			rem = fallback % BigInt(BASE);
		}
		encoded = BASE_CHARS[Number(rem)] + encoded;  // Prepend the character for this base value
	}
	return encoded;
}

// Normalises a URL by ensuring it's well-formed and canonical
function normaliseUrl(url: string): string {
	try {
		// Ensure the URL starts with 'https://' and parse it
		const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
		parsed.hash = '';  // Remove hash fragment

		// Sort URL query parameters alphabetically
		const sortedParams = [...parsed.searchParams.entries()].sort((a, b) =>
			a[0].localeCompare(b[0])
		);
		parsed.search = '';  // Clear existing search parameters
		for (const [key, value] of sortedParams) parsed.searchParams.append(key, value);  // Rebuild query string

		parsed.hostname = parsed.hostname.toLowerCase();  // Convert hostname to lowercase
		parsed.protocol = 'https:';  // Ensure HTTPS protocol is used
		return parsed.toString();  // Return the normalised URL as a string
	} catch (e) {
		// If URL parsing fails, return the original URL (trimmed)
		return url.trim();
	}
}

// Extracts the base domain from a URL
function getBaseDomain(url: string): string {
	try {
		// Use tldts library to get the domain from the URL
		const domain = getDomain(url, { allowPrivateDomains: false });
		if (domain) return domain.toLowerCase();

		// Fallback to manual parsing if tldts fails
		const parsed = parse(url, { extractHostname: true });
		return (parsed.hostname ?? '').toLowerCase();
	} catch (e) {
		// Return an empty string if domain extraction fails
		return '';
	}
}

// Main function to encode a URL into a shortcode of specified length
export function encodeUrl(url: string, length: number = SHORTCODE.DEFAULT_LENGTH): string {
	// Validate and adjust the length of the shortcode
	if (!Number.isInteger(length) || length < 3) length = SHORTCODE.DEFAULT_LENGTH;

	const DOMAIN_PREFIX_LENGTH = 2;  // Number of characters used for the domain prefix

	// Normalise the URL and extract the base domain
	const normalised = normaliseUrl(url);
	const apex = getBaseDomain(normalised) || '';

	// Hash the domain to generate a prefix
	const domainHash = hashString(apex || normalised);
	const domainPrefix = toBase(domainHash, DOMAIN_PREFIX_LENGTH, 'domain');

	// Calculate the remaining length for the URL core and tail
	const remaining = Math.max(1, length - DOMAIN_PREFIX_LENGTH);

	let hostname = '';  // The hostname portion of the URL
	try {
		hostname = new URL(normalised).hostname.toLowerCase();  // Try to extract hostname from normalised URL
	} catch (e) {
		// Fallback if URL parsing fails
		try {
			hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
		} catch {
			hostname = '';  // If both parsing attempts fail, leave hostname empty
		}
	}

	let subLevels: string[] = [];
	// If there is a subdomain, split it into separate levels
	if (apex && hostname && hostname !== apex) {
		const sub = hostname.replace(new RegExp(`\.${apex}$`), '');  // Remove the apex domain
		subLevels = sub.split('.');  // Split subdomains by '.'
	}

	// URL core length is determined based on the remaining space after the domain prefix
	const MIN_URL_CORE = 1;
	const MIN_TAIL = 1;
	const tailLength = remaining;  // Length allocated to the tail portion of the shortcode

	// Hash the normalised URL for the URL core portion of the shortcode
	const urlHash = hashString(normalised + '::url');
	const urlCoreLength = remaining - subLevels.length;  // Account for subdomain levels
	const urlCore = toBase(urlHash, Math.max(MIN_URL_CORE, urlCoreLength), 'url');

	// Generate subdomain-based tail (if applicable)
	const subTail: string[] = [];
	const reversedSubLevels = subLevels.slice().reverse();  // Reverse the subdomain levels for encoding
	for (let i = 0; i < reversedSubLevels.length; i++) {
		const h = hashString(reversedSubLevels[i] + '::sub');  // Hash the subdomain level
		subTail.push(toBase(h, 1, 'sub' + i));  // Add to subTail
	}

	// If no subdomain tail is generated, use a fallback hash for the tail
	let tail = subTail.join('');
	if (!tail) {
		const fallbackHash = hashString(normalised + '::fallback');
		tail = toBase(fallbackHash, tailLength, 'sub');
	}

	// Combine domain prefix, URL core, and tail to form the final shortcode
	let out = domainPrefix + urlCore + tail;
	if (out.length > length) out = out.slice(0, length);  // Trim to the desired length
	if (out.length < length) {
		// Pad the shortcode if it is too short
		let pad = '';
		let i = 0;
		while (out.length + pad.length < length) {
			const h = hashString(normalised + '::pad2::' + i);
			pad += toBase(h, Math.min(4, length - out.length - pad.length), 'pad2' + i);
			i++;
		}
		out += pad.slice(0, length - out.length);  // Append padding to reach the correct length
	}

	// --- LOGGING MAX COMBINATIONS --- (for debugging purposes)
	const maxCombinations = BigInt(BASE) ** BigInt(length);  // Calculate the max possible combinations for the shortcode
	console.log(`[Shortcode Info] URL: ${url}`);
	console.log(`[Shortcode Info] Length: ${length}, Charset: ${BASE} chars`);
	console.log(`[Shortcode Info] Max possible combinations: ${maxCombinations.toString()}`);
	console.log(
		`[Shortcode Info] Domain prefix: ${domainPrefix}, URL core: ${urlCore}, Subdomain tail: ${tail}`
	);

	return out;  // Return the final encoded shortcode
}

// Function to validate if a given shortcode is valid (contains only alphanumeric characters)
export function isValidShortcode(code: string): boolean {
	return /^[0-9a-zA-Z]+$/.test(code);
}

// Function to calculate the maximum number of possible combinations for a shortcode of a given length
export function getMaxCombinations(length: number): number {
	return Math.pow(BASE, length);  // BASE raised to the power of length
}
