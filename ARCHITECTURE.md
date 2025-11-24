# Code Architecture

This document describes the modular architecture of the AT Protocol Link Shortener.

## Directory Structure

```
src/
├── lib/
│   ├── constants.ts              # Application-wide constants
│   ├── index.ts                  # Main library exports
│   ├── services/
│   │   ├── atproto/             # AT Protocol services
│   │   │   ├── agent-factory.ts # Agent creation utilities
│   │   │   ├── agent-manager.ts # Agent caching and fallback
│   │   │   ├── identity-resolver.ts # Slingshot DID resolution
│   │   │   └── index.ts         # Module exports
│   │   ├── cache/               # Caching utilities
│   │   │   └── index.ts         # Generic TTL cache
│   │   ├── linkat/              # Linkat service
│   │   │   ├── fetcher.ts       # Raw board fetching
│   │   │   ├── generator.ts     # Shortcode generation
│   │   │   └── index.ts         # Main service with caching
│   │   ├── agent.ts             # Backwards compatibility
│   │   ├── linkat.ts            # Backwards compatibility
│   │   └── types.ts             # Shared type definitions
│   └── utils/
│       └── encoding.ts          # URL encoding utilities
└── routes/
    ├── +layout.svelte           # Global layout with dark mode
    ├── +page.server.ts          # Homepage server logic
    ├── +page.svelte             # Homepage UI
    ├── [shortcode]/
    │   └── +server.ts           # Redirect handler
    ├── api/
    │   └── links/
    │       └── +server.ts       # Links API endpoint
    └── favicon/
        └── favicon.ico/
            └── +server.ts       # Favicon handler
```

## Module Responsibilities

### Constants (`lib/constants.ts`)

Central location for all configuration values:

- Cache settings (TTL, prefixes)
- Shortcode configuration (length, base62 chars)
- AT Protocol endpoints (Slingshot, public API)
- HTTP status codes

**Benefits:**

- Single source of truth
- Easy to modify configuration
- Type-safe constants

### AT Protocol Services (`lib/services/atproto/`)

#### `agent-factory.ts`

- Creates AtpAgent instances
- Handles fetch function injection for server-side contexts
- Wraps fetch to ensure proper headers

#### `identity-resolver.ts`

- Resolves DIDs to PDS endpoints via Slingshot
- Error handling and logging
- Uses constants for endpoint configuration

#### `agent-manager.ts`

- Manages agent lifecycle and caching
- Provides fallback logic (PDS → public API)
- Exports helper functions for common operations

**Benefits:**

- Separation of concerns
- Easy to test individual components
- Reusable across different contexts

### Cache Service (`lib/services/cache/`)

Generic TTL-based cache implementation:

- Set/get/delete operations
- Automatic expiration
- Cache pruning utility
- Type-safe generic interface

**Benefits:**

- Reusable for any cached data
- Not tied to specific use case
- Clean API with proper TypeScript support

### Linkat Service (`lib/services/linkat/`)

#### `fetcher.ts`

- Raw Linkat board data fetching
- AT Protocol record retrieval
- Data validation

#### `generator.ts`

- Shortcode generation from URLs
- Collision handling
- Link search functionality

#### `index.ts`

- Main service interface
- Combines fetching + generation
- Implements caching layer

**Benefits:**

- Pure functions in fetcher and generator (easy to test)
- Side effects isolated to main service
- Clear data flow

### Utilities (`lib/utils/`)

#### `encoding.ts`

- URL to shortcode encoding
- Base62 conversion
- Validation helpers

**Benefits:**

- Stateless utility functions
- Reusable across application
- Easy to unit test

## Backwards Compatibility

The old `agent.ts` and `linkat.ts` files remain as re-export wrappers:

- Existing imports continue to work
- No breaking changes to route handlers
- Smooth migration path

## Design Principles

### 1. Single Responsibility

Each module has one clear purpose:

- `agent-factory`: Create agents
- `identity-resolver`: Resolve DIDs
- `cache`: Cache data

### 2. Dependency Injection

- Fetch functions can be injected
- Agents are created with custom configs
- Makes testing easier

### 3. Separation of Concerns

- Pure logic in utilities
- Side effects in services
- UI in routes

### 4. Type Safety

- Explicit TypeScript types
- Shared type definitions
- Constants with `as const`

### 5. Testability

- Pure functions are easy to test
- Services use dependency injection
- Clear interfaces

## Import Patterns

### Using the main library export:

```typescript
import { getShortLinks, encodeUrl, CACHE } from '$lib';
```

### Using specific modules:

```typescript
import { getPublicAgent } from '$lib/services/atproto';
import { Cache } from '$lib/services/cache';
```

### Using backwards-compatible imports:

```typescript
import { createAgentForDID } from '$lib/services/agent';
import { findShortLink } from '$lib/services/linkat';
```

## Future Improvements

### Easy to Add:

1. **Database caching** - Replace in-memory cache
2. **Custom shortcodes** - Extend generator
3. **Analytics** - Add tracking module
4. **Rate limiting** - Add middleware
5. **Multiple DID support** - Extend agent manager

### Testing Strategy:

1. **Unit tests** for utils and pure functions
2. **Integration tests** for services
3. **E2E tests** for routes

## Configuration

All configuration is centralized in `constants.ts`:

- Change cache TTL in one place
- Update API endpoints easily
- Modify shortcode length globally

## Error Handling

Consistent error handling pattern:

1. Log errors with context
2. Throw with descriptive messages
3. Fallback to sensible defaults
4. Surface errors to users when appropriate
