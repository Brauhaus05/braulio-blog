# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server
npm run build     # static build → dist/
npm run preview   # serve dist/ locally
npm run check     # Astro/TypeScript type check
npm run test      # run unit tests once (Vitest)
npm run test:watch  # watch mode
```

## Architecture

Astro 5 static site (`output: 'static'`) with MDX. Deployed to Hostinger at `https://braulio.ca/blog/`.

**Base path is `/blog`** — all internal links must use `import.meta.env.BASE_URL` (already done in existing pages). The `astro.config.mjs` sets `site` and `base` for this.

### Content

Posts live in `src/content/posts/*.mdx`. The Zod schema at `src/content/schema.ts` defines all frontmatter fields — see `PUBLISHING.md` for the full field reference. Key fields: `draft` (hides from public routes), `featured` (pins to homepage hero), `issue` (e.g. `"No. 05"`).

Utility functions in `src/lib/posts.ts` handle filtering, sorting, and grouping — these are the only files with unit tests (`posts.test.ts`).

### Pages & Components

| Route                | File                           |
| -------------------- | ------------------------------ |
| `/blog/`             | `src/pages/index.astro`        |
| `/blog/archive`      | `src/pages/archive.astro`      |
| `/blog/posts/[slug]` | `src/pages/posts/[slug].astro` |
| `/blog/admin`        | `src/pages/admin/index.astro`  |
| `/blog/about`        | `src/pages/about.astro`        |

Components are grouped by concern: `layout/` (PageShell, AdminShell, SiteHeader, SiteFooter), `home/`, `post/`, `admin/`, `mdx/` (Dropcap, PullQuote, HeroImage, TwinImage — available as MDX components in post content).

### Styles

Plain CSS, no framework. Split by page scope:

- `src/styles/global.css` — design tokens, header, footer, shared utilities
- `src/styles/home.css` — homepage and archive layouts
- `src/styles/post.css` — single post layout
- `src/styles/admin.css` — admin dashboard

**Design tokens** (defined in `:root`): `--ink`, `--paper`, `--line`, `--accent`, `--pad-x`, `--col`, `--max`, `--hair`. Responsive `--pad-x` changes at 768px and 1280px breakpoints. The design system is brutalist/editorial: Anton for display headings, Montserrat for body and labels, `--paper` background with `--ink` hairline borders.

### Admin dashboard

Read-only, built at compile time from the content collection. Shows published/draft counts and post list. No authentication — it's a static page.

## Deployment

`npm run build` outputs to `dist/`. Upload changed files to Hostinger's `/blog/` folder via FTP. After adding a new post only a handful of files change — see `PUBLISHING.md` for the minimal upload list.
