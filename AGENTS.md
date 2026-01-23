# Clipping Bot - Operational Guide

## Build & Run

```bash
npm install
npm run dev
```

## Validation

- Tests: `npm test`
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`

## Tech Stack

- Discord.js for bot framework
- Database TBD (Postgres recommended for relational data)
- Node.js runtime

## Codebase Patterns

- Commands go in `src/commands/`
- Database models in `src/models/`
- Utility functions in `src/lib/`
- Keep commands thin, business logic in services

## Operational Notes

- Bot requires DISCORD_TOKEN and DISCORD_CLIENT_ID env vars
- Video tracking requires periodic polling of social platform APIs
- Verification codes should be unique per user and expire after 24h
