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
