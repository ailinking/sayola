import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Tag, Rss } from 'lucide-react';
import { blogGenerator } from '@/lib/blogGenerator';

export const metadata: Metadata = {
  title: 'Blog - Portuguese Learning Tips & Resources | Sayola',
  description: 'Discover expert tips, grammar guides, cultural insights, and effective strategies for learning European Portuguese. Stay updated with the latest language learning techniques.',
  keywords: [
    'Portuguese blog',
    'Portuguese learning tips',
    'European Portuguese grammar',
    'Portuguese culture',
    'language learning strategies',
    'Portuguese pronunciation',
    'Portuguese vocabulary',
    'Portugal culture',
    'Portuguese lessons',
    'learn Portuguese online'
  ],
  openGraph: {
    title: 'Portuguese Learning Blog | Sayola',
    description: 'Expert tips and resources for learning European Portuguese effectively',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['pt_PT'],
    siteName: 'Sayola',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portuguese Learning Blog | Sayola',
    description: 'Expert tips and resources for learning European Portuguese effectively',
  },
  alternates: {
    canonical: '/blog',
    languages: {
      'en': '/blog',
      'pt': '/pt/blog',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Sample blog posts data (in a real app, this would come from a CMS or database)};

async function getBlogPosts() {
  try {
    return await blogGenerator.getAllPosts();
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

const sampleBlogPosts = [
  {
    id: 'portuguese-pronunciation-guide',
    title: 'Mastering European Portuguese Pronunciation: A Complete Guide',
    excerpt: 'Learn the key differences between European and Brazilian Portuguese pronunciation, including nasal sounds, vowel reduction, and consonant clusters.',
    content: 'Full content would be here...',
    author: 'Maria Santos',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Pronunciation',
    tags: ['pronunciation', 'phonetics', 'european-portuguese'],
    featured: true,
    image: '/blog/pronunciation-guide.jpg',
  },
  {
    id: 'portuguese-verb-conjugation',
    title: 'Portuguese Verb Conjugation Made Simple',
    excerpt: 'Master the complex world of Portuguese verb conjugations with our step-by-step approach and practical examples.',
    content: 'Full content would be here...',
    author: 'João Silva',
    publishedAt: '2024-01-10',
    readTime: '12 min read',
    category: 'Grammar',
    tags: ['verbs', 'conjugation', 'grammar'],
    featured: true,
    image: '/blog/verb-conjugation.jpg',
  },
  {
    id: 'portuguese-culture-traditions',
    title: 'Understanding Portuguese Culture Through Language',
    excerpt: 'Explore how Portuguese cultural traditions and customs are reflected in the language, from fado music to family values.',
    content: 'Full content would be here...',
    author: 'Ana Costa',
    publishedAt: '2024-01-05',
    readTime: '6 min read',
    category: 'Culture',
    tags: ['culture', 'traditions', 'portugal'],
    featured: false,
    image: '/blog/portuguese-culture.jpg',
  },
  {
    id: 'common-portuguese-mistakes',
    title: '10 Common Mistakes English Speakers Make in Portuguese',
    excerpt: 'Avoid these frequent pitfalls when learning Portuguese and accelerate your language learning journey.',
    content: 'Full content would be here...',
    author: 'Pedro Oliveira',
    publishedAt: '2024-01-01',
    readTime: '10 min read',
    category: 'Tips',
    tags: ['mistakes', 'learning-tips', 'common-errors'],
    featured: false,
    image: '/blog/common-mistakes.jpg',
  },
];

const categories = ['All', 'Grammar', 'Pronunciation', 'Culture', 'Tips', 'Vocabulary'];

export default async function BlogPage() {
  const dynamicPosts = await getBlogPosts();
  const blogPosts = dynamicPosts.length > 0 ? dynamicPosts : sampleBlogPosts;
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Portuguese Learning Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Expert tips, cultural insights, and proven strategies to master European Portuguese
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
              <span className="bg-white/20 px-3 py-1 rounded-full">Grammar Guides</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Pronunciation Tips</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Cultural Insights</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Learning Strategies</span>
            </div>
            <div className="flex justify-center">
              <Link 
                href="/blog/rss.xml" 
                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Rss className="w-4 h-4" />
                <span>Subscribe to RSS Feed</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-80"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Featured Article</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link href={`/blog/${post.id}`} className="hover:text-green-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <Link 
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 opacity-60"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link href={`/blog/${post.id}`} className="hover:text-green-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Read <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Sayola Portuguese Learning Blog",
            "description": "Expert tips and resources for learning European Portuguese effectively",
            "url": "https://sayola.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Sayola",
              "url": "https://sayola.com"
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "datePublished": post.publishedAt,
              "url": `https://sayola.com/blog/${post.id}`,
              "keywords": post.tags.join(", "),
              "articleSection": post.category
            }))
          })
        }}
      />
    </div>
  );
}