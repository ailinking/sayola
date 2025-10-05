import { NextResponse } from 'next/server';

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
  {
    id: 'portuguese-pronunciation-guide',
    title: 'Master Portuguese Pronunciation: A Complete Guide',
    description: 'Learn the fundamentals of Portuguese pronunciation with our comprehensive guide. Master sounds, stress patterns, and regional variations.',
    content: 'Portuguese pronunciation can be challenging for beginners, but with the right guidance, you can master it. This comprehensive guide covers all the essential sounds, stress patterns, and regional variations you need to know.',
    publishedAt: '2024-01-15T10:00:00.000Z',
    author: 'Sayola Team',
    category: 'Pronunciation',
  },
  {
    id: 'portuguese-verb-conjugation',
    title: 'Portuguese Verb Conjugation Made Simple',
    description: 'Simplify Portuguese verb conjugation with our step-by-step approach. Learn regular and irregular verbs with practical examples.',
    content: 'Verb conjugation is one of the most important aspects of Portuguese grammar. In this article, we break down the complex system into manageable parts, making it easier for learners to understand and apply.',
    publishedAt: '2024-01-10T10:00:00.000Z',
    author: 'Sayola Team',
    category: 'Grammar',
  },
  {
    id: 'portuguese-culture-traditions',
    title: 'Portuguese Culture and Traditions: A Deep Dive',
    description: 'Explore the rich cultural heritage of Portuguese-speaking countries. Discover traditions, festivals, and customs that shape the language.',
    content: 'Understanding Portuguese culture is essential for language learners. This article explores the rich traditions, festivals, and customs of Portuguese-speaking countries, providing context that enhances language learning.',
    publishedAt: '2024-01-05T10:00:00.000Z',
    author: 'Sayola Team',
    category: 'Culture',
  },
  {
    id: 'common-portuguese-mistakes',
    title: 'Common Portuguese Mistakes and How to Avoid Them',
    description: 'Avoid common pitfalls in Portuguese learning. Identify frequent mistakes and learn strategies to overcome them.',
    content: 'Every Portuguese learner makes mistakes, but knowing the most common ones can help you avoid them. This article identifies frequent errors and provides strategies to overcome them.',
    publishedAt: '2024-01-01T10:00:00.000Z',
    author: 'Sayola Team',
    category: 'Learning Tips',
  },
];

const baseUrl = 'https://sayola.com';
const siteTitle = 'Sayola - Portuguese Learning Blog';
const siteDescription = 'Learn Portuguese with expert guidance, cultural insights, and practical tips. Your journey to Portuguese fluency starts here.';

export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>${siteTitle}</title>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <link>${baseUrl}/blog</link>
    <description>${siteDescription}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-US</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>Sayola Blog RSS Generator</generator>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>${siteTitle}</title>
      <link>${baseUrl}/blog</link>
    </image>
${blogPosts
  .map(
    (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <link>${baseUrl}/blog/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.id}</guid>
      <category><![CDATA[${post.category}]]></category>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}