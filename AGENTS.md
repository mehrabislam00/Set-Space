<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (also rewrites the managed block above; commit it)
- `npm run lint` — ESLint (flat config). **Currently fails with 3 pre-existing errors**, all rule `react-hooks/set-state-in-effect`: `components/ui/carousel.tsx` and `hooks/use-mobile.ts` (shadcn-generated — fixing by hand is wasted effort, regeneration restores them) and `components/Animation/Reveal.tsx` (app code). Don't chase them; just don't add new errors.
- `npm run typecheck` — `tsc --noEmit`
- `npm run format` — Prettier, only `**/*.{ts,tsx}`
- No test runner exists. Verify with `lint` + `typecheck` (then `npm run build` if unsure).

## Stack quirks

- **Next.js 16.4.5 / React 19.3** — version-matched docs live in `node_modules/next/dist/docs/`. Read them before touching routing, data fetching, or config; APIs differ from older Next.
- **shadcn/ui style `base-nova` on `@base-ui/react` (not Radix).** Add components with `npx shadcn@latest add <name>` — hand-written primitives will drift from the registry. Config: `components.json`.
- **Tailwind CSS v4** — no `tailwind.config.*`. `app/globals.css` only imports partials; **all color values live in `app/theme.css`**, and `theme-transition.css` / `button-effects.css` / `animations.css` hold the shared effects. Dark variant is `@custom-variant dark` (class-based) in `globals.css`.
- **Fonts** (Google, via `app/layout.tsx`): DM Sans = body, Manrope = headings (`font-heading` class), Geist Mono. Don't re-declare font utilities elsewhere.
- **`cn` is the npm package `cn`**, not `clsx`+`tailwind-merge`. Re-exported from `lib/utils.ts`; generated components import `from "cn"` directly. Either works.
- Path alias `@/*` → repo root (`tsconfig.json`).
- Dark mode: `next-themes` with `class` attribute + `suppressHydrationWarning` on `<html>` (already set in `app/layout.tsx`). Press `d` toggles it.
- Prettier (`.prettierrc`): **no semicolons**, double quotes, 2-space, printWidth 80, **LF line endings**, `prettier-plugin-tailwindcss` sorts classes (works inside `cn`/`cva`). Run `npm run format` before committing.

## Layout

- Routes: `app/page.tsx` (home) and `app/how-it-works/`. Root `layout.tsx` wraps **every** page in `ThemeProvider` → `Navbar` → `PageTransition` → `Footer` — don't add those per-page.
- App components live in `components/<Section>/` with spaced folder names (e.g. `components/How It Works/`, `components/Home/Testimonials/`); shared primitives in `components/ui/`.
- Site copy/data comes from `lib/Site-data.ts`.
- `components/ui/` — shadcn-generated, don't hand-edit beyond what regeneration tolerates
- `hooks/`, `lib/`, `assets/` (images incl. `logo.svg`) — app code; `public/` — static files
- `CLAUDE.md` just imports this file — keep both in sync by editing only here
