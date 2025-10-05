import { NextResponse } from 'next/server';

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
  {
    id: 'portuguese-pronunciation-guide',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'portuguese-verb-conjugation',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 'portuguese-culture-traditions',
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    id: 'common-portuguese-mistakes',
    publishedAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const baseUrl = 'https://sayola.com';

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
  { url: '/search', priority: '0.9', changefreq: 'weekly' },
  { url: '/collection', priority: '0.8', changefreq: 'weekly' },
  { url: '/compare', priority: '0.7', changefreq: 'weekly' },
  { url: '/daily', priority: '0.8', changefreq: 'daily' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/profile', priority: '0.6', changefreq: 'monthly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/demo', priority: '0.7', changefreq: 'weekly' },
];

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${blogPosts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${post.updatedAt}T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}