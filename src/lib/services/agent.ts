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
 * Creates an AT Protocol agent for the configured DID
 */
export async function createAgentForDID(): Promise<import('@atproto/api').AtpAgent> {
	return await getPublicAgent(ATPROTO_DID);
}

/**
 * Creates an AT Protocol agent with fallback to public Bluesky API
 */
export async function createAgentWithFallback(): Promise<{
	agent: import('@atproto/api').AtpAgent;
	isPDS: boolean;
}> {
	try {
		const agent = await getPublicAgent(ATPROTO_DID);
		return { agent, isPDS: true };
	} catch (error) {
		console.warn('Failed to resolve PDS, falling back to Bluesky public API:', error);
		const agent = defaultAgent;
		return { agent, isPDS: false };
	}
}

// Also export the manager functions for direct use
export { getPublicAgent, getPDSAgent };
