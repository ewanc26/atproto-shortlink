/**
 * Utilities for encoding URLs into short codes
 */

import { SHORTCODE } from '$lib/constants';

/**
 * Base70 characters used for encoding (0-9, a-z, A-Z, and special chars: +=_-?<>)
 */
const BASE_CHARS = SHORTCODE.BASE62_CHARS;
const BASE = BASE_CHARS.length;

/**
 * Generates a simple hash from a string
 * @param text - Input string to hash
 * @returns Numeric hash value
 */
function hashString(text: string): number {
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		const char = text.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash);
}

/**
 * Encodes a number to base string
 * @param num - Number to encode
 * @param length - Target length of the encoded string
 * @returns Base70 encoded string
 */
function toBase(num: number, length: number): string {
	let encoded = '';
	for (let i = 0; i < length; i++) {
		encoded = BASE_CHARS[num % BASE] + encoded;
		num = Math.floor(num / BASE);
	}
	return encoded;
}

/**
 * Encodes a URL to a short base70 string
 * Uses a deterministic hash-to-base70 encoding
 *
 * @param url - URL to encode
 * @param length - Target length of the shortcode (default: 6)
 * @returns Short base70 encoded string
 *
 * @example
 * encodeUrl('https://github.com/user') // Returns something like 'a3k9zx'
 */
export function encodeUrl(url: string, length: number = SHORTCODE.DEFAULT_LENGTH): string {
	const hash = hashString(url);
	return toBase(hash, length);
}

/**
 * Validates if a string is a valid base70 shortcode
 * @param code - String to validate
 * @returns True if the code contains only valid characters
 */
export function isValidShortcode(code: string): boolean {
	return /^[0-9a-zA-Z+=_\-?<>]+$/.test(code);
}

/**
 * Calculates the maximum number of possible shortcodes for a given length
 * @param length - Length of the shortcode
 * @returns Number of possible combinations
 *
 * @example
 * getMaxCombinations(6) // Returns 117649000000 (70^6)
 */
export function getMaxCombinations(length: number): number {
	return Math.pow(BASE, length);
}
