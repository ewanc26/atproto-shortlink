#!/usr/bin/env node

/**
 * Test script to verify AT Protocol Link Shortener configuration
 * Run with: node scripts/test-config.js
 */

import { AtpAgent } from '@atproto/api';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
	log(`${message}`, 'green');
}

function error(message) {
	log(`✗ ${message}`, 'red');
}

function info(message) {
	log(`ℹ ${message}`, 'blue');
}

function warning(message) {
	log(`⚠ ${message}`, 'yellow');
}

async function resolvePDS(did) {
	const split = did.split(':');

	if (split[0] !== 'did') {
		throw new Error(`Invalid DID format: ${did}`);
	}

	if (split[1] === 'plc') {
		const response = await fetch(`https://plc.directory/${did}`);
		if (!response.ok) {
			throw new Error(`Failed to resolve DID: ${response.statusText}`);
		}

		const diddoc = await response.json();
		const services = diddoc.service || [];

		for (const service of services) {
			if (service.id === '#atproto_pds') {
				return service.serviceEndpoint;
			}
		}

		throw new Error(`No PDS endpoint found for DID: ${did}`);
	} else if (split[1] === 'web') {
		return `https://${split[2]}`;
	}

	throw new Error(`Unsupported DID method: ${split[1]}`);
}

async function testConfiguration() {
	log('\n🔧 AT Protocol Link Shortener - Configuration Test\n', 'cyan');

	// Check for .env file
	const envPath = path.join(__dirname, '..', '.env');
	if (!fs.existsSync(envPath)) {
		error('.env file not found');
		warning('Please create a .env file by copying .env.example:');
		info('  cp .env.example .env');
		info('  # Then edit .env and add your ATPROTO_DID');
		process.exit(1);
	}
	success('.env file exists');

	// Read .env file
	const envContent = fs.readFileSync(envPath, 'utf-8');
	const didMatch = envContent.match(/ATPROTO_DID=(.+)/);

	if (!didMatch || !didMatch[1] || didMatch[1].trim() === '') {
		error('ATPROTO_DID not configured in .env');
		warning('Please add your AT Protocol DID to .env:');
		info('  ATPROTO_DID=did:plc:your-did-here');
		info('\nFind your DID at: https://pdsls.dev/');
		process.exit(1);
	}

	const did = didMatch[1].trim();
	success(`ATPROTO_DID configured: ${did}`);

	// Validate DID format
	if (!did.startsWith('did:plc:') && !did.startsWith('did:web:')) {
		error('Invalid DID format');
		warning('DID should start with "did:plc:" or "did:web:"');
		process.exit(1);
	}
	success('DID format is valid');

	// Test PDS resolution
	info('\nResolving PDS endpoint...');
	try {
		const pdsUrl = await resolvePDS(did);
		success(`PDS endpoint: ${pdsUrl}`);

		// Test connection to PDS
		info('\nTesting connection to PDS...');
		const agent = new AtpAgent({ service: pdsUrl });

		// Try to fetch profile as a connectivity test
		try {
			const profile = await agent.getProfile({ actor: did });
			success(`Connected to PDS successfully`);
			success(`Profile: @${profile.data.handle}`);
		} catch (err) {
			warning('Could not fetch profile from PDS, trying Bluesky API...');

			// Fallback to Bluesky API
			const bskyAgent = new AtpAgent({ service: 'https://public.api.bsky.app' });
			try {
				const profile = await bskyAgent.getProfile({ actor: did });
				success(`Connected via Bluesky API`);
				success(`Profile: @${profile.data.handle}`);
			} catch (fallbackErr) {
				error('Failed to connect to both PDS and Bluesky API');
				throw fallbackErr;
			}
		}

		// Test Linkat data fetch
		info('\nChecking for Linkat board...');
		try {
			const response = await agent.com.atproto.repo.getRecord({
				repo: did,
				collection: 'blue.linkat.board',
				rkey: 'self'
			});

			if (response.data.value && Array.isArray(response.data.value.cards)) {
				const cardCount = response.data.value.cards.length;
				success(`Found Linkat board with ${cardCount} links`);

				if (cardCount > 0) {
					info('\nFirst few links:');
					response.data.value.cards.slice(0, 3).forEach((card) => {
						const shortcode = card.text.split(/\s+/)[0].toLowerCase();
						log(`  • ${card.emoji || '🔗'} /${shortcode} → ${card.url}`, 'cyan');
					});
				} else {
					warning('Linkat board is empty - add some links at https://linkat.blue');
				}
			} else {
				warning('Linkat board exists but has invalid structure');
			}
		} catch (err) {
			if (err.error === 'RecordNotFound') {
				warning('No Linkat board found');
				info('Create one at: https://linkat.blue');
			} else {
				throw err;
			}
		}

		log('\n✨ Configuration test completed successfully!\n', 'green');
		info('You can now run the server with: npm run dev');
		info('Visit: http://localhost:5173\n');
	} catch (err) {
		error(`\nConfiguration test failed: ${err.message}`);
		process.exit(1);
	}
}

testConfiguration().catch((err) => {
	error(`\nUnexpected error: ${err.message}`);
	console.error(err);
	process.exit(1);
});
