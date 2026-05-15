# Responsive Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Braulio's Journal fully responsive from 390px to 1280px using mobile-first breakpoint overrides on the existing desktop-first CSS, without breaking any existing desktop styles.

**Architecture:** Three breakpoints (base / md 768px / lg 1280px). The existing CSS is desktop-first with no media queries. Rather than restructuring every rule, we apply `@media (max-width: 767px)` overrides for mobile-specific changes, move `--pad-x` into a three-step cascade, and apply `clamp()` directly to display type values in-place. A hamburger nav overlay handles mobile navigation. No CSS framework or new dependencies.

**Tech Stack:** CSS (media queries, `clamp()`, CSS Grid), Astro components, vanilla JS (hamburger toggle only)

---

## File Map

| File | What changes |
|------|-------------|
| `src/components/layout/PageShell.astro` | Fix `<meta name="viewport">` — currently pins every device to 1280px |
| `src/components/layout/SiteHeader.astro` | Add hamburger button, nav overlay markup, and toggle `<script>` |
| `src/styles/global.css` | `--pad-x` token cascade, `.page` fluid width, hamburger/overlay CSS, header mobile, footer mobile |
| `src/styles/home.css` | `clamp()` type scale, hero, featured, grid-3 + sidebar, pagination, archive row mobile layout |
| `src/styles/post.css` | `clamp()` type scale, post-wrap single-col, sidebar reflow, mobile share block |
| `src/pages/posts/[slug].astro` | Add `.post-mobile-share` div with `<ShareButtons>` after article content |

---

### Task 1: Viewport meta + global token cascade

**Files:**
- Modify: `src/components/layout/PageShell.astro:16`
- Modify: `src/styles/global.css` (`:root` block and `.page` rule)

- [ ] **Step 1: Fix the viewport meta tag**

In `src/components/layout/PageShell.astro`, line 16, change:

```html
<meta name="viewport" content="width=1280" />
```

to:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Without this change, every mobile browser renders the page as if it were 1280px wide — all subsequent responsive CSS is useless until this is fixed.

- [ ] **Step 2: Move `--pad-x` to a three-step cascade**

In `src/styles/global.css`, the `:root` block currently has `--pad-x: 64px`. Change the entire `:root` block to set `--pad-x: 16px` (mobile base), then add two media query overrides immediately after it:

```css
:root {
  --ink: rgb(51, 51, 51);
  --paper: rgb(235, 236, 220);
  --line: rgb(51, 51, 51);
  --accent: rgb(186, 26, 26);
  --hair: 1px;
  --col: 426.667px;
  --max: 1280px;
  --pad-x: 16px;
}

@media (min-width: 768px) {
  :root { --pad-x: 40px; }
}

@media (min-width: 1280px) {
  :root { --pad-x: 64px; }
}
```

All existing rules that reference `var(--pad-x)` — header padding, hero padding, footer padding, archive category list — automatically inherit the correct gutter at every breakpoint.

- [ ] **Step 3: Make `.page` fluid below 1280px**

In `src/styles/global.css`, find the `.page` rule and change `width: var(--max)` to `width: 100%`, then add a `lg` breakpoint to restore the fixed width:

```css
.page {
  width: 100%;
  margin: 0 auto;
  border-left: var(--hair) solid var(--line);
  border-right: var(--hair) solid var(--line);
  background: var(--paper);
}

@media (min-width: 1280px) {
  .page { width: var(--max); }
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```

Open `http://localhost:4321/blog/` in Chrome. Open DevTools → device toolbar → set to "iPhone 14" (390×844 logical pixels).

Expected:
- Page fills full 390px viewport width (no horizontal scroll bar)
- Left and right hairline borders are visible at the page edges
- Side gutters are ~16px (narrow), not 64px

At 768px: gutters are ~40px. At 1280px: gutters are 64px, page is fixed-width as before.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/PageShell.astro src/styles/global.css
git commit -m "feat(responsive): fix viewport meta and add pad-x breakpoint cascade"
```

---

### Task 2: Hamburger navigation

**Files:**
- Modify: `src/components/layout/SiteHeader.astro`
- Modify: `src/styles/global.css` (append hamburger + overlay CSS)

- [ ] **Step 1: Replace SiteHeader.astro**

Replace the entire contents of `src/components/layout/SiteHeader.astro` with:

```astro
---
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const { pathname } = Astro.url;

function isActive(href: string): boolean {
  if (href === `${base}/`) return pathname === `${base}/` || pathname === base;
  return pathname === href || pathname.startsWith(href + '/');
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
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-overlay">
      <span class="nav-toggle__bar"></span>
      <span class="nav-toggle__bar"></span>
      <span class="nav-toggle__bar"></span>
    </button>
  </div>
  <nav class="nav-overlay" id="nav-overlay" aria-hidden="true">
    <a href={`${base}/`}        class:list={[{ 'is-active': isActive(`${base}/`) }]}>Journal</a>
    <a href={`${base}/archive`} class:list={[{ 'is-active': isActive(`${base}/archive`) }]}>Archive</a>
    <a href={`${base}/about`}   class:list={[{ 'is-active': isActive(`${base}/about`) }]}>About</a>
  </nav>
</header>

<script>
  const toggle = document.getElementById('nav-toggle') as HTMLButtonElement | null;
  const overlay = document.getElementById('nav-overlay') as HTMLElement | null;

  function openNav() {
    document.body.setAttribute('data-nav-open', '');
    toggle?.setAttribute('aria-expanded', 'true');
    overlay?.removeAttribute('aria-hidden');
  }

  function closeNav() {
    document.body.removeAttribute('data-nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
    overlay?.setAttribute('aria-hidden', 'true');
  }

  toggle?.addEventListener('click', () => {
    document.body.hasAttribute('data-nav-open') ? closeNav() : openNav();
  });

  overlay?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
</script>
```

- [ ] **Step 2: Append hamburger + overlay CSS to global.css**

Append to the end of `src/styles/global.css`:

```css
/* HAMBURGER TOGGLE ──────────────────────────────────────────── */
.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.nav-toggle__bar {
  display: block;
  width: 24px;
  height: var(--hair);
  background: var(--ink);
  transition: transform 120ms ease, opacity 120ms ease;
}
[data-nav-open] .nav-toggle__bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
[data-nav-open] .nav-toggle__bar:nth-child(2) { opacity: 0; }
[data-nav-open] .nav-toggle__bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* NAV OVERLAY ───────────────────────────────────────────────── */
.nav-overlay {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--paper);
  border-top: var(--hair) solid var(--line);
  border-bottom: var(--hair) solid var(--line);
  padding: 0 var(--pad-x) 32px;
  z-index: 100;
  flex-direction: column;
}
[data-nav-open] .nav-overlay { display: flex; }
.nav-overlay a {
  font-family: "Anton", sans-serif;
  font-size: 48px;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  padding: 20px 0;
  border-bottom: var(--hair) solid var(--line);
  color: var(--ink);
}
.nav-overlay a:first-child { border-top: var(--hair) solid var(--line); margin-top: 24px; }
.nav-overlay a.is-active { opacity: 0.45; }

@media (max-width: 767px) {
  .site-header {
    height: 72px;
    position: relative;
  }
  .brand__mark {
    width: 44px;
    height: 44px;
  }
  .brand__mark::after {
    font-size: 28px;
  }
  .brand__name {
    font-size: clamp(18px, 5vw, 48px);
  }
  .nav { display: none; }
  .nav-toggle { display: flex; }
}

@media (min-width: 768px) {
  .nav-toggle { display: none; }
  .nav-overlay { display: none !important; }
}
```

- [ ] **Step 3: Verify in browser**

At 390px (DevTools device mode):
- Header is 72px tall; brand mark is 44px; logotype is scaled
- Three horizontal hairlines appear on the right side of the header
- Click hamburger: overlay drops below header with three Anton 48px links separated by hairlines
- Click any nav link: overlay closes
- Press Escape: overlay closes
- Clicking hamburger again while open closes it; the three bars animate through ✕

At 768px+:
- Hamburger is completely hidden
- Inline nav links appear as in the original desktop design
- Overlay is never shown regardless of `data-nav-open` state

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/SiteHeader.astro src/styles/global.css
git commit -m "feat(responsive): hamburger navigation overlay for mobile"
```

---

### Task 3: Typography — apply `clamp()` to all display sizes

**Files:**
- Modify: `src/styles/home.css` (6 values)
- Modify: `src/styles/post.css` (3 values)

These are mechanical in-place edits — only the `font-size` value changes, nothing else.

- [ ] **Step 1: Edit display type in home.css**

Make the following targeted `font-size` changes in `src/styles/home.css`:

In `.home-hero h1`:
```css
font-size: clamp(56px, 13.75vw, 160px);
```

In `.featured__title`:
```css
font-size: clamp(28px, 4.17vw, 48px);
```

In `.pagination__more`:
```css
font-size: clamp(28px, 4.86vw, 56px);
```

In `.marquee__track`:
```css
font-size: clamp(20px, 2.5vw, 28px);
```

In `.index__list li`:
```css
font-size: clamp(20px, 2.8vw, 32px);
```

In `.archive-row__title`:
```css
font-size: clamp(20px, 2.8vw, 32px);
```

- [ ] **Step 2: Edit display type in post.css**

In `.post-title`:
```css
font-size: clamp(48px, 12.5vw, 144px);
```

In `.post-body h2`:
```css
font-size: clamp(32px, 4.86vw, 56px);
```

In `blockquote`:
```css
font-size: clamp(20px, 2.6vw, 30px);
```

- [ ] **Step 3: Verify in browser**

Slowly drag the DevTools viewport from 390px to 1280px while viewing the homepage and a post page:
- All display type scales smoothly with no jumps
- At 390px: hero h1 ≈ 54px, post title ≈ 49px
- At 1280px: all sizes exactly match original values (160px, 144px, 48px, 56px, 30px, 32px, 28px)

- [ ] **Step 4: Commit**

```bash
git add src/styles/home.css src/styles/post.css
git commit -m "feat(responsive): clamp() fluid type scale on all display elements"
```

---

### Task 4: Homepage — hero + featured post

**Files:**
- Modify: `src/styles/home.css`

- [ ] **Step 1: Append hero and featured mobile overrides**

Append to `src/styles/home.css`:

```css
/* ── RESPONSIVE ─────────────────────────────────────────────── */
@media (max-width: 767px) {
  .home-hero {
    padding: 48px var(--pad-x);
  }
  .home-hero__meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .featured {
    grid-template-columns: 1fr;
  }
  .featured__media {
    border-right: none;
    border-bottom: var(--hair) solid var(--line);
  }
}

@media (min-width: 768px) {
  .featured {
    grid-template-columns: 2fr 1fr;
  }
}
```

- [ ] **Step 2: Verify in browser at 390px**

On the homepage at 390px:
- Hero: headline is scaled, left/right padding is ~16px, the stat row (post count, subscriber count, etc.) wraps to a 2-column grid instead of a single flex row
- Featured: image stacks full-width on top, body text appears below; image has a bottom hairline not a right one

At 768px:
- Featured restores to the 2fr/1fr side-by-side layout

- [ ] **Step 3: Commit**

```bash
git add src/styles/home.css
git commit -m "feat(responsive): hero and featured post mobile layout"
```

---

### Task 5: Homepage — article grid + sidebar + pagination

**Files:**
- Modify: `src/styles/home.css`

- [ ] **Step 1: Append grid, sidebar, and pagination mobile overrides**

Append to `src/styles/home.css`:

```css
@media (max-width: 767px) {
  .grid-3 {
    grid-template-columns: 1fr 1fr;
  }
  .col.sidebar {
    grid-column: 1 / -1;
    border-left: none;
  }

  .pagination {
    height: auto;
    padding: 32px var(--pad-x);
    gap: 24px;
  }
}
```

The `.col.sidebar` is the third direct child of `.grid-3`. With `grid-template-columns: 1fr 1fr`, it would normally occupy column 1 of a new row (leaving column 2 empty). Setting `grid-column: 1 / -1` makes it span both columns as a full-width block. Removing `border-left: none` prevents the stray hairline that the `* + *` rule would add.

- [ ] **Step 2: Verify in browser at 390px**

On the homepage at 390px:
- Two article columns appear side by side (even-indexed posts left, odd-indexed right)
- Newsletter and category index appear below both columns, full-width
- No stray left border on the newsletter block
- Pagination "MORE" button is centered; section height is auto (not the fixed 132px)

At 768px+:
- Three article columns restore; sidebar returns to the third column

- [ ] **Step 3: Commit**

```bash
git add src/styles/home.css
git commit -m "feat(responsive): article grid, sidebar, and pagination mobile layout"
```

---

### Task 6: Post page layout

**Files:**
- Modify: `src/pages/posts/[slug].astro`
- Modify: `src/styles/post.css`

On mobile, the `<PostSidebar>` renders above the article in DOM order (back link → meta → TOC). The sidebar's share buttons are hidden on mobile and replaced by a `.post-mobile-share` block inside the article, which appears after the body content.

- [ ] **Step 1: Add mobile share block to [slug].astro**

In `src/pages/posts/[slug].astro`, add `ShareButtons` to the frontmatter imports (after the existing `PostSidebar` import line):

```astro
import ShareButtons from '../../components/post/ShareButtons.astro';
```

Then inside `<article class="post-body">`, after `<Content ... />` and before `{nextPost && ...}`, add:

```astro
<div class="post-mobile-share">
  <ShareButtons url={postUrl} title={post.data.title} />
</div>
```

The article block should look like this after the edit:

```astro
<article class="post-body">
  <div class="post-eyebrow">
    <span class="pill pill--solid">{post.data.readTime} min read</span>
    <span class="pill">{post.data.category}</span>
    <span>{post.data.issue}</span>
  </div>
  <h1 class="post-title">{post.data.title}</h1>
  <p class="post-deck">{post.data.deck}</p>
  <Content components={{ Dropcap, PullQuote, HeroImage, TwinImage }} />
  <div class="post-mobile-share">
    <ShareButtons url={postUrl} title={post.data.title} />
  </div>
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
```

- [ ] **Step 2: Append post page responsive CSS**

Append to `src/styles/post.css`:

```css
/* ── RESPONSIVE ─────────────────────────────────────────────── */
.post-mobile-share { display: none; }

@media (max-width: 767px) {
  .post-wrap {
    grid-template-columns: 1fr;
    padding: 48px var(--pad-x) 80px;
    column-gap: 0;
  }

  .post-sidebar {
    position: static;
  }

  .post-sidebar .share {
    display: none;
  }

  .post-body {
    max-width: 100%;
  }

  .post-body p {
    max-width: 100%;
  }

  .post-outro {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .post-mobile-share {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 32px;
    margin-top: 32px;
    border-top: var(--hair) solid var(--ink);
  }
}
```

- [ ] **Step 3: Verify in browser at 390px**

Navigate to any post. At 390px:
- Single column: sidebar content (back link, meta rows, TOC) stacks above the article
- `.post-sidebar .share` (sidebar share buttons) is hidden
- Article title uses the fluid clamp size (~49px at 390px)
- Body paragraphs fill the full column width (no `64ch` cap)
- `.post-mobile-share` is visible after the body content with share buttons in a horizontal row
- Post outro stacks vertically (label above, next post title below)

At 1280px:
- Two-column layout: sidebar (282px) on left, article on right
- Sidebar is sticky (`position: sticky; top: 32px`)
- `.post-mobile-share` is hidden (`display: none`)

- [ ] **Step 4: Commit**

```bash
git add src/pages/posts/[slug].astro src/styles/post.css
git commit -m "feat(responsive): post page single-column layout for mobile"
```

---

### Task 7: Archive rows + footer

**Files:**
- Modify: `src/styles/home.css` (archive row)
- Modify: `src/styles/global.css` (footer)

- [ ] **Step 1: Append archive row mobile layout**

Append to `src/styles/home.css`:

```css
@media (max-width: 767px) {
  .archive-row {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    row-gap: 6px;
    padding: 14px 0;
    align-items: baseline;
  }
  .archive-row__title {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .archive-row__cat {
    grid-column: 1;
    grid-row: 2;
    margin-right: 0;
  }
  .archive-row__date {
    grid-column: 2;
    grid-row: 2;
  }
}
```

The three siblings (`__title`, `__cat`, `__date`) use explicit grid placement: title spans full width on row 1; category and date sit side by side on row 2 (category left, date right).

- [ ] **Step 2: Append footer mobile layout**

Append to `src/styles/global.css`:

```css
@media (max-width: 767px) {
  .site-footer {
    height: auto;
    padding: 32px var(--pad-x);
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
}
```

- [ ] **Step 3: Verify archive in browser at 390px**

Navigate to `/blog/archive`. At 390px:
- "Archive" headline scales fluidly
- Each archive row: article title is full-width on its own line; category (left) and date (right) appear on the line below
- No extra right margin on the category label

At 768px+: archive rows restore to the original single-row `1fr auto auto` grid.

- [ ] **Step 4: Verify footer at 390px**

Scroll to any page footer at 390px:
- B mark, foot links, and copyright notice stack vertically with 24px gaps
- No horizontal overflow or scroll

- [ ] **Step 5: Full cross-page smoke test**

Test all three viewport widths (390px, 768px, 1280px) across all pages:

| Page | Check at 390px | Check at 768px | Check at 1280px |
|---|---|---|---|
| `/blog/` | Hamburger nav, 2-col articles, stacked sidebar, fluid type | Featured 2fr/1fr, 3-col articles, inline nav | Desktop layout unchanged |
| `/blog/archive` | Stacked archive rows, fluid hero | Archive rows single-line | Desktop layout unchanged |
| `/blog/posts/[slug]` | Single-col post, sidebar above article, mobile share visible | Single-col, more padding | Desktop 2-col sidebar+article |
| Footer (all pages) | Stacked footer items | Stacked footer items | Original 3-item row |

- [ ] **Step 6: Commit**

```bash
git add src/styles/home.css src/styles/global.css
git commit -m "feat(responsive): archive row and footer mobile layout"
```
