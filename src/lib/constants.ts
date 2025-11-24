/**
 * Application-wide constants and configuration
 */

/**
 * Cache configuration
 */
export const CACHE = {
	/** Default TTL for cached data (5 minutes) */
	DEFAULT_TTL: 300000,

	/** Cache key prefix for Linkat data */
	LINKAT_PREFIX: 'linkat:'
} as const;

/**
 * Shortcode configuration
 */
export const SHORTCODE = {
	/** Default length for generated shortcodes */
	DEFAULT_LENGTH: 6,

	/** Maximum collision resolution attempts */
	MAX_COLLISION_ATTEMPTS: 20,

	/** character set */
	CHARS: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
} as const;

/**
 * AT Protocol configuration
 */
export const ATPROTO = {
	/** Slingshot identity resolver endpoint */
	SLINGSHOT_ENDPOINT: 'https://slingshot.microcosm.blue',

	/** Default public Bluesky API endpoint */
	PUBLIC_API: 'https://public.api.bsky.app',

	/** Linkat collection identifier */
	LINKAT_COLLECTION: 'blue.linkat.board',

	/** Linkat record key */
	LINKAT_RKEY: 'self'
} as const;

/**
 * HTTP configuration
 */
export const HTTP = {
	/** Status code for permanent redirect */
	REDIRECT_PERMANENT: 301,

	/** Status code for not found */
	NOT_FOUND: 404,

	/** Status code for no content */
	NO_CONTENT: 204
} as const;
