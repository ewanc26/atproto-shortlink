/**
 * AT Protocol Agent Service
 *
 * This file provides backwards compatibility.
 * The actual implementation has been modularized into:
 * - agent-factory.ts: Agent creation
 * - identity-resolver.ts: DID resolution via Slingshot
 * - agent-manager.ts: Agent caching and fallback logic
 */

import { ATPROTO_DID } from '$env/static/private';
import {
	createAgent,
	resolveIdentity,
	defaultAgent,
	getPublicAgent,
	getPDSAgent,
	withFallback,
	resetAgents,
	type ResolvedIdentity
} from './atproto';

// Re-export everything for backwards compatibility
export { createAgent, resolveIdentity, defaultAgent, withFallback, resetAgents };
export type { ResolvedIdentity };

/**
 * Creates an AT Protocol client for the configured DID
 */
export async function createAgentForDID(): Promise<import('@atproto/lex').Client> {
	return await getPublicAgent(ATPROTO_DID);
}

/**
 * Creates an AT Protocol client with fallback to public Bluesky API
 */
export async function createAgentWithFallback(): Promise<{
	client: import('@atproto/lex').Client;
	isPDS: boolean;
}> {
	try {
		const client = await getPublicAgent(ATPROTO_DID);
		return { client, isPDS: true };
	} catch (error) {
		console.warn('Failed to resolve PDS, falling back to Bluesky public API:', error);
		const client = defaultAgent;
		return { client, isPDS: false };
	}
}

// Also export the manager functions for direct use
export { getPublicAgent, getPDSAgent };
