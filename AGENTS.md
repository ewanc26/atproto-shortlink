# AGENTS.md

Guidance for agents working on the AT Protocol link shortener.

## Project overview

This SvelteKit service reads `blue.linkat.board` records from a configured DID/PDS and maps deterministic six-character Base62 hashes to redirects. There is deliberately no local database.

## Architecture and rules

- `src/routes/` owns HTTP pages/endpoints; server-only fetching and configuration must stay out of browser bundles.
- `src/lib/` contains Linkat/PDS resolution, hashing, validation, and shared components.
- `.env.example` and `TROUBLESHOOTING.md` are part of the operator experience; update them with configuration behavior.
- Preserve deterministic hash compatibility. Changing normalization or hashing can invalidate every published short URL and requires an explicit migration plan.
- Validate redirect targets and avoid open-redirect surprises beyond the configured Linkat board. Return deliberate status codes and cache headers.
- Treat DIDs, handles, PDS endpoints, NSIDs, and records as untrusted network input; bound fetches and handle outages without redirecting to fabricated data.
- Use npm because `package-lock.json` is authoritative.

## Validation

Run `npm run test:config`, `npm run check`, `npm run lint`, and `npm run build`. Exercise a known link, unknown hash, duplicate/collision handling, malformed board data, PDS failure, configuration failure, and the exact 301 response. Never commit `.env`, credentials, or build output.
