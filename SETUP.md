# JobLens – Setup Guide

## Prerequisites
- Node.js 18+
- pnpm 9+
- Chrome browser

## Quick Start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Create icon assets
```bash
node scripts/create-icons.js
```
Replace placeholder icons in `assets/` with real 16×16, 48×48, 128×128 PNGs before publishing.

### 3. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local and set VITE_BACKEND_URL
```

### 4. Build the extension
```bash
pnpm build
```

### 5. Load in Chrome
1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` folder

## Development (with hot reload)
```bash
pnpm dev
```

## Backend (Cloudflare Worker)
```bash
cd backend
pnpm install
# Set secrets:
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put HUNTER_API_KEY
# Deploy:
pnpm deploy
```

## Run Tests
```bash
pnpm test
```

## Project Structure
```
src/
  background/      – Chrome service worker
  content_scripts/ – detector.ts (site detection) + overlay.ts (React mount)
  core/            – scraper engine, registry, normalizer, enrichment
  scoring/         – opportunity scorer, strategy engine
  enrichments/     – AmbitionBox, LinkedIn, Crunchbase, Glassdoor
  overlay/         – React panel (Score / Recruiter / Match tabs)
  popup/           – Extension popup (resume upload, settings)
  store/           – Zustand state
  types/           – TypeScript interfaces
  utils/           – cache, logger, hash, llm-client, registry-updater
  constants/       – config values, UI strings
backend/
  src/index.ts     – Cloudflare Worker (Hono) – Claude + Hunter.io proxy
tests/
  unit/            – Vitest unit tests
```

## Key Flows
- **Opportunity Score**: detector.ts scrapes → service-worker scores → overlay renders
- **Recruiter Intel**: enrichment-engine cross-refs LinkedIn → strategy-engine picks approach
- **AI Draft**: service-worker calls Claude API via backend proxy → overlay displays
- **Resume Match**: resume parsed once via Claude → stored locally → matched per job

## Environment Variables
| Variable | Where | Purpose |
|---|---|---|
| `VITE_BACKEND_URL` | .env.local | Cloudflare Worker URL |
| `ANTHROPIC_API_KEY` | CF Worker secret | Claude API |
| `HUNTER_API_KEY` | CF Worker secret | Email enrichment |
