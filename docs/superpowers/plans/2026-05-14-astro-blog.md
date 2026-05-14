# Braulio Blog — Astro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing HTML/CSS mockups into a fully static Astro blog deployed to a `/blog` subfolder on Hostinger shared hosting.

**Architecture:** Astro v5 SSG with MDX content collections. The existing `styles.css` is ported directly as `global.css` with no changes. Page-specific styles extracted from the HTML mockups are placed in `home.css` and `post.css` and imported in their respective pages. Utility functions in `src/lib/posts.ts` are unit-tested with Vitest. All other verification is via `npm run build`. Outputs to `dist/blog/` for FTP upload.

**Tech Stack:** Astro v5, @astrojs/mdx, TypeScript (strict), Vitest, Zod

---

## File Map

```
src/
├── content/
│   ├── config.ts                              ← Astro collection definition
│   ├── schema.ts                              ← Zod schema (importable in Vitest)
│   └── posts/
│       ├── the-brutalist-resurgence.mdx       ← seed post (featured)
│       ├── negative-space-as-structure.mdx    ← seed post
│       └── grid-systems-in-physical-space.mdx ← seed post
├── lib/
│   ├── posts.ts                               ← getPublishedPosts, getFeaturedPost, groupByCategory
│   └── posts.test.ts                          ← Vitest unit tests
├── components/
│   ├── layout/
│   │   ├── PageShell.astro     ← Reader <html> wrapper; imports global.css and Google Fonts
│   │   ├── AdminShell.astro    ← Admin <html> wrapper; imports admin.css and Bebas Neue/Geist
│   │   ├── SiteHeader.astro    ← Brand mark + nav (Journal / Archive / About)
│   │   └── SiteFooter.astro    ← Footer links + copyright year
│   ├── home/
│   │   ├── Hero.astro          ← Large Anton headline, tagline, meta row
│   │   ├── Marquee.astro       ← Animated scrolling text strip
│   │   ├── FeaturedPost.astro  ← 2fr+1fr featured card; receives PostEntry prop
│   │   ├── ArticleCard.astro   ← Single post card; receives PostEntry + index props
│   │   ├── CategoryIndex.astro ← "Index — By Category" list; counts from posts prop
│   │   └── NewsletterSignup.astro ← Dark block with Substack iframe embed
│   ├── post/
│   │   ├── PostSidebar.astro   ← Sticky sidebar: back link, meta block, TOC, share buttons
│   │   ├── TOC.astro           ← Table of contents; receives headings[] prop
│   │   └── ShareButtons.astro  ← Link / email / bookmark share buttons
│   ├── mdx/
│   │   ├── Dropcap.astro       ← Anton float-left first letter
│   │   ├── PullQuote.astro     ← Bordered blockquote with oversized open-quote mark
│   │   ├── HeroImage.astro     ← Full-width image with caption bar
│   │   └── TwinImage.astro     ← Side-by-side 1:1 image pair with figure captions
│   └── admin/
│       ├── StatCard.astro      ← Bento stat tile: eyebrow label + large number
│       ├── PostsTable.astro    ← Read-only posts list; title, status badge, category, date
│       └── ActivityFeed.astro  ← Recent posts sorted by date (title + status + date)
├── pages/
│   ├── index.astro             ← Homepage: Hero + Marquee + FeaturedPost + 3-col grid
│   ├── archive.astro           ← All non-draft posts grouped by category
│   ├── about.astro             ← Static about page
│   ├── admin/
│   │   └── index.astro         ← Read-only dashboard; includes drafts
│   └── posts/
│       └── [slug].astro        ← Post detail with PostSidebar + MDX content
└── styles/
    ├── global.css              ← Direct copy of existing styles.css (no changes)
    ├── home.css                ← Homepage layout styles (from index.html <style> block)
    ├── post.css                ← Post page styles (from post.html <style> block)
    └── admin.css               ← Admin styles (from admin.html <style> block)
```

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro` (placeholder, replaced in Task 7)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "braulio-blog",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^3.0.0",
    "zod": "^3.22.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://example.com',  // TODO: replace with your actual domain
  base: '/blog',
  output: 'static',
  integrations: [mdx()],
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Create `src/env.d.ts`**

```typescript
/// <reference types="astro/client" />
```

- [ ] **Step 6: Create placeholder `src/pages/index.astro`**

```astro
---
---
<html lang="en"><head><meta charset="utf-8" /><title>Braulio's Journal</title></head>
<body><h1>Coming soon</h1></body></html>
```

- [ ] **Step 7: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors in terminal output.

- [ ] **Step 8: Verify build succeeds**

```bash
npm run build
```

Expected: `dist/blog/index.html` created. No build errors.

- [ ] **Step 9: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json vitest.config.ts src/env.d.ts src/pages/index.astro
git commit -m "feat: scaffold Astro project"
```

---

## Task 2: Copy design system CSS and assets

**Files:**
- Create: `src/styles/global.css` (copy of `styles.css`)
- Create: `src/styles/home.css` (extracted from `index.html` `<style>` block)
- Create: `src/styles/post.css` (extracted from `post.html` `<style>` block)
- Create: `src/styles/admin.css` (extracted from `admin.html` `<style>` block)
- Copy: `assets/` → `public/assets/`

- [ ] **Step 1: Copy reader base CSS**

```bash
cp styles.css src/styles/global.css
```

- [ ] **Step 2: Extract homepage CSS**

Open `index.html`. Copy the entire contents of the `<style>` block (everything between `<style>` and `</style>` in the `<head>`) and save as `src/styles/home.css`.

The file should start with:
```css
/* Homepage-specific layout */
.home-hero {
  padding: 96px var(--pad-x);
```

- [ ] **Step 3: Extract post page CSS**

Open `post.html`. Copy the entire `<style>` block contents and save as `src/styles/post.css`.

The file should start with:
```css
.post-wrap {
  padding: 96px 40px 120px;
```

- [ ] **Step 4: Extract admin CSS**

Open `admin.html`. Copy the entire `<style>` block contents (lines 11–622) and save as `src/styles/admin.css`.

The file should start with:
```css
/* Admin palette — straight from DESIGN.md */
:root {
  --fg:        #1a1918;
```

- [ ] **Step 5: Copy assets to `public/`**

```bash
mkdir -p public/assets
cp assets/*.png assets/*.svg public/assets/ 2>/dev/null; true
```

- [ ] **Step 6: Verify**

```bash
ls public/assets/
```

Expected output includes: `feature-monolith.png`, `post-hero.png`, `shadows.png`, `post-detail-1.png`, `post-detail-2.png`, `logo-mark.svg` and the icon SVGs.

- [ ] **Step 7: Commit**

```bash
git add src/styles/ public/assets/
git commit -m "feat: add design system CSS and static assets"
```

---

## Task 3: Content schema, utility functions, and seed posts

**Files:**
- Create: `src/content/schema.ts`
- Create: `src/content/config.ts`
- Create: `src/lib/posts.ts`
- Create: `src/lib/posts.test.ts`
- Create: `src/content/posts/the-brutalist-resurgence.mdx`
- Create: `src/content/posts/negative-space-as-structure.mdx`
- Create: `src/content/posts/grid-systems-in-physical-space.mdx`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/posts.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getPublishedPosts, getFeaturedPost, groupByCategory } from './posts';

function makePost(overrides: {
  slug?: string;
  draft?: boolean;
  featured?: boolean;
  category?: string;
  date?: Date;
} = {}) {
  return {
    slug: overrides.slug ?? 'test-post',
    data: {
      title: 'Test Post',
      deck: 'A test deck.',
      date: overrides.date ?? new Date('2024-10-14'),
      issue: 'No. 04',
      category: overrides.category ?? 'Architecture',
      tags: [] as string[],
      readTime: 5,
      featured: overrides.featured ?? false,
      draft: overrides.draft ?? false,
    },
  };
}

describe('getPublishedPosts', () => {
  it('excludes draft posts', () => {
    const posts = [makePost({ slug: 'draft-post', draft: true }), makePost({ slug: 'live-post' })];
    const result = getPublishedPosts(posts);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('live-post');
  });

  it('sorts by date descending', () => {
    const posts = [
      makePost({ slug: 'older', date: new Date('2024-01-01') }),
      makePost({ slug: 'newer', date: new Date('2024-12-01') }),
    ];
    const result = getPublishedPosts(posts);
    expect(result[0].slug).toBe('newer');
    expect(result[1].slug).toBe('older');
  });

  it('returns empty array when all are drafts', () => {
    expect(getPublishedPosts([makePost({ draft: true })])).toHaveLength(0);
  });
});

describe('getFeaturedPost', () => {
  it('returns the post marked featured: true', () => {
    const posts = [makePost({ slug: 'regular' }), makePost({ slug: 'hero', featured: true })];
    expect(getFeaturedPost(posts)?.slug).toBe('hero');
  });

  it('falls back to most recent non-draft post when none is marked featured', () => {
    const posts = [
      makePost({ slug: 'older', date: new Date('2024-01-01') }),
      makePost({ slug: 'newer', date: new Date('2024-12-01') }),
    ];
    expect(getFeaturedPost(posts)?.slug).toBe('newer');
  });

  it('returns undefined for empty array', () => {
    expect(getFeaturedPost([])).toBeUndefined();
  });
});

describe('groupByCategory', () => {
  it('groups posts by their category field', () => {
    const posts = [
      makePost({ slug: 'a1', category: 'Architecture' }),
      makePost({ slug: 'fn', category: 'Field Notes' }),
      makePost({ slug: 'a2', category: 'Architecture' }),
    ];
    const result = groupByCategory(posts);
    expect(result['Architecture']).toHaveLength(2);
    expect(result['Field Notes']).toHaveLength(1);
  });

  it('returns empty object for empty input', () => {
    expect(groupByCategory([])).toEqual({});
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test
```

Expected: FAIL — `Cannot find module './posts'`

- [ ] **Step 3: Create `src/content/schema.ts`**

```typescript
import { z } from 'zod';

export const postSchema = z.object({
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
});

export type PostData = z.infer<typeof postSchema>;
```

- [ ] **Step 4: Create `src/content/config.ts`**

```typescript
import { defineCollection } from 'astro:content';
import { postSchema } from './schema';

const posts = defineCollection({
  type: 'content',
  schema: postSchema,
});

export const collections = { posts };
```

- [ ] **Step 5: Create `src/lib/posts.ts`**

```typescript
import type { PostData } from '../content/schema';

export type PostEntry = {
  slug: string;
  data: PostData;
};

export function getPublishedPosts(posts: PostEntry[]): PostEntry[] {
  return posts
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getFeaturedPost(posts: PostEntry[]): PostEntry | undefined {
  const published = getPublishedPosts(posts);
  return published.find(p => p.data.featured) ?? published[0];
}

export function groupByCategory(posts: PostEntry[]): Record<string, PostEntry[]> {
  return posts.reduce<Record<string, PostEntry[]>>((acc, post) => {
    const cat = post.data.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(post);
    return acc;
  }, {});
}
```

- [ ] **Step 6: Run tests — expect all pass**

```bash
npm test
```

Expected:
```
✓ src/lib/posts.test.ts (8 tests)
Test Files  1 passed
Tests       8 passed
```

- [ ] **Step 7: Create seed post — The Brutalist Resurgence**

Create `src/content/posts/the-brutalist-resurgence.mdx`:

```mdx
---
title: "The Brutalist Resurgence"
deck: "Concrete is back — and this time, it isn't apologising. A field report on why a generation of architects, photographers, and quiet city walkers have started paying attention to the unloved bones of the post-war city."
date: 2024-10-14
issue: "No. 04"
category: "Architecture"
tags: ["Brutalism", "Architecture"]
readTime: 9
heroImage: "/blog/assets/post-hero.png"
heroCaption: "Fig. 01 · Kessler Foundation, North Facade · Photo · B.A."
featured: true
draft: false
---

import HeroImage from '../../components/mdx/HeroImage.astro';
import PullQuote from '../../components/mdx/PullQuote.astro';
import TwinImage from '../../components/mdx/TwinImage.astro';
import Dropcap from '../../components/mdx/Dropcap.astro';

<HeroImage src="/blog/assets/post-hero.png" caption="Fig. 01 · Kessler Foundation, North Facade" credit="Photo · B.A." />

<Dropcap>T</Dropcap>he philosophy of brutalism was never merely about concrete; it was an ethical stance. It demanded that a building reveal its structural truths rather than hide behind decorative veneers. Today's practitioners are rediscovering this ethos, applying it not just to municipal structures but to high-end residential and commercial spaces.

<PullQuote cite="Field notebook, March 2024">
  To design without ornament is to strip away the falsehoods. What remains is the pure dialogue between space, light, and gravity.
</PullQuote>

Consider the recent unveiling of the Kessler Foundation headquarters. The architects eschewed traditional cladding entirely, opting instead for structural elements that perform dual roles as both support and aesthetic focus.

## II. The Grid as Canvas

Within this paradigm, the grid becomes the supreme organising principle. It is not something to be concealed, but celebrated. By exposing the structural framework, designers create a visual rhythm that grounds the occupant.

<TwinImage
  left="/blog/assets/post-detail-1.png"
  leftCaption="Fig. 02 · Poured Seam, Detail"
  right="/blog/assets/post-detail-2.png"
  rightCaption="Fig. 03 · Columnar Rhythm"
/>

## III. Field Notes & Details

What is striking, walking these buildings, is how loud silence can be. Concrete absorbs and returns sound differently than glass. A footstep in a Le Corbusier stairwell does not echo so much as it confesses.

## IV. What Comes Next

As we move forward, this brutalist resurgence challenges us to reconsider what we define as 'premium.' It suggests that true luxury lies not in applied decoration, but in the masterful execution of essential forms.
```

- [ ] **Step 8: Create seed post — Negative Space as Structure**

Create `src/content/posts/negative-space-as-structure.mdx`:

```mdx
---
title: "Negative Space as Structure"
deck: "How emptiness defines the room. An exploration of minimalist interiors where the void acts as the primary architectural feature."
date: 2024-10-09
issue: "No. 04"
category: "Interiors"
tags: ["Interiors", "Minimalism"]
readTime: 6
featured: false
draft: false
---

import Dropcap from '../../components/mdx/Dropcap.astro';

<Dropcap>T</Dropcap>here is a particular kind of courage required to leave a room half-empty. To choose a single object — a bench, a shaft of afternoon light, the long shadow of a window frame on whitewash — and trust that this is enough.

## I. The Architecture of Absence

The best minimalist interiors are not stripped of everything. They are stripped of everything inessential. What remains is a kind of concentrated presence: the room has weight, character, a sense of purpose, without needing to announce it.

## II. Learning to Read the Void

Walk into a room where negative space has been considered carefully and something shifts in the body before the mind catches up. The shoulders drop. The breath slows.

## III. Emptiness as Practice

To design with absence is, ultimately, to design for attention. The empty room asks something of its occupant: presence, slowness, a willingness to be still.
```

- [ ] **Step 9: Create seed post — Grid Systems in Physical Space**

Create `src/content/posts/grid-systems-in-physical-space.mdx`:

```mdx
---
title: "Grid Systems in Physical Space"
deck: "Translating Swiss graphic design principles into urban planning and domestic architecture. Strict alignment over organic flow."
date: 2024-09-25
issue: "No. 04"
category: "Systems"
tags: ["Systems", "Design"]
readTime: 7
featured: false
draft: false
---

import Dropcap from '../../components/mdx/Dropcap.astro';

<Dropcap>T</Dropcap>he grid is not a cage. Applied well, it is a language — a shared set of proportional relationships that allows complex arrangements to remain legible.

## I. The Typographic City

When Josef Müller-Brockmann laid out a poster, he was solving the same problem that a city planner faces when laying out a block: how to create visual order across a field without eliminating surprise.

## II. The Domestic Grid

At a smaller scale, the grid manifests in the proportions of a room — the relationship between window width and wall length, between tile and floor area, between the spacing of shelves and the volumes they hold.

## III. Against Organic Flow

There is a contemporary bias toward organic, asymmetric spatial arrangements. But it is worth asking what we lose when we abandon the grid entirely: a certain calm, a certain confidence, a sense that the space was designed with care.
```

- [ ] **Step 10: Run build to verify content collection parses all posts**

```bash
npm run build
```

Expected: Build succeeds. No type errors from content collection. `dist/blog/` created with `index.html`.

- [ ] **Step 11: Commit**

```bash
git add src/content/ src/lib/
git commit -m "feat: content schema, post utilities with tests, and 3 seed posts"
```

---

## Task 4: Layout components

**Files:**
- Create: `src/components/layout/PageShell.astro`
- Create: `src/components/layout/AdminShell.astro`
- Create: `src/components/layout/SiteHeader.astro`
- Create: `src/components/layout/SiteFooter.astro`

- [ ] **Step 1: Create `src/components/layout/PageShell.astro`**

```astro
---
import '../../styles/global.css';

interface Props {
  title: string;
  description?: string;
}
const { title, description = 'A working notebook by Braulio.' } = Astro.props;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{title} — Braulio's Journal</title>
  <meta name="description" content={description} />
  <meta name="viewport" content="width=1280" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:ital,wght@0,400;0,500;0,700;1,400&display=swap"
    rel="stylesheet"
  />
</head>
<body>
  <main class="page">
    <slot />
  </main>
</body>
</html>
```

- [ ] **Step 2: Create `src/components/layout/AdminShell.astro`**

```astro
---
import '../../styles/admin.css';

interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{title} — Admin</title>
  <meta name="viewport" content="width=1440" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Geist:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 3: Create `src/components/layout/SiteHeader.astro`**

```astro
---
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const { pathname } = Astro.url;

function isActive(href: string): boolean {
  if (href === `${base}/`) return pathname === `${base}/` || pathname === base;
  return pathname.startsWith(href);
}
---
<header class="site-header">
  <div class="site-header__inner">
    <div class="brand">
      <div class="brand__mark" aria-hidden="true"></div>
      <a href={`${base}/`} class="brand__name">Braulio&rsquo;s Journal</a>
    </div>
    <nav class="nav">
      <a href={`${base}/`}        class:list={[{ 'is-active': isActive(`${base}/`) }]}>Journal</a>
      <a href={`${base}/archive`} class:list={[{ 'is-active': isActive(`${base}/archive`) }]}>Archive</a>
      <a href={`${base}/about`}   class:list={[{ 'is-active': isActive(`${base}/about`) }]}>About</a>
    </nav>
  </div>
</header>
```

- [ ] **Step 4: Create `src/components/layout/SiteFooter.astro`**

```astro
---
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
---
<footer class="site-footer">
  <div class="foot-mark" aria-hidden="true"></div>
  <div class="foot-links">
    <a href={`${base}/about`}>About</a>
    <a href={`${base}/about#colophon`}>Colophon</a>
    <a href="#">RSS</a>
  </div>
  <div class="foot-copy">© {new Date().getFullYear()} Braulio &middot; All rights reserved</div>
</footer>
```

- [ ] **Step 5: Update placeholder `src/pages/index.astro` to use layout**

```astro
---
import PageShell from '../components/layout/PageShell.astro';
import SiteHeader from '../components/layout/SiteHeader.astro';
import SiteFooter from '../components/layout/SiteFooter.astro';
---
<PageShell title="Journal">
  <SiteHeader />
  <SiteFooter />
</PageShell>
```

- [ ] **Step 6: Run build to verify layout renders**

```bash
npm run build
```

Expected: Build succeeds. Open `dist/blog/index.html` and confirm it contains `<header class="site-header">` and `<footer class="site-footer">`.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/ src/pages/index.astro
git commit -m "feat: add layout shell components (PageShell, AdminShell, SiteHeader, SiteFooter)"
```

---

## Task 5: MDX components

**Files:**
- Create: `src/components/mdx/Dropcap.astro`
- Create: `src/components/mdx/PullQuote.astro`
- Create: `src/components/mdx/HeroImage.astro`
- Create: `src/components/mdx/TwinImage.astro`

- [ ] **Step 1: Create `src/components/mdx/Dropcap.astro`**

```astro
---
---
<span class="dropcap"><slot /></span>
```

The `.dropcap` class is defined in `post.css` (float-left Anton letter).

- [ ] **Step 2: Create `src/components/mdx/PullQuote.astro`**

```astro
---
interface Props {
  cite?: string;
}
const { cite } = Astro.props;
---
<blockquote>
  <slot />
  {cite && <cite>— {cite}</cite>}
</blockquote>
```

The `blockquote` styles (border, oversized open-quote `::before`) are in `post.css`.

- [ ] **Step 3: Create `src/components/mdx/HeroImage.astro`**

```astro
---
interface Props {
  src: string;
  caption: string;
  credit?: string;
}
const { src, caption, credit } = Astro.props;
---
<div class="hero-img" style={`background-image: url('${src}');`}>
  <div class="hero-img__cap">
    <span>{caption}</span>
    {credit && <span>{credit}</span>}
  </div>
</div>
```

- [ ] **Step 4: Create `src/components/mdx/TwinImage.astro`**

```astro
---
interface Props {
  left: string;
  leftCaption: string;
  right: string;
  rightCaption: string;
}
const { left, leftCaption, right, rightCaption } = Astro.props;
---
<div class="twin-img">
  <div style={`background-image: url('${left}');`}></div>
  <div style={`background-image: url('${right}');`}></div>
</div>
<div class="figure-row">
  <span>{leftCaption}</span>
  <span>{rightCaption}</span>
</div>
```

- [ ] **Step 5: Run build to verify MDX components compile**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/mdx/
git commit -m "feat: add MDX components (Dropcap, PullQuote, HeroImage, TwinImage)"
```

---

## Task 6: Home page components

**Files:**
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/Marquee.astro`
- Create: `src/components/home/FeaturedPost.astro`
- Create: `src/components/home/ArticleCard.astro`
- Create: `src/components/home/CategoryIndex.astro`
- Create: `src/components/home/NewsletterSignup.astro`

- [ ] **Step 1: Create `src/components/home/Hero.astro`**

```astro
---
---
<section class="home-hero">
  <h1>
    Field<br />
    Notes <span class="amp">&amp;</span> Structures
  </h1>
  <p class="home-hero__sub">
    A working notebook by Braulio &mdash; observations on architecture, brutalist design,
    the structural integrity of everyday objects, and the small rituals that hold a working day together.
  </p>
  <div class="home-hero__meta">
    <span>Issue No. 04</span>
    <span>Updated Weekly</span>
    <span>Est. 2023</span>
  </div>
</section>
```

- [ ] **Step 2: Create `src/components/home/Marquee.astro`**

```astro
---
---
<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    <span>Now reading <span class="dot"></span> The Concrete Monolith <span class="dot"></span> Negative Space <span class="dot"></span> Grid Systems <span class="dot"></span> The Weight of Shadows <span class="dot"></span> Aesthetics of Utility <span class="dot"></span></span>
    <span>Now reading <span class="dot"></span> The Concrete Monolith <span class="dot"></span> Negative Space <span class="dot"></span> Grid Systems <span class="dot"></span> The Weight of Shadows <span class="dot"></span> Aesthetics of Utility <span class="dot"></span></span>
  </div>
</div>
```

- [ ] **Step 3: Create `src/components/home/FeaturedPost.astro`**

```astro
---
import type { PostEntry } from '../../lib/posts';

interface Props {
  post: PostEntry;
}
const { post } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const href = `${base}/posts/${post.slug}`;
const date = post.data.date.toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric',
});
---
<section class="featured">
  <a
    href={href}
    class="featured__media"
    aria-label={`${post.data.title} — featured post`}
    style={post.data.heroImage ? `background-image: url('${post.data.heroImage}');` : ''}
  ></a>
  <div class="featured__body">
    <div>
      <div class="featured__kicker">{post.data.category}</div>
      <h2 class="featured__title">{post.data.title}</h2>
      <p class="featured__excerpt">{post.data.deck}</p>
    </div>
    <div class="featured__foot">
      <span class="featured__date">{date}</span>
      <a href={href} class="featured__cta">Read</a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Create `src/components/home/ArticleCard.astro`**

```astro
---
import type { PostEntry } from '../../lib/posts';

interface Props {
  post: PostEntry;
  index: number;
}
const { post, index } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const href = `${base}/posts/${post.slug}`;
const num = String(index + 1).padStart(2, '0');
const date = post.data.date.toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric',
});
---
<article class="article-card">
  <span class="article-card__num">{num}</span>
  <span class="article-card__kicker">{post.data.category}</span>
  <h3 class="article-card__title">
    <a href={href}>{post.data.title}</a>
  </h3>
  <p class="article-card__excerpt">{post.data.deck}</p>
  <div class="article-card__foot">
    <span class="article-card__date">{date}</span>
    <a href={href} class="readmore">
      Read more
      <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path class="arrow-line" d="M0 5h9M5 1l4 4-4 4" stroke="currentColor" stroke-width="1.4" />
      </svg>
    </a>
  </div>
</article>
```

- [ ] **Step 5: Create `src/components/home/CategoryIndex.astro`**

```astro
---
import type { PostEntry } from '../../lib/posts';
import { groupByCategory, getPublishedPosts } from '../../lib/posts';

interface Props {
  posts: PostEntry[];
}
const { posts } = Astro.props;
const published = getPublishedPosts(posts);
const grouped = groupByCategory(published);
const categories = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
---
<div class="index">
  <div class="index__title">Index &mdash; By Category</div>
  <ul class="index__list">
    {categories.map(([name, items], i) => (
      <li>
        <span>{String(i + 1).padStart(2, '0')} &middot; {name}</span>
        <span class="count">{String(items.length).padStart(2, '0')}</span>
      </li>
    ))}
  </ul>
</div>
```

- [ ] **Step 6: Create `src/components/home/NewsletterSignup.astro`**

```astro
---
---
<div class="newsletter">
  <h3>Dispatches.</h3>
  <p>Notes from the desk. Bi&#8209;weekly. No fluff &mdash; just structure, shadow, and the occasional photograph.</p>
  <iframe
    src="https://YOURHANDLE.substack.com/embed"
    width="100%"
    height="150"
    frameborder="0"
    scrolling="no"
    title="Subscribe to Dispatches"
  ></iframe>
</div>
```

**⚠️ Action required:** Replace `YOURHANDLE` with your actual Substack handle before deploying. You can find it at `https://substack.com/profile/edit` → Your Substack URL.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/
git commit -m "feat: add home page components"
```

---

## Task 7: Homepage

**Files:**
- Modify: `src/pages/index.astro` (replace placeholder with full homepage)

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import '../styles/home.css';
import { getCollection } from 'astro:content';
import PageShell from '../components/layout/PageShell.astro';
import SiteHeader from '../components/layout/SiteHeader.astro';
import SiteFooter from '../components/layout/SiteFooter.astro';
import Hero from '../components/home/Hero.astro';
import Marquee from '../components/home/Marquee.astro';
import FeaturedPost from '../components/home/FeaturedPost.astro';
import ArticleCard from '../components/home/ArticleCard.astro';
import NewsletterSignup from '../components/home/NewsletterSignup.astro';
import CategoryIndex from '../components/home/CategoryIndex.astro';
import { getPublishedPosts, getFeaturedPost } from '../lib/posts';

const allPosts = await getCollection('posts');
const published = getPublishedPosts(allPosts);
const featured = getFeaturedPost(allPosts);
const gridPosts = published.filter(p => p.slug !== featured?.slug).slice(0, 6);

const col1 = gridPosts.filter((_, i) => i % 2 === 0);
const col2 = gridPosts.filter((_, i) => i % 2 === 1);
---

<PageShell title="Journal">
  <SiteHeader />
  <Hero />
  <Marquee />
  {featured && <FeaturedPost post={featured} />}
  <section class="grid-3">
    <div class="col">
      {col1.map((post, i) => <ArticleCard post={post} index={i * 2} />)}
    </div>
    <div class="col">
      {col2.map((post, i) => <ArticleCard post={post} index={i * 2 + 1} />)}
    </div>
    <aside class="col sidebar">
      <NewsletterSignup />
      <CategoryIndex posts={allPosts} />
    </aside>
  </section>
  <SiteFooter />
</PageShell>
```

**Note:** The `import '../../src/styles/home.css'` path is wrong — fix it to `import '../styles/home.css'` (the file is at `src/pages/index.astro`, so the styles are one level up).

Correct import line:
```astro
---
import '../styles/home.css';
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds. `dist/blog/index.html` exists and is non-trivial in size (> 5 KB).

- [ ] **Step 3: Spot-check the output HTML**

```bash
grep -c "article-card" dist/blog/index.html
```

Expected: a number > 0 (one match per post card rendered).

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: homepage with featured post and 3-column article grid"
```

---

## Task 8: Post detail components and page

**Files:**
- Create: `src/components/post/TOC.astro`
- Create: `src/components/post/ShareButtons.astro`
- Create: `src/components/post/PostSidebar.astro`
- Create: `src/pages/posts/[slug].astro`

- [ ] **Step 1: Create `src/components/post/TOC.astro`**

```astro
---
interface Heading {
  depth: number;
  slug: string;
  text: string;
}
interface Props {
  headings: Heading[];
}
const { headings } = Astro.props;
const h2s = headings.filter(h => h.depth === 2);
---
{h2s.length > 0 && (
  <div class="toc">
    <span class="toc__label">In this entry</span>
    <ul class="toc__list">
      {h2s.map((h, i) => (
        <li>
          <a href={`#${h.slug}`}>
            <span class="n">{['I','II','III','IV','V','VI'][i] ?? String(i + 1)}</span>
            <span>{h.text.replace(/^[IVX]+\.\s*/, '')}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
)}
```

- [ ] **Step 2: Create `src/components/post/ShareButtons.astro`**

```astro
---
interface Props {
  url: string;
  title: string;
}
const { url, title } = Astro.props;
const encoded = encodeURIComponent(url);
const emailSubject = encodeURIComponent(`Read: ${title}`);
---
<div class="share">
  <span class="share__label">Share</span>
  <div class="share__row">
    <button
      class="share__btn"
      aria-label="Copy link"
      title="Copy link"
      onclick={`navigator.clipboard.writeText('${url}').then(() => this.title='Copied!')`}
    >
      <svg viewBox="0 0 20 10" fill="none">
        <path d="M5 0a5 5 0 0 0 0 10h2v-2H5a3 3 0 1 1 0-6h2V0H5Zm10 0h-2v2h2a3 3 0 1 1 0 6h-2v2h2a5 5 0 0 0 0-10ZM6 4h8v2H6V4Z" fill="currentColor"/>
      </svg>
    </button>
    <a
      class="share__btn"
      href={`mailto:?subject=${emailSubject}&body=${encoded}`}
      aria-label="Share via email"
    >
      <svg viewBox="0 0 20 16" fill="none">
        <path d="M2 0h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Zm0 4v10h16V4l-8 5L2 4Zm0-2 8 5 8-5H2Z" fill="currentColor"/>
      </svg>
    </a>
  </div>
</div>
```

- [ ] **Step 3: Create `src/components/post/PostSidebar.astro`**

```astro
---
import TOC from './TOC.astro';
import ShareButtons from './ShareButtons.astro';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}
interface Props {
  date: Date;
  readTime: number;
  category: string;
  issue: string;
  headings: Heading[];
  postUrl: string;
  postTitle: string;
}
const { date, readTime, category, issue, headings, postUrl, postTitle } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
---
<aside class="post-sidebar">
  <a class="back-link" href={`${base}/`}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path class="arrow-line" d="M10 5H1M5 9 1 5l4-4" stroke="currentColor" stroke-width="1.4"/>
    </svg>
    Back to Journal
  </a>

  <div class="meta-block">
    <div class="meta-row">
      <span class="meta-row__label">Published</span>
      <span class="meta-row__value">{formatted}</span>
    </div>
    <div class="meta-row">
      <span class="meta-row__label">Read time</span>
      <span class="meta-row__value">{readTime} min</span>
    </div>
    <div class="meta-row">
      <span class="meta-row__label">Category</span>
      <span class="meta-row__value">{category}</span>
    </div>
    <div class="meta-row">
      <span class="meta-row__label">Issue</span>
      <span class="meta-row__value">{issue}</span>
    </div>
  </div>

  <TOC headings={headings} />
  <ShareButtons url={postUrl} title={postTitle} />
</aside>
```

- [ ] **Step 4: Create `src/pages/posts/[slug].astro`**

```astro
---
import '../../styles/post.css';
import { getCollection } from 'astro:content';
import PageShell from '../../components/layout/PageShell.astro';
import SiteHeader from '../../components/layout/SiteHeader.astro';
import SiteFooter from '../../components/layout/SiteFooter.astro';
import PostSidebar from '../../components/post/PostSidebar.astro';
import Dropcap from '../../components/mdx/Dropcap.astro';
import PullQuote from '../../components/mdx/PullQuote.astro';
import HeroImage from '../../components/mdx/HeroImage.astro';
import TwinImage from '../../components/mdx/TwinImage.astro';
import { getPublishedPosts } from '../../lib/posts';

export async function getStaticPaths() {
  const allPosts = await getCollection('posts');
  return getPublishedPosts(allPosts).map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();

const site = import.meta.env.SITE ?? 'https://example.com';
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const postUrl = `${site}${base}/posts/${post.slug}`;

const allPosts = await getCollection('posts');
const published = getPublishedPosts(allPosts);
const currentIndex = published.findIndex(p => p.slug === post.slug);
const nextPost = published[currentIndex + 1];
---
<PageShell title={post.data.title} description={post.data.deck}>
  <SiteHeader />
  <div class="post-wrap">
    <PostSidebar
      date={post.data.date}
      readTime={post.data.readTime}
      category={post.data.category}
      issue={post.data.issue}
      headings={headings}
      postUrl={postUrl}
      postTitle={post.data.title}
    />
    <article class="post-body">
      <div class="post-eyebrow">
        <span class="pill pill--solid">{post.data.readTime} min read</span>
        <span class="pill">{post.data.category}</span>
        <span>{post.data.issue}</span>
      </div>
      <h1 class="post-title">{post.data.title}</h1>
      <p class="post-deck">{post.data.deck}</p>
      <Content components={{ Dropcap, PullQuote, HeroImage, TwinImage }} />
      {nextPost && (
        <div class="post-outro">
          <span class="post-outro__label">Next entry</span>
          <a href={`${base}/posts/${nextPost.slug}`} class="post-outro__next">
            {nextPost.data.title}
            <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M0 5h9M5 1l4 4-4 4" stroke="currentColor" stroke-width="1.4"/>
            </svg>
          </a>
        </div>
      )}
    </article>
  </div>
  <SiteFooter />
</PageShell>
```

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: Build succeeds. `dist/blog/posts/the-brutalist-resurgence/index.html` exists.

- [ ] **Step 6: Spot-check post output**

```bash
grep -c "post-title" dist/blog/posts/the-brutalist-resurgence/index.html
```

Expected: `1` (the `post-title` class appears once).

- [ ] **Step 7: Commit**

```bash
git add src/components/post/ src/pages/posts/
git commit -m "feat: post detail page with sidebar, TOC, and MDX component wiring"
```

---

## Task 9: Archive page

**Files:**
- Create: `src/pages/archive.astro`

- [ ] **Step 1: Create `src/pages/archive.astro`**

```astro
---
import '../styles/home.css';
import { getCollection } from 'astro:content';
import PageShell from '../components/layout/PageShell.astro';
import SiteHeader from '../components/layout/SiteHeader.astro';
import SiteFooter from '../components/layout/SiteFooter.astro';
import ArticleCard from '../components/home/ArticleCard.astro';
import { getPublishedPosts, groupByCategory } from '../lib/posts';

const allPosts = await getCollection('posts');
const published = getPublishedPosts(allPosts);
const grouped = groupByCategory(published);
const categories = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
---
<PageShell title="Archive">
  <SiteHeader />
  <section class="home-hero">
    <h1>Archive</h1>
    <p class="home-hero__sub">{published.length} entries &mdash; sorted by category.</p>
  </section>

  {categories.map(([name, posts]) => (
    <section>
      <div class="index__title" style="padding: 24px var(--pad-x) 16px; border-bottom: 1px solid var(--line);">
        {name} <span style="opacity: 0.45; font-size: 10px; margin-left: 16px;">{posts.length} entries</span>
      </div>
      <div class="index__list" style="padding: 0 var(--pad-x);">
        {posts.map((post, i) => {
          const date = post.data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          return (
            <a
              href={`${base}/posts/${post.slug}`}
              style="display: grid; grid-template-columns: 1fr auto auto; align-items: baseline; padding: 20px 0; border-bottom: 1px solid var(--line); font-family: 'Anton', sans-serif; font-size: 32px; letter-spacing: -0.01em; text-transform: uppercase; text-decoration: none; color: inherit;"
            >
              <span>{post.data.title}</span>
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.1em; margin-right: 32px; opacity: 0.55;">{post.data.category}</span>
              <span style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.1em;">{date}</span>
            </a>
          );
        })}
      </div>
    </section>
  ))}

  <SiteFooter />
</PageShell>
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds. `dist/blog/archive/index.html` exists.

- [ ] **Step 3: Spot-check**

```bash
grep -c "Anton" dist/blog/archive/index.html
```

Expected: number > 0 (font family referenced in inline styles).

- [ ] **Step 4: Commit**

```bash
git add src/pages/archive.astro
git commit -m "feat: archive page grouped by category"
```

---

## Task 10: About page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import '../styles/post.css';
import PageShell from '../components/layout/PageShell.astro';
import SiteHeader from '../components/layout/SiteHeader.astro';
import SiteFooter from '../components/layout/SiteFooter.astro';
---
<PageShell title="About" description="About Braulio's Journal — a working notebook on architecture, design, and the structural honesty of everyday objects.">
  <SiteHeader />
  <div class="post-wrap">
    <aside class="post-sidebar">
      <div class="meta-block">
        <div class="meta-row">
          <span class="meta-row__label">Author</span>
          <span class="meta-row__value">Braulio</span>
        </div>
        <div class="meta-row">
          <span class="meta-row__label">Est.</span>
          <span class="meta-row__value">2023</span>
        </div>
        <div class="meta-row">
          <span class="meta-row__label">Frequency</span>
          <span class="meta-row__value">Weekly</span>
        </div>
      </div>
    </aside>
    <article class="post-body">
      <h1 class="post-title">About</h1>
      <p class="post-deck">
        A working notebook on architecture, brutalist design, and the structural honesty of everyday objects.
      </p>
      <p>
        This journal is a place to think out loud about buildings, materials, grids, and the quiet rituals
        that structure a working day. It is written by Braulio — designer, occasional walker of stairwells,
        and close reader of concrete.
      </p>
      <p>
        Posts appear weekly, more or less. The newsletter edition goes out bi-weekly to subscribers.
      </p>
      <h2 id="colophon"><span class="num">I.</span>Colophon</h2>
      <p>
        Built with <a href="https://astro.build">Astro</a>. Type set in Anton and Montserrat.
        Design system documented in <code>DESIGN.md</code>. Hosted on Hostinger.
      </p>
    </article>
  </div>
  <SiteFooter />
</PageShell>
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds. `dist/blog/about/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: about page with colophon"
```

---

## Task 11: Admin dashboard

**Files:**
- Create: `src/components/admin/StatCard.astro`
- Create: `src/components/admin/PostsTable.astro`
- Create: `src/components/admin/ActivityFeed.astro`
- Create: `src/pages/admin/index.astro`

- [ ] **Step 1: Create `src/components/admin/StatCard.astro`**

```astro
---
interface Props {
  label: string;
  value: string | number;
  sub?: string;
}
const { label, value, sub } = Astro.props;
---
<section class="stat">
  <div class="card-title-row">
    <h3>{label}</h3>
    {sub && <span class="eyebrow">{sub}</span>}
  </div>
  <div class="v">{value}</div>
</section>
```

- [ ] **Step 2: Create `src/components/admin/PostsTable.astro`**

```astro
---
import type { PostEntry } from '../../lib/posts';

interface Props {
  posts: PostEntry[];
}
const { posts } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function statusClass(draft: boolean) {
  return draft ? 'badge--draft' : 'badge--published';
}
function statusLabel(draft: boolean) {
  return draft ? 'Draft' : 'Published';
}
---
<section class="posts" style="grid-column: span 9;">
  <div class="card-title-row">
    <h3>Posts</h3>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th class="col-title">Title</th>
        <th class="col-status">Status</th>
        <th class="col-cat">Category</th>
        <th class="col-date">Date</th>
      </tr>
    </thead>
    <tbody>
      {posts.map(post => {
        const date = post.data.date.toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        });
        return (
          <tr>
            <td class="col-title">
              <div class="title-cell">
                <strong>{post.data.title}</strong>
                <span class="slug">/{post.slug}</span>
              </div>
            </td>
            <td class="col-status">
              <span class={`badge ${statusClass(post.data.draft)}`}>
                <span class="dot"></span>
                {statusLabel(post.data.draft)}
              </span>
            </td>
            <td class="col-cat">{post.data.category}</td>
            <td class="col-date">{date}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</section>
```

- [ ] **Step 3: Create `src/components/admin/ActivityFeed.astro`**

```astro
---
import type { PostEntry } from '../../lib/posts';

interface Props {
  posts: PostEntry[];
}
const { posts } = Astro.props;
const recent = [...posts]
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 6);
---
<section class="activity" style="grid-column: span 3;">
  <div class="card-title-row">
    <h3>Recent</h3>
  </div>
  {recent.map(post => {
    const date = post.data.date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short',
    });
    return (
      <div class="item">
        <div class="stem">
          <div class={`pip ${post.data.draft ? '' : 'dot'}`}></div>
        </div>
        <div class="body">
          <strong>{post.data.draft ? 'Draft' : 'Published'}</strong>{' '}
          <span class="ref">{post.slug}</span>
        </div>
        <time>{date}</time>
      </div>
    );
  })}
</section>
```

- [ ] **Step 4: Create `src/pages/admin/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import AdminShell from '../../components/layout/AdminShell.astro';
import StatCard from '../../components/admin/StatCard.astro';
import PostsTable from '../../components/admin/PostsTable.astro';
import ActivityFeed from '../../components/admin/ActivityFeed.astro';
import { getPublishedPosts } from '../../lib/posts';

const allPosts = await getCollection('posts');
const published = getPublishedPosts(allPosts);
const drafts = allPosts.filter(p => p.data.draft);
const totalReadTime = published.reduce((sum, p) => sum + p.data.readTime, 0);
---
<AdminShell title="Dashboard">
  <div class="shell">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="mark">LUMINA</span>
        <span class="v">blog</span>
      </div>
      <div class="nav-group">
        <div class="nav-group__title">Content</div>
        <a class="nav-item is-active" href="#">Dashboard</a>
        <a class="nav-item" href="#">Posts <span class="count">{published.length}</span></a>
        <a class="nav-item" href="#">Drafts <span class="count">{drafts.length}</span></a>
      </div>
      <div class="sidebar__foot">
        <div class="avatar">B</div>
        <div class="who">
          <strong>Braulio</strong>
          <span>Owner</span>
        </div>
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <h1>Dashboard</h1>
          <div class="crumbs">Workspace / <strong>Dashboard</strong></div>
        </div>
        <div class="grow"></div>
        <span class="eyebrow" style="color: var(--muted-fg);">Read-only · Last built: {new Date().toLocaleDateString()}</span>
      </header>
      <section class="bento">
        <StatCard label="Published" value={published.length} sub="All time" />
        <StatCard label="Drafts" value={drafts.length} sub="Unpublished" />
        <StatCard label="Read time" value={`${totalReadTime} min`} sub="Total published" />
        <PostsTable posts={allPosts} />
        <ActivityFeed posts={allPosts} />
      </section>
    </main>
  </div>
</AdminShell>
```

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: Build succeeds. `dist/blog/admin/index.html` exists.

- [ ] **Step 6: Spot-check admin output**

```bash
grep "Published" dist/blog/admin/index.html | head -3
```

Expected: lines containing "Published" from the stat card and table.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/ src/pages/admin/
git commit -m "feat: read-only admin dashboard"
```

---

## Task 12: Final build verification

- [ ] **Step 1: Run full build and tests**

```bash
npm test && npm run build
```

Expected:
```
✓ src/lib/posts.test.ts (8 tests)
Test Files  1 passed
Tests       8 passed
...
dist/blog/ built successfully
```

- [ ] **Step 2: Verify output structure**

```bash
find dist/blog -name "index.html" | sort
```

Expected output:
```
dist/blog/about/index.html
dist/blog/admin/index.html
dist/blog/archive/index.html
dist/blog/index.html
dist/blog/posts/grid-systems-in-physical-space/index.html
dist/blog/posts/negative-space-as-structure/index.html
dist/blog/posts/the-brutalist-resurgence/index.html
```

- [ ] **Step 3: Verify base paths are correct**

```bash
grep 'href="/blog/' dist/blog/index.html | head -5
```

Expected: links like `href="/blog/posts/..."` and `href="/blog/archive"` — not bare `/posts/...` or `../`.

- [ ] **Step 4: Update Substack handle**

Open `src/components/home/NewsletterSignup.astro`. Replace `YOURHANDLE` with your actual Substack subdomain, then rebuild:

```bash
npm run build
```

- [ ] **Step 5: Update site domain**

Open `astro.config.mjs`. Replace `'https://example.com'` with your actual Hostinger domain, then rebuild:

```bash
npm run build
```

- [ ] **Step 6: Upload to Hostinger**

Connect to Hostinger via FTP (or use File Manager in hPanel). Upload the contents of `dist/blog/` into the `/blog` folder on your server.

Verify by visiting `https://yourdomain.com/blog/` in a browser.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete Astro blog — ready for Hostinger deployment"
```
