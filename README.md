# heyblip.au

Marketing website for **Blip** — Bluetooth mesh chat for events.

**Live:** [heyblip.au](https://heyblip.au) / [heyblipau.vercel.app](https://heyblipau.vercel.app)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D Visual | Three.js (WebGL mesh network) |
| Icons | Lucide React |
| Font | Plus Jakarta Sans (Google Fonts) |
| Hosting | Vercel |
| Domain | heyblip.au |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, features, how it works, privacy, pricing, CTA |
| `/tech` | Technical specs — mesh network, gossip routing, encryption, packet format |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/acceptable-use` | Acceptable use policy |

## Design System

Matches the Blip iOS app design tokens:

- **Colors:** `#000000` background, `#6600FF` accent purple, white foreground
- **Font:** Plus Jakarta Sans (Regular, Medium, SemiBold, Bold)
- **Glass effects:** `backdrop-filter: blur(40px)` with translucent borders
- **Animations:** `cubic-bezier(0.16, 1, 0.3, 1)` easing, 100ms stagger
- **Theme:** Dark (default), Light, System — persisted to localStorage

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens, theme variables, glass effects
│   ├── layout.tsx           # Root layout with ThemeProvider
│   ├── page.tsx             # Landing page
│   ├── tech/page.tsx        # Technical specs
│   ├── privacy/page.tsx     # Privacy policy
│   ├── terms/page.tsx       # Terms of service
│   └── acceptable-use/page.tsx
├── components/
│   ├── Nav.tsx              # Fixed glass navbar with theme toggle
│   ├── Hero.tsx             # Hero section with 3D mesh background
│   ├── Features.tsx         # 6-card feature grid
│   ├── HowItWorks.tsx       # 4-step flow with pulsing beacon bullets
│   ├── Security.tsx         # Privacy section with animated shield
│   ├── Pricing.tsx          # 3-tier pricing cards
│   ├── CTA.tsx              # Final download call-to-action
│   ├── Footer.tsx           # Site footer with navigation
│   ├── MeshBackground.tsx   # Three.js 3D mesh network visualization
│   ├── ThemeProvider.tsx     # Dark/light/system theme context
│   └── ThemeToggle.tsx      # Theme switcher (Sun/Moon/Monitor icons)
├── lib/
│   └── animations.ts        # Framer Motion animation presets
└── public/
    ├── Blipwhitelogo.png    # White logo (dark backgrounds)
    └── Blipblacklogo.png    # Dark logo (light backgrounds)
```

## Related Repos

| Repo | Purpose |
|------|---------|
| [txc0ld/FezChat](https://github.com/txc0ld/FezChat) | Blip iOS app (Swift, SwiftUI, BLE mesh) |
| [txc0ld/heyblip.au](https://github.com/txc0ld/heyblip.au) | This website |
