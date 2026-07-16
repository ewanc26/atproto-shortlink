# AGENTS.md

Guidance for agents working on the SvelteKit AT Protocol/Linkat redirect service.

## Executed architecture

- `ATPROTO_DID` is a build/server-private SvelteKit environment variable. `src/routes/+page.server.ts`, `api/links/+server.ts`, and `[shortcode]/+server.ts` all read through the server-side Linkat service.
- `services/atproto/` resolves the configured DID through Slingshot, caches an `AtpAgent`, and nominally falls back to `public.api.bsky.app`. Compatibility wrappers remain in `services/agent.ts` and `services/linkat.ts`.
- `services/linkat/fetcher.ts` reads exactly `blue.linkat.board/self`; `generator.ts` maps every returned card to a shortcode; `index.ts` caches successful board data in-process for five minutes.
- `utils/encoding.ts` normalizes a URL for hashing, uses an unbounded-BigInt FNV-1a-like hash over JavaScript UTF-16 code units, and emits a domain-prefixed Base62-like code. The default is currently **10 characters**, not the README's six.
- `scripts/test-config.js` is a live manual probe that parses `.env`, resolves the DID without Slingshot, reads profiles/board data, and prints title-first-word “shortcodes” that do not match the production hash algorithm.

## Compatibility and security constraints

- Published shortcodes depend on URL normalization, character alphabet/order, hash arithmetic, default length, card order, and collision handling. Changing any of these can break existing permanent links; provide fixtures and a migration/legacy lookup path first.
- Redirects are HTTP 301 and therefore aggressively cached. The target is the original `card.url`, not the normalized hashed URL. A changed board target normally receives a different code, while an old 301 may remain cached externally.
- Board validation currently checks only that `cards` is an array. It does not validate each card's object shape, URL scheme, size, title, or emoji. Before redirecting, accept only intentional `http:`/`https:` targets with bounded lengths; never pass `javascript:`, `data:`, control characters, or malformed values into `redirect`.
- Collision retries append attempt numbers to the hash input, making assignments order-dependent. After 20 retries the code still adds the duplicate shortcode and `find` returns the first match. Never claim collision safety without explicit failure or deterministic disambiguation tests.
- `getPublicAgent` catches Slingshot failure internally and returns the public agent. Consequently `createAgentForDID` normally cannot signal that fallback, `createAgentWithFallback` can report `isPDS: true` for the public agent, and a board-read failure is swallowed as `null` rather than retried against the other service.
- Identity/record fetches have no explicit timeout, response-size bound, or stale-cache fallback. An upstream failure appears as an empty link set in several paths; distinguish “empty board” from “unavailable” before operational use.
- Agent and Linkat caches are module-global/in-memory. They are per process/isolate, not shared across serverless instances, and cached agents are not keyed by DID or injected fetch implementation.
- Keep private environment imports out of client components. DIDs and redirect URLs are public by design here, but never add credentials, tokens, or raw upstream error bodies.

## Documentation drift

`README.md`, `ARCHITECTURE.md`, and `TROUBLESHOOTING.md` still describe six-character hashes, title-first-word codes, lowercase-only codes, PDS-first fallback, and broad adapter-auto deployment support. Current codes are mixed-case 10-character URL hashes. `adapter-auto` does not make every named host—including static-only targets—compatible with server routes. Correct docs alongside behaviour changes.

## Validation

Use npm and the tracked `package-lock.json`; do not switch package managers because unrelated pnpm files happen to exist locally. After `npm ci`, run `npm run test:config` only when a live public board probe is explicitly wanted, then `npm run check`, `npm run lint`, and `npm run build`. There is no automated unit/E2E suite today. Add fixed shortcode vectors (Unicode, fragments, query ordering, subdomains), collision/exhaustion tests, invalid-card/scheme tests, upstream timeout/fallback tests, and route assertions for 301/404/API failure. A missing local dependency currently makes `npm run check` fail with `svelte-kit: command not found`; install from the lockfile before interpreting it as a source failure.
