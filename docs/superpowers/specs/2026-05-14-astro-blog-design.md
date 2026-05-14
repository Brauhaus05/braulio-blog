# Astro Blog — Design Spec
*Braulio's Journal · May 14, 2026*

---

## Overview

Convert the existing HTML/CSS mockups in this repo into a fully functional personal blog using Astro, deployed as a static site to a `/blog` subfolder on Hostinger shared hosting. Posts are authored as local MDX files. A lightweight read-only admin dashboard is included.

---

## Decisions & Constraints

| Decision | Choice | Reason |
|---|---|---|
| Framework | Astro | Requested |
| Content source | Local MDX files | Simplest, git-based workflow |
| Rendering | SSG (`output: "static"`) | Hostinger shared hosting — no Node.js runtime |
| Base path | `/blog` | Blog lives in a subfolder of an existing static site |
| CSS approach | Port existing `styles.css` unchanged | Design system is complete; no redesign risk |
| Admin | Read-only static dashboard | Posts are local files; no write capability needed |
| Newsletter | Substack iframe embed | Static-compatible; no API keys required |
| Post format | MDX with custom Astro components | Clean authoring + rich visual patterns from design |

---

## Project Structure

```
braulio-blog/
├── astro.config.mjs
├── src/
│   ├── content/
│   │   ├── config.ts           ← Content Collections schema
│   │   └── posts/              ← .mdx files (one per post)
│   ├── components/
│   │   ├── layout/             ← SiteHeader, SiteFooter, PageShell
│   │   ├── home/               ← Hero, FeaturedPost, ArticleCard, Marquee,
│   │   │                          NewsletterSignup, CategoryIndex
│   │   ├── post/               ← PostSidebar, TOC, ShareButtons
│   │   ├── mdx/                ← Dropcap, PullQuote, HeroImage, TwinImage
│   │   └── admin/              ← StatCard, PostsTable, ActivityFeed
│   ├── pages/
│   │   ├── index.astro         ← Homepage
│   │   ├── archive.astro       ← All posts
│   │   ├── about.astro         ← About page (static)
│   │   ├── admin/index.astro   ← Read-only dashboard
│   │   └── posts/[slug].astro  ← Post detail (dynamic route)
│   └── styles/
│       ├── global.css          ← existing styles.css, imported in PageShell
│       └── admin.css           ← admin surface styles, from admin.html
└── public/
    └── assets/                 ← images (copied from current assets/)
```

---

## Astro Config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://[your-domain].com',
  base: '/blog',
  output: 'static',
  integrations: [mdx()],
});
```

---

## Content Model

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title:       z.string(),
    deck:        z.string(),
    date:        z.coerce.date(),
    issue:       z.string(),
    category:    z.string(),
    tags:        z.array(z.string()).default([]),
    readTime:    z.number(),
    heroImage:   z.string().optional(),
    heroCaption: z.string().optional(),
    featured:    z.boolean().default(false),
    draft:       z.boolean().default(false),
  }),
});

export const collections = { posts };
```

**Frontmatter example:**

```mdx
---
title: "The Brutalist Resurgence"
deck: "Concrete is back — and this time, it isn't apologising."
date: 2024-10-14
issue: "No. 04"
category: "Architecture"
tags: ["Brutalism", "Field Notes"]
readTime: 9
heroImage: "/assets/post-hero.png"
heroCaption: "Fig. 01 · Kessler Foundation, North Facade"
featured: true
draft: false
---
```

**Draft behaviour:** Posts with `draft: true` are excluded from all public pages (homepage, archive, post routes). They appear only in the admin dashboard, allowing posts to be staged before going live.

---

## Pages & Routing

| Route | File | Data |
|---|---|---|
| `/blog/` | `pages/index.astro` | Featured post (most recent `featured: true`; falls back to most recent non-draft post if none is marked featured) + 6 most recent non-draft posts |
| `/blog/posts/[slug]` | `pages/posts/[slug].astro` | Single MDX entry; `getStaticPaths()` builds one page per non-draft post |
| `/blog/archive` | `pages/archive.astro` | All non-draft posts sorted by date descending; displayed as a full-width Anton-type list (mirroring the sidebar index pattern from the homepage mockup), grouped by category with post count per category |
| `/blog/about` | `pages/about.astro` | Static content, no collection query |
| `/blog/admin` | `pages/admin/index.astro` | Full posts collection including drafts, aggregated at build time |

---

## Component Architecture

### Layout
| Component | Responsibility |
|---|---|
| `PageShell.astro` | Fixed 1280px `.page` shell, imports `global.css`, accepts `<slot />` |
| `SiteHeader.astro` | Brand mark, nav (Journal / Archive / About). "Write" button removed. |
| `SiteFooter.astro` | Footer links, copyright |

### Home
| Component | Responsibility |
|---|---|
| `Hero.astro` | Large Anton headline, tagline, meta row (Issue / frequency / est. year) |
| `Marquee.astro` | Animated scrolling text strip |
| `FeaturedPost.astro` | 2fr+1fr card; receives a post object as prop |
| `ArticleCard.astro` | Single card in 3-column grid; reused on archive page |
| `NewsletterSignup.astro` | Dark sidebar block with Substack iframe embed |
| `CategoryIndex.astro` | "Index — By Material" list; counts derived from posts collection at build time |

### Post
| Component | Responsibility |
|---|---|
| `PostSidebar.astro` | Sticky sidebar: back link, meta block, TOC, share buttons |
| `TOC.astro` | Table of contents auto-generated from post `h2` headings |
| `ShareButtons.astro` | Link, email, bookmark buttons |

### MDX (available inside all `.mdx` post files)
| Component | Responsibility |
|---|---|
| `Dropcap.astro` | Anton float-left first letter |
| `PullQuote.astro` | Bordered blockquote with oversized opening quote mark and optional cite |
| `HeroImage.astro` | Full-width image with caption bar (fig number + credit) |
| `TwinImage.astro` | Side-by-side 1:1 image pair with figure captions |

### Admin
| Component | Responsibility |
|---|---|
| `StatCard.astro` | Bento stat tile: label, large number, delta |
| `PostsTable.astro` | Posts list with title, status badge, category, date — read-only |
| `ActivityFeed.astro` | List of recent posts sorted by date, showing title, status badge, and date — derived from post frontmatter only (no server-side event log) |

---

## CSS Strategy

- `src/styles/global.css` — direct copy of the existing `styles.css`. Imported once in `PageShell.astro`. No modifications.
- `src/styles/admin.css` — direct copy of the inline `<style>` block from `admin.html`. Imported only on admin pages.
- Page-specific styles from the `<style>` blocks in `index.html` and `post.html` move into scoped `<style>` blocks in their respective `.astro` components.
- No CSS framework added. The design system defined in `DESIGN.md` is the single source of truth.

---

## Newsletter Integration

`NewsletterSignup.astro` embeds Substack's hosted form via iframe:

```astro
<div class="newsletter">
  <h3>Dispatches.</h3>
  <p>Notes from the desk. Bi‑weekly. No fluff — just structure, shadow, and the occasional photograph.</p>
  <iframe
    src="https://[your-handle].substack.com/embed"
    frameborder="0"
    scrolling="no"
    class="newsletter__embed"
  />
</div>
```

Substack handles all form submission and subscriber management. No API keys or server required.

---

## Admin Dashboard

A static page at `/blog/admin`. Built from the full posts collection (including drafts) at build time. Stats reflect the state of the content at the last `npm run build`.

**What it shows:**
- Stat tiles: draft count, published count, total read-time in minutes (sum of all `readTime` frontmatter values across published posts)
- Posts table: title, status badge (published / draft), category, date — read-only
- Activity feed: events derived from post frontmatter dates

**What it does not have:** write capability, auth, search. It is a build-time snapshot.

---

## Build & Deploy

```
npm run build
```

Output: `dist/blog/` — a complete static site ready for upload.

**Upload steps:**
1. Run `npm run build` locally
2. Connect to Hostinger via FTP (or use File Manager)
3. Upload contents of `dist/blog/` into the `/blog` folder on the server
4. No server process or runtime needed

**Adding a new post:**
1. Create `src/content/posts/my-new-post.mdx`
2. Run `npm run build`
3. Re-upload changed files to Hostinger

**Output structure:**
```
blog/
├── index.html
├── archive/index.html
├── about/index.html
├── admin/index.html
├── posts/
│   ├── the-brutalist-resurgence/index.html
│   └── ...
└── _astro/             ← hashed CSS and JS bundles
```
