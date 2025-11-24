/**
 * AT Protocol service modules
 *
 * This module provides a clean interface for working with AT Protocol agents,
 * identity resolution, and PDS discovery.
 */

export { createAgent } from './agent-factory';
export { resolveIdentity, type ResolvedIdentity } from './identity-resolver';
export {
	defaultAgent,
	getPublicAgent,
	getPDSAgent,
	withFallback,
	resetAgents
} from './agent-manager';
