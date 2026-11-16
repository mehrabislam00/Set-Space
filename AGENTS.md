<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — Next dev server. It rewrites the managed block above; commit that change rather than reverting it.
- `npm run lint` — ESLint flat config. Baseline is **3 errors + 4 warnings**; don't add more:
  - errors (`react-hooks/set-state-in-effect`): `components/ui/carousel.tsx`, `hooks/use-mobile.ts`, `components/Animation/Reveal.tsx`
  - warnings (unused imports): `components/Host/Host-header.tsx`
  - `carousel.tsx` / `use-mobile.ts` are shadcn-generated; hand-fixes get overwritten on regeneration, so leave them.
- `npm run typecheck` — `tsc --noEmit` (currently clean).
- `npm run format` — Prettier, only `**/*.{ts,tsx}` (CSS is not formatted).
- No test runner and no CI. Verify with `lint` + `typecheck`; run `npm run build` only when the change can affect production output.

The app is front-end only: no API routes, server actions, DB, or env vars. All copy and mock state lives in `lib/*.ts`; forms and auth "submit" just navigate.

## Routing

- **`app/dashbord/` is misspelled on purpose (de facto)** while every link uses `/dashboard`. `next.config.ts` rewrites `/dashboard/:path*` → `/dashbord/:path*`. Never create `app/dashboard`; edit `app/dashbord`. After renaming the folder, delete that rewrite.
- Redirect stubs exist so old/alias URLs work — don't duplicate their pages:
  - `/studios[/...]` → `/explore-studio[/...]`
  - `/faq` → `/frequenty-asked-questions` (folder name is misspelled; that is the canonical URL)
  - `/notifications` → `/dashboard/notifications`
  - `/profile` → `/dashbord/profile` (target uses the folder spelling; don't copy that pattern in new links)
- Several linked routes don't exist yet (`/support`, `/privacy`, `/terms`, `/forgot-password`), and `app/host/my-studios/edit` is an empty placeholder. A 404 or blank page there is expected; don't "fix" it unprompted.
- Root `app/layout.tsx` wraps every page in `ThemeProvider` → `SiteChrome(Navbar)` → `PageTransition` → `SiteChrome(Footer)`. Never add Navbar/Footer/ThemeProvider per page. `SiteChrome` hides chrome on paths in `authRoutes` (`lib/Site-data.ts`) — add new full-screen auth pages there.
- `app/dashbord/layout.tsx` and `app/host/layout.tsx` own a sidebar and their own `PageTransition scope="content"`. `PageTransition` keys sections so the sidebar stays mounted; don't add per-page transition wrappers.

## Stack quirks

- **Next.js 16.4.5 / React 19.3** — `params` and `searchParams` are Promises (see the page files). Version-matched docs live in `node_modules/next/dist/docs/`; read them before touching routing, data fetching, or config.
- **shadcn/ui style `base-nova` on Base UI (`@base-ui/react`), not Radix.** Composition uses `render={<Button />}`, not `asChild`. Add components with `npx shadcn@latest add <name>` — hand-written primitives drift from the registry. Config: `components.json`.
- **Tailwind CSS v4** — no `tailwind.config.*`. `app/globals.css` wires Tailwind + `@theme inline`; **all color values live in `app/theme.css`** and effects in `app/animations.css`, `app/button-effects.css`, `app/Theme-transition.css`. Dark variant is `@custom-variant dark` in `globals.css`. Note `globals.css` imports `./theme-transition.css` (lowercase) while the file is `Theme-transition.css` — only resolves on case-insensitive (Windows) filesystems, so match casing if Linux/CI builds break.
- Fonts (Google, `next/font` in `app/layout.tsx`): DM Sans = body (`font-sans`), Manrope = headings (`font-heading`), Geist Mono. Don't redeclare font utilities.
- **`cn` is the npm package `cn`**, not `clsx` + `tailwind-merge`. Re-exported from `lib/utils.ts`; generated components import `from "cn"`. Both work.
- Path alias `@/*` → repo root (`tsconfig.json`); there is no `src/`.
- Dark mode is default (`defaultTheme="dark"` in `components/theme-provider.tsx`); pressing `d` outside inputs toggles it via the hotkey there.
- Prettier: no semicolons, double quotes, 2-space, printWidth 80, **LF**, `prettier-plugin-tailwindcss` sorting inside `cn`/`cva`. Run `npm run format` before committing.

## Layout and data

- Pages: `/`, `/about`, `/contact`, `/explore-studio`, `/explore-studio/[studio-detail]`, `/how-it-works`, `/frequenty-asked-questions`, `(auth)/login|register`, `/dashboard/*`, `/host/*`.
- App components live in `components/<Section>/`, often with nested **spaced, inconsistently cased** folders (`Home/Hero banner/`, `Explore studios/`, `Why setspace/`, `Frequenty Asked Questions/`). Imports are case-sensitive on Linux: copy the exact existing path rather than inventing a name.
- Shared primitives: `components/ui/` (shadcn-generated — don't hand-edit beyond what regeneration tolerates), `components/Container/Container.tsx` for page width, `components/PageBanner/Page-banner.tsx` for inner-page headers.
- Data modules: `lib/Site-data.ts` (nav, footer, categories, studio catalog + `getStudioDetail`, `authRoutes`), `Dashboard-data.ts`, `Host-data.ts`, `Studio-filters.ts` (filter defaults/predicates). Keep copy and mock records there, not inline in components.
- Images live in `assets/` and are imported as static imports for `next/image`; `public/` is empty and not the place for site imagery.
- `CLAUDE.md` just imports this file — edit only `AGENTS.md` and keep both in sync.
