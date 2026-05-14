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

  it('excludes draft posts from the fallback', () => {
    const posts = [
      makePost({ slug: 'draft-post', draft: true, featured: false }),
      makePost({ slug: 'live-post', featured: false }),
    ];
    expect(getFeaturedPost(posts)?.slug).toBe('live-post');
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
