/**
 * Application-wide constants and configuration
 */

// ── Cache Configuration ───────────────────────────────────

export const CACHE = {
	/** Default TTL for cached data (5 minutes) */
	DEFAULT_TTL: 300000,

	/** Cache key prefix for Linkat data */
	LINKAT_PREFIX: 'linkat:'
} as const;

// ── Shortcode Configuration ───────────────────────────────

export const SHORTCODE = {
	/** Default length for generated shortcodes */
	DEFAULT_LENGTH: 10,

	/** Maximum collision resolution attempts */
	MAX_COLLISION_ATTEMPTS: 20,

	/** character set */
	CHARS: 'abcABCdefDEFghiHIJjklLMNmnOPQopqRSTrstUVWuvwXYZxyz0123456789'
} as const;

// ── Input Limits ──────────────────────────────────────────

export const LIMITS = {
	/** Maximum accepted length of a redirect target URL */
	MAX_URL_LENGTH: 2048,

	/** Maximum accepted length of a card title */
	MAX_TITLE_LENGTH: 300,

	/** Maximum accepted length of a card emoji */
	MAX_EMOJI_LENGTH: 32,

	/** Maximum accepted length of a shortcode in the request path */
	MAX_SHORTCODE_LENGTH: 64,

	/** Maximum accepted size of a Linkat board, in cards */
	MAX_CARDS: 500
} as const;

// ── AT Protocol Configuration ─────────────────────────────

export const ATPROTO = {
	/** Slingshot identity resolver endpoint */
	SLINGSHOT_ENDPOINT: 'https://slingshot.microcosm.blue',

	/** Default public Bluesky API endpoint */
	PUBLIC_API: 'https://public.api.bsky.app',

	/** Linkat collection identifier */
	LINKAT_COLLECTION: 'blue.linkat.board',

	/** Linkat record key */
	LINKAT_RKEY: 'self',

	/** Timeout for identity/profile lookups, in milliseconds */
	REQUEST_TIMEOUT_MS: 8000
} as const;

// ── HTTP Status Configuration ─────────────────────────────

export const HTTP = {
	/** Status code for permanent redirect */
	REDIRECT_PERMANENT: 301,

	/** Status code for not found */
	NOT_FOUND: 404,

	/** Status code for no content */
	NO_CONTENT: 204,

	/** Status code for an unusable upstream response */
	BAD_GATEWAY: 502
} as const;
