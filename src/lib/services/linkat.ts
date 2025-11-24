/**
 * Linkat Service
 *
 * This file provides backwards compatibility.
 * The actual implementation has been modularized into:
 * - fetcher.ts: Raw Linkat board fetching
 * - generator.ts: Shortcode generation and link finding
 * - index.ts: Main service with caching
 */

export { fetchLinkatData, getShortLinks, findShortLink, clearCache } from './linkat/index';
