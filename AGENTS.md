<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (also rewrites the managed block above; commit it)
- `npm run lint` — ESLint (flat config). **Currently fails with 2 pre-existing errors** in generated shadcn files (`components/ui/carousel.tsx`, `hooks/use-mobile.ts`, rule `react-hooks/set-state-in-effect`). Don't chase them; just don't add new errors.
- `npm run typecheck` — `tsc --noEmit`
- `npm run format` — Prettier, only `**/*.{ts,tsx}`
- No test runner exists. Verify with `lint` + `typecheck` (then `npm run build` if unsure).

## Stack quirks

- **Next.js 16.4.5 / React 19.3** — version-matched docs live in `node_modules/next/dist/docs/`. Read them before touching routing, data fetching, or config; APIs differ from older Next.
- **shadcn/ui style `base-nova` on `@base-ui/react` (not Radix).** Add components with `npx shadcn@latest add <name>` — hand-written primitives will drift from the registry. Config: `components.json`.
- **Tailwind CSS v4** — no `tailwind.config.*`; theme tokens are CSS vars in `app/globals.css`.
- **`cn` is the npm package `cn`**, not `clsx`+`tailwind-merge`. Re-exported from `lib/utils.ts`; generated components import `from "cn"` directly. Either works.
- Path alias `@/*` → repo root (`tsconfig.json`).
- Dark mode: `next-themes` with `class` attribute + `suppressHydrationWarning` on `<html>` (already set in `app/layout.tsx`). Press `d` toggles it.
- Prettier: **no semicolons**, double quotes, 2-space, `prettier-plugin-tailwindcss` sorts classes. Run `npm run format` before committing.

## Layout

- `app/` — App Router entry (`layout.tsx`, `page.tsx`); no route segments yet
- `components/ui/` — shadcn-generated, don't hand-edit beyond what regeneration tolerates
- `components/`, `hooks/`, `lib/`, `assets/` — app code; `public/` — static files
- `CLAUDE.md` just imports this file — keep both in sync by editing only here
