# Contributing to atproto-shortlink

A server-side link shortener powered by your Linkat board: no database — links are fetched on demand from AT Protocol and URLs get a deterministic 10-character, mixed-case hash. Thanks for wanting to help!

Independent project; see the [trademark notice](TRADEMARKS.md).

## Getting started

```bash
git clone https://github.com/ewanc26/atproto-shortlink.git
cd atproto-shortlink
pnpm install
cp .env.example .env   # add your AT Protocol DID
pnpm run test:config    # checks .env, DID, PDS reachability, Linkat board access
pnpm run dev
```

Other useful scripts: `pnpm run check:deps` (verifies every import in `scripts/` is declared in `package.json`), and `pnpm run check` / `format` / `lint` for development.

## Notes for this project

- **Shortcodes are content-addressed**: the hash is deterministic from the URL. Never make it depend on creation order or the slate of links, or every existing short link breaks.
- The service must keep working signed out and stateless; resist adding a database or write path — writes belong in Linkat, on the AT Protocol repo.
- A 301 (permanent redirect) is contract: don't change status codes casually.
- `check:deps` exists because scripts must not silently rely on hoisted transitive dependencies; keep new imports declared.

## Before opening a PR

- `pnpm run check`, `lint`, `test:config`, and `build` pass.
- Conventional commits; focused PRs; say how you verified (e.g. dev server responding with the right 301s for a test board).
- AI-assisted PRs welcome; stand behind every line and run the checks yourself.

## Licence

See [LICENCE](LICENCE)/[LICENSE](LICENSE). Contributions accepted under the same terms.