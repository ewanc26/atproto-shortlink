import { ATPROTO } from '$lib/constants';
import type { AtpAgent } from '@atproto/api';
import { createAgent } from './agent-factory';
import { resolveIdentity } from './identity-resolver';

/**
 * Default fallback agent for public Bluesky API calls
 */
export const defaultAgent = createAgent(ATPROTO.PUBLIC_API);

/**
 * Cached agents
 */
let resolvedAgent: AtpAgent | null = null;
let pdsAgent: AtpAgent | null = null;

/**
 * Gets or creates an agent using Slingshot resolution with fallback
 *
 * @param did - The DID to resolve
 * @param fetchFn - Optional custom fetch function
 * @returns Configured AtpAgent
 */
export async function getPublicAgent(did: string, fetchFn?: typeof fetch): Promise<AtpAgent> {
	console.info(`[Agent] Getting public agent for DID: ${did}`);

	if (resolvedAgent) {
		console.debug('[Agent] Using cached agent');
		return resolvedAgent;
	}

	try {
		// Use Slingshot for PDS resolution
		console.info('[Agent] Attempting Slingshot resolution');
		const resolved = await resolveIdentity(did, fetchFn);
		console.info(`[Agent] Resolved PDS endpoint: ${resolved.pds}`);
		resolvedAgent = createAgent(resolved.pds, fetchFn);
		return resolvedAgent;
	} catch (err) {
		console.error('[Agent] Slingshot resolution failed, falling back to Bluesky:', err);
		resolvedAgent = defaultAgent;
		return resolvedAgent;
	}
}

/**
 * Gets or creates a PDS-specific agent
 *
 * @param did - The DID to resolve
 * @param fetchFn - Optional custom fetch function
 * @returns Configured AtpAgent for the PDS
 * @throws Error if resolution fails
 */
export async function getPDSAgent(did: string, fetchFn?: typeof fetch): Promise<AtpAgent> {
	if (pdsAgent) return pdsAgent;

	try {
		const resolved = await resolveIdentity(did, fetchFn);
		pdsAgent = createAgent(resolved.pds, fetchFn);
		return pdsAgent;
	} catch (err) {
		console.error('Failed to resolve PDS for DID:', err);
		throw err;
	}
}

/**
 * Executes a function with automatic fallback between agents
 *
 * @param did - The DID to resolve
 * @param operation - The operation to execute with the agent
 * @param usePDSFirst - If true, tries PDS first before public API
 * @param fetchFn - Optional custom fetch function
 * @returns Result of the operation
 * @throws Error if all attempts fail
 */
export async function withFallback<T>(
	did: string,
	operation: (agent: AtpAgent) => Promise<T>,
	usePDSFirst = false,
	fetchFn?: typeof fetch
): Promise<T> {
	const defaultAgentFn = () =>
		fetchFn ? createAgent(ATPROTO.PUBLIC_API, fetchFn) : Promise.resolve(defaultAgent);

	const agents = usePDSFirst
		? [() => getPDSAgent(did, fetchFn), defaultAgentFn]
		: [defaultAgentFn, () => getPDSAgent(did, fetchFn)];

	let lastError: any;

	for (const getAgent of agents) {
		try {
			const agent = await getAgent();
			return await operation(agent);
		} catch (error) {
			console.warn('Operation failed, trying next agent:', error);
			lastError = error;
		}
	}

	throw lastError;
}

/**
 * Resets cached agents (useful for testing or when identity changes)
 */
export function resetAgents(): void {
	resolvedAgent = null;
	pdsAgent = null;
}
