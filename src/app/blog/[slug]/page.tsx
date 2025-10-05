import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen, Tag } from 'lucide-react';
import { blogGenerator } from '@/lib/blogGenerator';

// Load blog posts from the generator
async function getBlogPosts() {
  return await blogGenerator.getAllPosts();
}

// Sample blog posts data (fallback for development)
const sampleBlogPosts = [
  {
    id: 'portuguese-pronunciation-guide',
    title: 'Mastering European Portuguese Pronunciation: A Complete Guide',
    excerpt: 'Learn the key differences between European and Brazilian Portuguese pronunciation, including nasal sounds, vowel reduction, and consonant clusters.',
    content: `
      <h2>Introduction to European Portuguese Pronunciation</h2>
      <p>European Portuguese pronunciation can be challenging for English speakers, but with the right guidance, you can master its unique sounds and rhythm. This comprehensive guide will walk you through the essential aspects of Portuguese phonetics.</p>
      
      <h3>Key Differences from Brazilian Portuguese</h3>
      <p>European Portuguese differs significantly from Brazilian Portuguese in several ways:</p>
      <ul>
        <li><strong>Vowel reduction:</strong> Unstressed vowels are often reduced or even dropped entirely</li>
        <li><strong>Consonant clusters:</strong> More complex consonant combinations are preserved</li>
        <li><strong>Nasal sounds:</strong> More prominent and varied nasal vowels</li>
        <li><strong>Rhythm:</strong> More stress-timed rhythm compared to Brazilian Portuguese</li>
      </ul>
      
      <h3>Mastering Nasal Vowels</h3>
      <p>Portuguese has several nasal vowels that don't exist in English. Here's how to approach them:</p>
      <ol>
        <li><strong>ã [ɐ̃]:</strong> As in "mão" (hand) - similar to "own" but with air through the nose</li>
        <li><strong>õ [õ]:</strong> As in "não" (no) - like "own" with nasal airflow</li>
        <li><strong>ẽ [ẽ]:</strong> As in "bem" (well) - like "en" in "pen" but nasalized</li>
      </ol>
      
      <h3>Vowel Reduction Patterns</h3>
      <p>One of the most distinctive features of European Portuguese is vowel reduction. Unstressed vowels often become:</p>
      <ul>
        <li>The schwa sound [ə] - like the "a" in "about"</li>
        <li>Completely dropped in some contexts</li>
        <li>Merged with neighboring sounds</li>
      </ul>
      
      <h3>Practice Exercises</h3>
      <p>To improve your pronunciation, try these exercises:</p>
      <ol>
        <li>Listen to native speakers and repeat phrases</li>
        <li>Practice minimal pairs (words that differ by one sound)</li>
        <li>Record yourself and compare with native pronunciation</li>
        <li>Focus on rhythm and stress patterns</li>
      </ol>
      
      <h3>Common Pronunciation Mistakes</h3>
      <p>Avoid these common errors:</p>
      <ul>
        <li>Pronouncing all vowels clearly (remember vowel reduction!)</li>
        <li>Using Brazilian Portuguese pronunciation patterns</li>
        <li>Ignoring nasal vowels</li>
        <li>Incorrect stress placement</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>Mastering European Portuguese pronunciation takes time and practice, but understanding these key principles will set you on the right path. Remember to listen actively to native speakers and practice regularly.</p>
    `,
    author: 'Maria Santos',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Pronunciation',
    tags: ['pronunciation', 'phonetics', 'european-portuguese', 'nasal-vowels', 'vowel-reduction'],
    featured: true,
    image: '/blog/pronunciation-guide.jpg',
    wordCount: 650,
  },
  {
    id: 'portuguese-verb-conjugation',
    title: 'Portuguese Verb Conjugation Made Simple',
    excerpt: 'Master the complex world of Portuguese verb conjugations with our step-by-step approach and practical examples.',
    content: `
      <h2>Understanding Portuguese Verb Conjugation</h2>
      <p>Portuguese verb conjugation might seem overwhelming at first, but with a systematic approach, you can master this essential aspect of the language.</p>
      
      <h3>The Three Verb Groups</h3>
      <p>Portuguese verbs are divided into three main groups based on their infinitive endings:</p>
      <ul>
        <li><strong>-ar verbs:</strong> falar (to speak), estudar (to study), trabalhar (to work)</li>
        <li><strong>-er verbs:</strong> comer (to eat), beber (to drink), vender (to sell)</li>
        <li><strong>-ir verbs:</strong> partir (to leave), dormir (to sleep), abrir (to open)</li>
      </ul>
      
      <h3>Present Tense Conjugation</h3>
      <p>Let's start with the present tense, using "falar" (to speak) as an example:</p>
      <ul>
        <li>eu falo (I speak)</li>
        <li>tu falas (you speak - informal)</li>
        <li>ele/ela fala (he/she speaks)</li>
        <li>nós falamos (we speak)</li>
        <li>vós falais (you speak - formal plural, rarely used)</li>
        <li>eles/elas falam (they speak)</li>
      </ul>
      
      <h3>Regular vs. Irregular Verbs</h3>
      <p>While many verbs follow regular patterns, some of the most common verbs are irregular:</p>
      <ul>
        <li><strong>ser</strong> (to be): sou, és, é, somos, sois, são</li>
        <li><strong>estar</strong> (to be): estou, estás, está, estamos, estais, estão</li>
        <li><strong>ter</strong> (to have): tenho, tens, tem, temos, tendes, têm</li>
      </ul>
      
      <h3>Tips for Learning Conjugations</h3>
      <ol>
        <li>Start with the most common verbs</li>
        <li>Practice one tense at a time</li>
        <li>Use conjugation in context, not just memorization</li>
        <li>Pay attention to patterns within each group</li>
      </ol>
    `,
    author: 'João Silva',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    readTime: '12 min read',
    category: 'Grammar',
    tags: ['verbs', 'conjugation', 'grammar', 'present-tense', 'irregular-verbs'],
    featured: true,
    image: '/blog/verb-conjugation.jpg',
    wordCount: 420,
  },
  {
    id: 'portuguese-culture-traditions',
    title: 'Understanding Portuguese Culture Through Language',
    excerpt: 'Explore how Portuguese cultural traditions and customs are reflected in the language, from fado music to family values.',
    content: `
      <h2>Language as a Window to Portuguese Culture</h2>
      <p>Learning Portuguese isn't just about grammar and vocabulary—it's about understanding the rich cultural heritage that shapes how Portuguese people communicate and express themselves.</p>
      
      <h3>Fado: The Soul of Portuguese Expression</h3>
      <p>Fado music embodies the Portuguese concept of "saudade"—a deep emotional state of longing and nostalgia that has no direct English translation. This uniquely Portuguese feeling influences how emotions are expressed in the language.</p>
      
      <h3>Family and Social Hierarchy</h3>
      <p>Portuguese language reflects strong family values through:</p>
      <ul>
        <li>Formal vs. informal address (tu vs. você)</li>
        <li>Respectful titles for elders</li>
        <li>Extended family terminology</li>
      </ul>
      
      <h3>Religious Influence</h3>
      <p>Catholic traditions have deeply influenced Portuguese expressions and idioms, with many common phrases having religious origins.</p>
    `,
    author: 'Ana Costa',
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
    readTime: '6 min read',
    category: 'Culture',
    tags: ['culture', 'traditions', 'portugal', 'fado', 'saudade'],
    featured: false,
    image: '/blog/portuguese-culture.jpg',
    wordCount: 280,
  },
];

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const blogPosts = await getBlogPosts();
  const post = blogPosts.find(p => p.slug === resolvedParams.slug) || sampleBlogPosts.find(p => p.id === resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Sayola Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Sayola Blog`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      locale: 'en_US',
      alternateLocale: ['pt_PT'],
      siteName: 'Sayola',
      images: [
        {
          url: ('image' in post ? post.image : '/blog/default.jpg'),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [('image' in post ? post.image : '/blog/default.jpg')],
    },
    alternates: {
      canonical: `/blog/${post.id}`,
      languages: {
        'en': `/blog/${post.id}`,
        'pt': `/pt/blog/${post.id}`,
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
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  const allPosts = [...blogPosts, ...sampleBlogPosts];
  return allPosts.map((post) => ({
    slug: 'slug' in post ? post.slug : post.id,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const blogPosts = await getBlogPosts();
  const post = blogPosts.find(p => p.slug === resolvedParams.slug) || sampleBlogPosts.find(p => p.id === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const allPosts = [...blogPosts, ...sampleBlogPosts];
  const relatedPosts = allPosts
    .filter(p => {
      const postId = 'slug' in p ? p.slug : p.id;
      const currentId = 'slug' in post ? post.slug : post.id;
      return postId !== currentId && (p.category === post.category || p.tags.some((tag: string) => post.tags.includes(tag)));
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-green-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Blog */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
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
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{('wordCount' in post ? post.wordCount : 'N/A')} words</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-600">Portuguese Language Expert</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-video bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mb-12 flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">Featured Image</span>
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-r from-blue-400 to-green-400 opacity-60"></div>
                  <div className="p-4">
                    <span className="text-xs text-green-600 font-medium">{relatedPost.category}</span>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.id}`} className="hover:text-green-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Sayola",
              "url": "https://sayola.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sayola.com/logo.png"
              }
            },
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://sayola.com/blog/${post.id}`
            },
            "keywords": post.tags.join(", "),
            "articleSection": post.category,
            "wordCount": ('wordCount' in post ? post.wordCount : undefined),
            "timeRequired": post.readTime,
            "inLanguage": "en-US",
            "about": {
              "@type": "Thing",
              "name": "Portuguese Language Learning"
            }
          })
        }}
      />
    </div>
  );
}