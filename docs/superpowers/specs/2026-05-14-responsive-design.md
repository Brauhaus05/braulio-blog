# Responsive Strategy — Braulio's Journal

**Date:** 2026-05-14  
**Approach:** Mobile-first breakpoint cascade (Approach A)  
**Minimum supported width:** 390px

---

## 1. Breakpoint System & Global Tokens

Three breakpoints, each a deliberate editorial state:

| Name | Min-width | Intent |
|------|-----------|--------|
| base | 390px | Mobile — stacked layouts, 2-col article grid |
| `md` | 768px | Tablet — intermediate grid, inline nav reappears |
| `lg` | 1280px | Desktop — existing styles, zero changes |

### Token changes

```css
/* base (mobile) */
:root {
  --pad-x: 16px;
}

@media (min-width: 768px) {
  :root { --pad-x: 40px; }
}

/* lg inherits existing --pad-x: 64px from desktop styles */
```

### Page wrapper

```css
/* base */
.page { width: 100%; }

/* lg */
@media (min-width: 1280px) {
  .page { width: var(--max); } /* restores 1280px */
}
```

---

## 2. Navigation

**base (< 768px):**
- Header height: `72px` (down from `144px`)
- Brand mark shrinks to `44px`, logotype uses `clamp(28px, 6vw, 48px)`
- Nav links hidden; hamburger button shown (3 hairlines, `24×16px`)
- Tapping hamburger opens a full-width overlay below the header
- Overlay: `--paper` background, hairline top border, nav links stacked vertically at `Anton 48px` uppercase with hairline separators, Subscribe button full-width solid at bottom
- Toggle via `data-nav-open` attribute on `<body>`, driven by a small inline `<script>` in `SiteHeader.astro`
- Close triggers: ✕ button (replaces hamburger when open), any nav link tap, Escape key

**md+ (≥ 768px):**
- Header height restores to `144px`
- Hamburger hidden; existing inline nav and Subscribe button reappear
- No overlay, no JS active

---

## 3. Typography Scale

All display sizes use `clamp(min, preferred-vw, max)`. Body and UI copy (12px labels, 16px body, 18px post paragraphs) stay fixed — already comfortable at mobile widths.

| Element | Mobile min | Desktop max | `clamp()` value |
|---|---|---|---|
| Hero `h1` | 56px | 160px | `clamp(56px, 13.75vw, 160px)` |
| Post title | 48px | 144px | `clamp(48px, 12.5vw, 144px)` |
| Featured title | 28px | 48px | `clamp(28px, 4.17vw, 48px)` |
| Post `h2` sections | 32px | 56px | `clamp(32px, 4.86vw, 56px)` |
| Blockquote | 20px | 30px | `clamp(20px, 2.6vw, 30px)` |
| Archive row title | 20px | 32px | `clamp(20px, 2.8vw, 32px)` |
| Pagination "MORE" | 28px | 56px | `clamp(28px, 4.86vw, 56px)` |
| Marquee | 20px | 28px | `clamp(20px, 2.5vw, 28px)` |

The `--pad-x` token shift ensures the `vw`-based preferred values are always proportional to the available reading width.

---

## 4. Homepage Layout

### Hero (`home-hero`)
- **base:** `padding: 48px var(--pad-x)`. `h1` uses `clamp()`. `.home-hero__meta` stat row switches from flex row to `grid-template-columns: 1fr 1fr`.
- **md+:** Existing styles restored.

### Marquee
No layout changes. Font size uses `clamp(20px, 2.5vw, 28px)`.

### Featured post (`.featured`)
- **base:** Stack vertically — `grid-template-columns: 1fr`. Image full-width on top, body below. `aspect-ratio: 853/484` preserved.
- **md+:** Restore `grid-template-columns: 2fr 1fr`.

### Article grid (`.grid-3`) + sidebar
- **base:** Articles become `grid-template-columns: 1fr 1fr` (2-col). Sidebar content (newsletter, category index) drops below articles, full-width, stacked in source order.
- **md+:** Restore `grid-template-columns: 1fr 1fr 1fr` with sidebar as third column.

### Pagination
- **base:** `height: auto; padding: 32px var(--pad-x)`. Gap tightens to `24px`. "MORE" uses `clamp()`.
- **md+:** Restore fixed `height: 132px`.

---

## 5. Post Page Layout

### Grid
- **base:** `grid-template-columns: 1fr`. `padding: 48px var(--pad-x) 80px`.
- **md:** Still single column — 768px is too narrow for a 282px sidebar alongside readable body text.
- **lg:** Existing `grid-template-columns: 282px 1fr` with `column-gap: 126px` restores unchanged. `position: sticky` on sidebar activates only here.

### Mobile content order (top → bottom)
1. Back link
2. Eyebrow (category pill + read time)
3. Post title — `clamp(48px, 12.5vw, 144px)`
4. Meta strip — date, category, read time in a compact horizontal row with `border-top` + `border-bottom` hairlines
5. Hero image — full width
6. Deck
7. TOC — static inline block above body, label + hairline-separated list
8. Article body — `max-width` relaxes from `64ch` to `100%` on mobile
9. Share buttons — horizontal row after body
10. Post outro — stacks vertically instead of `justify-content: space-between`

### TOC on mobile
Static, not sticky. No JS scroll-tracking on mobile — readers see it once and scroll past.

---

## 6. Archive & About Pages

### Archive
- **base:** Rows switch from `grid-template-columns: 1fr auto auto` to a stacked layout. Title full-width at `clamp(20px, 2.8vw, 32px)`. Category + date drop to a second line as `display: flex; justify-content: space-between`. `.archive-row__cat` margin-right collapses to `0`. Row padding: `14px 0`.
- **md+:** Restore 3-col `grid-template-columns`. `.archive-category-list` padding adapts automatically via `--pad-x`.

### About
No grid-specific layout. `--pad-x` token handles gutters automatically. Any fixed `max-width` or `ch` constraints on prose blocks relax to `100%` on mobile.

### Admin
Out of scope — desktop-only internal tool, no responsive work needed.

---

## Decision Summary

| Decision | Choice |
|---|---|
| Minimum width | 390px (mobile-first) |
| Breakpoints | base / `md` 768px / `lg` 1280px |
| Navigation | Hamburger + overlay (base), inline (md+) |
| Typography | `clamp()` fluid scaling |
| Homepage articles | 2-col grid (base), 3-col (md+) |
| Post sidebar | Stacked inline (base/md), 2-col (lg) |
| Archive rows | Stacked title+meta (base), 3-col grid (md+) |
| Admin | Desktop-only, no changes |
