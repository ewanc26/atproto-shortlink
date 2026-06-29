# AT Protocol Link Shortener

Server-side link shortener powered by your Linkat board. No database — links are fetched from AT Protocol.

> Also available on [Tangled](https://tangled.org/ewancroft.uk/atproto-shortlink)

## How it works

1. You maintain links in [Linkat](https://linkat.blue) (stored in `blue.linkat.board` collection)
2. Service fetches them on-demand from your PDS via Slingshot
3. URLs get a deterministic 6-char base62 hash (e.g., `/a3k9zx`)
4. Visiting that short link returns a 301 redirect

## Quick start

```bash
git clone git@github.com:ewanc26/atproto-shortlink
cd atproto-shortlink
npm install
```

Copy `.env.example` to `.env` and add your AT Protocol DID:

```ini
ATPROTO_DID=did:plc:your-did-here
```

Find your DID at [pdsls.dev](https://pdsls.dev/).

If you don't have a Linkat board yet, create one at [linkat.blue](https://linkat.blue).

### Test config

```bash
npm run test:config
```

Checks that `.env` exists, DID is valid, PDS is reachable, and your Linkat board is accessible.

### Run

```bash
npm run dev
```

## Endpoints

| Endpoint | Method | What it does |
|---|---|---|
| `/` | GET | Service info and link listing |
| `/:shortcode` | GET | 301 redirect to full URL |
| `/api/links` | GET | All short links as JSON |

## Deploy

```bash
npm run build
npm run preview
```

Uses `@sveltejs/adapter-auto` — works with Vercel, Netlify, Cloudflare Pages, or Node.

Set `ATPROTO_DID` in your deployment platform's env vars.

### Config ref

| Variable | Required | What it is |
|---|---|---|
| `ATPROTO_DID` | Yes | Your AT Protocol DID |

## Development

```bash
npm run dev     # dev server
npm run check   # type check
npm run format  # format
npm run lint    # lint
```

## Licence

AGPLv3 — see [LICENCE](./LICENCE)
