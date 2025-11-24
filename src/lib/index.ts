/**
 * Main library exports
 *
 * This file provides a clean public API for the application's core functionality.
 */

// Services
export { getShortLinks, findShortLink, clearCache as clearLinkatCache } from './services/linkat';
export { createAgent, getPublicAgent, getPDSAgent, resetAgents } from './services/atproto';

// Utilities
export { encodeUrl, isValidShortcode, getMaxCombinations } from './utils/encoding';

// Types
export type { LinkCard, LinkData, ShortLink } from './services/types';
export type { ResolvedIdentity } from './services/atproto';

// Cache
export { Cache } from './services/cache';

// Constants
export { CACHE, SHORTCODE, ATPROTO, HTTP } from './constants';
