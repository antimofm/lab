# PROJECT_CANON.md — Flow: Agentic Auction Protocol

> Single source of truth for lossless project reconstruction.  
> **Last Updated:** 2026-02-23

---

## (a) Project Overview

**Flow** is an agentic auction protocol — a platform where AI agents can deploy, discover, and bid on token auctions. Built as a mid-fidelity React prototype demonstrating UX for Continuous Clearing Auctions (CCA) powered by Uniswap.

### Core Value Proposition
- Agents and humans launch token campaigns through curated batch auctions
- Fair price discovery via uniform clearing price mechanism (CCA)
- No sniping advantage — all bidders pay the same price
- **Agentic-first**: agents install the "OpenClaw Skill" to programmatically create campaigns and place bids
- The CTA is `flow.bid` — a skill endpoint agents add to participate

### Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** Local component state (no global context in active routes)
- **Routing:** React Router v6
- **Data:** Mock data via `launchData.ts` (no backend)
- **Markdown:** react-markdown for Skill page and Canon panel

---

## (b) Design System

### Color Palette (HSL in index.css)
| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | 40 30% 94% | Sepia/cream canvas |
| `--foreground` | 5 75% 38% | Red — text, icons, borders |
| `--card` | 0 0% 100% | White surfaces |
| `--primary` | 5 75% 38% | Red accents (= foreground) |
| `--muted` | 40 20% 90% | Hover states, placeholder bg |
| `--success` | 217 91% 60% | Blue (oversubscription indicator) |
| `--border` | 5 75% 38% | Red borders everywhere |

### Typography
- System UI stack (`system-ui, -apple-system, sans-serif`)
- Base: 14px
- Headings: `font-semibold tracking-tight`
- Redacted mode: `Flow Block` font (toggle via body class)

### Component Constraints
- 1px solid red borders
- `--radius: 0.625rem` (10px corner radius)
- No shadows, no gradients (except functional fades)
- Icons: Lucide (16-20px, 1.5-2px stroke)
- Dark mode defined but not actively toggled

---

## (c) Route Inventory

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.tsx` | App home — hero circle, featured carousel, campaign list |
| `/skill` | `Skill.tsx` | OpenClaw Skill documentation (markdown) |
| `/landing` | `Landing.tsx` | Marketing landing page (why auctions, how it works) |
| `*` | `NotFound.tsx` | 404 fallback |

### Inactive/Legacy Routes (files exist but not wired)
- `Index.tsx`, `AppHome.tsx`, `AuctionPage.tsx`, `Help.tsx`, `Apply.tsx`, `Profile.tsx`

---

## (d) Page Architecture

### Home (`/`)
- **Hero**: Centered circle with tagline "agentic auction protocol" and `flow.bid` CTA linking to `/skill`
- **Featured carousel**: Toggled via MetaNav permutation panel; cycles through featured campaigns with dot pagination
- **Filter tabs**: All | Upcoming | Live | Closing soon | Oversubscribed | Graduated | Failed
- **Campaign list**: Vertical stack of `CampaignRow` components
- **State permutations** (via MetaNav): skeleton loading, error state, empty state, show featured toggle

### Skill (`/skill`)
- Renders markdown documentation for the "Flow OpenClaw Skill"
- Describes agent capabilities: create campaigns, place bids, query state, claim/reclaim

### Landing (`/landing`)
- Marketing page: hero → why auctions (3 cards) → how it works (3 steps) → powered by Uniswap CCA

---

## (e) Component Inventory

### Layout
| Component | Purpose |
|-----------|---------|
| `Nav` | Top navigation bar |
| `Footer` | Site footer |
| `MetaNav` | Debug bar: sitemap panel + canon panel + state permutation toggles |
| `SitemapPanel` | Route listing overlay |
| `CanonPanel` | Renders this file as a slide-over markdown panel |

### Campaign Row (Primary UI)
| Component | Purpose |
|-----------|---------|
| `CampaignRow` | Expandable row — the core campaign tile |
| `CampaignRowSkeleton` | Loading placeholder |
| `CopyableAddress` | Click-to-copy address with truncation |
| `CampaignMediaModal` | Full-screen media gallery modal |

### Campaign Row Anatomy (Collapsed)
```
┌─────────────────────────────────────────────────┐
│ [16:9 cover thumb]  @handle      $raised/$target │
│                     NAME ═══════════════ 74%     │
│                     ● Live · Closing  Ends in 2D │
└─────────────────────────────────────────────────┘
```
- Cover thumbnail: 72×40px, shows play icon for video type
- Progress bar: emission percentage, red fill (blue for oversubscribed portion)
- Status badges: Live (pulsing dot), Upcoming, Graduated (blue), Failed (strikethrough + opacity)

### Campaign Row Anatomy (Expanded)
```
┌─────────────────────────────────────────────────┐
│ [media strip: scrollable thumbnails] [See all]  │
├─────────────────────────────────────────────────┤
│              [logo or placeholder]               │
│      "Campaign description in italics"           │
│                                                  │
│  Auction: CCA    Target: $1M   Floor FDV: $2.5M │
│  Liquidity: 60%  Creator: @x   Clear. Price: $… │
│  Eligibility: Open  Bidders: 187  Supply: 100M  │
│  Auction Amt: 20M  USDC Raised: $742K  Min: $…  │
│  Launch FDV: $3.7M  Pool Fee: 1.5%              │
│                                                  │
│  0x1a2b…ef01  [copy]                            │
│  0xabcd…ef01  [copy]                            │
│                                                  │
│  ┌ Prompt ──────────────────────── [Copy] ┐     │
│  │ Launch a fair price discovery token...  │     │
│  │ [More]                                  │     │
│  └─────────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

### Home-Specific
| Component | Purpose |
|-----------|---------|
| `FlowIntro` | Legacy hero (not used in current Home) |
| `LayoutSwitcher` | Grid/list toggle (legacy, not used) |

### UI Primitives
All shadcn/ui components in `src/components/ui/` — standard set.

---

## (f) Data Model (`src/lib/launchData.ts`)

### LaunchCampaign Interface
```typescript
interface LaunchCampaign {
  id: string;
  name: string;
  ticker: string;
  description: string | null;        // Falls back to "This campaign does not have a description."
  logoUrl: string | null;             // Local SVGs in /logos/logo-{1-6}.svg
  coverImageUrl: string | null;
  coverType?: 'video' | 'image';
  media: CampaignMedia[];             // Array of image/video/gif/link items
  status: 'upcoming' | 'live' | 'ended';
  outcome: 'graduated' | 'failed' | null;
  featured: boolean;

  // Creator
  creatorHandle: string;
  creatorType: 'human' | 'agent';
  verified: boolean;

  // Timing
  startAt: Date;
  endAt: Date;

  // Token emission
  totalSupply: number;
  auctionAllocation: number;
  tokensReleased: number;

  // Capital/pricing
  committedAmount: number;
  targetAmount: number;
  currentClearingPrice: number | null;
  floorClearingPrice: number | null;
  floorFDV: number | null;

  // Tokenomics split
  liquidityPct: number | null;
  deployerImmediatePct: number | null;
  deployerVestedPct: number | null;

  // Demand
  bidsCount: number;
  biddersCount: number;

  // Meta
  auctionType: string;
  eligibility: string;
  launchFDV: number | null;
  minRaise: number;
  poolFeePct: number | null;
  deployerAddress: string;
  auctionAddress: string;
  tokenAddress: string;
  prompt: string | null;              // Agent creation prompt, copyable
}
```

### Helper Functions
- `emissionPct(c)` — tokens released / auction allocation × 100
- `fundingPct(c)` — committed / target × 100
- `isOversubscribed(c)` — committed > target
- `isClosingSoon(c)` — live + ≤24h remaining
- `timeLabel(c)` — human-readable countdown string

### Mock Data (12 campaigns)

| ID | Ticker | Status | Featured | Creator |
|----|--------|--------|----------|---------|
| flow-launch | FLOW | live | ✓ | human |
| featured-upcoming | QNT | upcoming | ✓ | human |
| featured-ended | PRSM | ended/graduated | ✓ | human |
| featured-oversub | HLX | live/oversubscribed | ✓ | human |
| nova-markets | NOVA | upcoming | — | human |
| meridian | MRD | upcoming | — | agent |
| project-atlas | ATLS | live | — | human |
| echo-labs | ECHO | live/closing-soon | — | human |
| arc-protocol | ARC | live/oversubscribed | — | agent |
| vanguard | VGD | ended/graduated | — | human |
| ghost-network | GHST | ended/failed | — | agent |
| dawn-protocol | DAWN | ended/failed | — | human |

### Placeholder Logos
6 local SVGs at `/logos/logo-{1-6}.svg` — simple geometric shapes reused across campaigns.

---

## (g) State Permutations (Home Page)

Controlled via `MetaNav` debug panel:

| Toggle | Effect |
|--------|--------|
| Show Skeleton | Renders 6 `CampaignRowSkeleton` placeholders |
| Show Error | Renders error banner instead of campaign list |
| Force Empty | Returns empty filtered list (shows "No campaigns match") |
| Show Featured | Enables featured campaign carousel above filter tabs |

### Campaign Status Permutations
| # | Status | Outcome | Visual |
|---|--------|---------|--------|
| 1 | upcoming | null | Gray bar, no emission %, "Starts in Xd" |
| 2 | live | null | Red fill bar, emission %, "Ends in Xd" |
| 3 | live + closing | null | + "Closing soon" badge |
| 4 | live + oversub | null | Blue overfunding segment on bar |
| 5 | ended | graduated | Blue "Graduated" text |
| 6 | ended | failed | Strikethrough + 60% opacity |

---

## (h) Legacy Systems

The following exist in the codebase but are **not actively routed or used**:

### Legacy Data (`src/lib/data.ts`, `src/lib/types.ts`)
- Original `Auction` type with `AgentInfo`, `Bid`, `UserState`, `AppState`
- Full FlowContext with wallet connect, bid placement, claim/reclaim
- 12 mock auctions with agent metadata (framework, autonomy level, verification)
- Agent bidder seeding

### Legacy Context (`src/context/FlowContext.tsx`)
- Global state provider with debug overrides
- Wallet connection simulation
- Bid placement flow

### Legacy Components
- `CampaignCard`, `CampaignSection` — card-based layouts
- `StateControls` — debug panel for legacy context
- `AgentBadge`, `AgentInfoSection` — agent metadata display
- `StatusBadge`, `InfoTooltip`, `NavLink` — utility components
- Full `campaign/` subfolder: BidModule, BidDistribution, PriceDiscovery, etc.

### Legacy Pages
- `AuctionPage` — individual auction with bid module
- `Help` — FAQ page
- `Apply` — launch application form
- `Profile` — user profile
- `Index`, `AppHome` — earlier home iterations

---

## (i) Reconstruction Notes

To rebuild from scratch:

1. `npm create vite@latest flow -- --template react-ts`
2. Install: shadcn/ui, tailwindcss-animate, lucide-react, react-router-dom, react-markdown, @tanstack/react-query
3. Copy `index.css` with HSL variables (red wireframe palette)
4. Create `src/lib/launchData.ts` with `LaunchCampaign` type + 12 mock entries
5. Create placeholder SVG logos in `public/logos/`
6. Build components: `CampaignRow` (expandable tile) → `CampaignRowSkeleton` → `CopyableAddress` → `CampaignMediaModal`
7. Build pages: `Home` (hero + filters + list) → `Skill` (markdown) → `Landing` (marketing)
8. Wire routes in `App.tsx`: `/` → `/skill` → `/landing`
9. Add `MetaNav` with permutation toggles + `CanonPanel` + `SitemapPanel`

---

## (j) Deferred Features

- Backend integration (database, auth)
- Real auction contract interaction
- Agent skill API implementation (`flow.bid` endpoint)
- A2A card endpoint (`.well-known/agent.json`)
- Agent verification flow
- Bid placement UI (currently no bid form in active routes)
- Wallet connection
- Notifications, settings, admin dashboard
- Dark mode toggle (tokens defined, no UI switch)
- Cleanup legacy code

---

*This document is the single source of truth. Update with every structural change.*
