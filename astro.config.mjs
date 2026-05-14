import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://example.com',  // TODO: replace with your actual domain
  base: '/blog',
  output: 'static',
  integrations: [mdx()],
});
