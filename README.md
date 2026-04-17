# Python Interview Prep

A comprehensive Python interview preparation guide covering 268 topics across 28 sections — from Trainee through Lead level. Includes decorators, generators, GIL, OOP, SOLID, async, databases, testing, and every tricky gotcha you're likely to encounter.

## Features

- ⭐ **EPAM Must-Have** section — the 20 essential topics, curated
- 🔍 Full-text search across all topics
- 🏷️ Category filtering (Basics, OOP, Advanced, Std Lib, Testing, etc.)
- ✅ Progress tracking with auto-saved checkboxes (localStorage)
- 🌙 Dark theme, easy on the eyes for long study sessions
- 📱 Responsive — works on mobile

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Cloudflare Pages

### Option A — Git integration (recommended)

1. Push this repo to GitHub
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select your repo
4. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy. Every `git push` auto-rebuilds.

### Option B — Direct upload

1. Run `npm run build` locally
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
3. Drag the `dist/` folder in

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- lucide-react (icons)
