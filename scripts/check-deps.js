#!/usr/bin/env node

/**
 * Direct dependency check.
 *
 * Every bare package imported directly by a script in scripts/ must be declared
 * directly in package.json (dependencies or devDependencies). This catches the
 * case where a script only resolves because an unrelated dependency happens to
 * hoist the package, which is not a reliable contract under pnpm's isolated
 * layout.
 *
 * Usage: node scripts/check-deps.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPTS_DIR = __dirname;
const MANIFEST = path.join(__dirname, '..', 'package.json');

const IMPORT_RE = /(?:^|[^\w.])(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_RE = /(?:^|[^\w.])import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function packageName(specifier) {
	if (specifier.startsWith('.') || specifier.startsWith('/')) return null;
	const parts = specifier.split('/');
	return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function collectSpecifiers(source) {
	const specifiers = [];
	for (const re of [IMPORT_RE, DYNAMIC_IMPORT_RE]) {
		re.lastIndex = 0;
		let match;
		while ((match = re.exec(source)) !== null) {
			specifiers.push(match[1]);
		}
	}
	return specifiers;
}

function main() {
	const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
	const declared = new Set([
		...Object.keys(manifest.dependencies ?? {}),
		...Object.keys(manifest.devDependencies ?? {}),
		...Object.keys(manifest.optionalDependencies ?? {}),
		...Object.keys(manifest.peerDependencies ?? {})
	]);

	const builtins = new Set();
	for (const name of builtinModules) {
		builtins.add(name);
		builtins.add(`node:${name}`);
	}

	const missing = [];
	const files = fs.readdirSync(SCRIPTS_DIR).filter((name) => /\.(m?js|ts)$/.test(name));

	for (const file of files) {
		const source = fs.readFileSync(path.join(SCRIPTS_DIR, file), 'utf-8');
		for (const specifier of collectSpecifiers(source)) {
			const name = packageName(specifier);
			if (!name || builtins.has(name)) continue;
			if (!declared.has(name)) {
				missing.push(`${file}: ${specifier} (resolves to "${name}")`);
			}
		}
	}

	if (missing.length > 0) {
		console.error('✗ Undeclared direct dependencies imported by scripts/:');
		for (const entry of missing) console.error(`  • ${entry}`);
		console.error('\nDeclare each package in package.json before importing it directly.');
		process.exit(1);
	}

	console.log(`✓ All direct script imports are declared (${files.length} script(s) checked).`);
}

main();
