# Publishing Guide — Braulio's Journal

## Publishing a new post

1. Create `src/content/posts/your-post-slug.mdx`
2. Add frontmatter and write your content (see templates below)
3. Run `npm run build`
4. Upload the changed files to Hostinger (see below)

---

## Frontmatter reference

```mdx
---
title: "Your Post Title"
deck: "A short standfirst — one or two sentences introducing the piece."
date: 2026-05-14
issue: "No. 05"
category: "Architecture"
tags: ["Brutalism", "Field Notes"]
readTime: 7
heroImage: "/blog/assets/your-image.png"
heroCaption: "Fig. 01 · Caption text · Photo · B.A."
featured: false
draft: false
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Displayed as the large Anton heading |
| `deck` | Yes | Standfirst paragraph below the title |
| `date` | Yes | Format: `YYYY-MM-DD` |
| `issue` | Yes | e.g. `"No. 05"` |
| `category` | Yes | Appears in nav, archive, and cards |
| `tags` | No | Array of strings, defaults to `[]` |
| `readTime` | Yes | Minutes, used in sidebar and admin |
| `heroImage` | No | Path starting with `/blog/assets/` |
| `heroCaption` | No | Caption for the hero image bar |
| `featured` | No | `true` makes this the homepage featured card (one post at a time) |
| `draft` | No | `true` hides from public pages, visible in admin only |

---

## MDX components

Use these anywhere in the post body:

```mdx
<Dropcap>T</Dropcap>he first letter of a paragraph, rendered large.

<PullQuote cite="Source name">
  The quoted text goes here.
</PullQuote>

<HeroImage src="/blog/assets/image.png" caption="Fig. 01 · Description" credit="Photo · B.A." />

<TwinImage
  left="/blog/assets/left.png"
  leftCaption="Fig. 02 · Left caption"
  right="/blog/assets/right.png"
  rightCaption="Fig. 03 · Right caption"
/>
```

Add images to `public/assets/` before referencing them.

---

## Drafts

Set `draft: true` while writing. The post:
- Does **not** appear on the homepage, archive, or post routes
- **Does** appear in the admin dashboard at `https://braulio.ca/blog/admin`

Switch to `draft: false` and rebuild when ready to publish.

---

## Build and deploy

```bash
npm run build
```

Output lands in `dist/`. Upload to Hostinger's `/blog/` folder via FTP or File Manager.

**After adding a new post, only these files change:**

```
dist/index.html                        ← homepage (new card added)
dist/archive/index.html                ← archive (new entry added)
dist/posts/your-post-slug/index.html   ← the new post page
dist/_astro/                           ← only if CSS changed
```

You don't need to re-upload the entire `dist/` folder every time.

---

## Checklist for each post

- [ ] File created at `src/content/posts/your-slug.mdx`
- [ ] All required frontmatter fields filled in
- [ ] Images copied to `public/assets/` (if any)
- [ ] `draft: false` when ready
- [ ] `npm run build` succeeds
- [ ] Changed files uploaded to Hostinger
