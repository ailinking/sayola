interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    image?: string;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
  structuredData: any;
  robots: string;
  alternateLanguages?: { hreflang: string; href: string }[];
}

interface EEATFactors {
  experience: {
    authorCredentials: string[];
    practicalExamples: number;
    realWorldScenarios: number;
  };
  expertise: {
    topicDepth: number;
    technicalAccuracy: number;
    comprehensiveness: number;
  };
  authoritativeness: {
    citations: number;
    externalLinks: number;
    internalLinks: number;
  };
  trustworthiness: {
    factualAccuracy: number;
    sourceCredibility: number;
    transparency: number;
  };
}

interface ContentAnalysis {
  readabilityScore: number;
  keywordDensity: { [keyword: string]: number };
  headingStructure: { level: number; text: string }[];
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  imageCount: number;
  linkCount: { internal: number; external: number };
}

export class SEOOptimizer {
  private readonly baseUrl = 'https://sayola.vercel.app';
  private readonly siteName = 'Sayola - Learn European Portuguese';
  private readonly defaultAuthor = 'Sayola Language Learning Team';

  /**
   * Generate comprehensive SEO metadata for a blog post
   */
  generateSEOMetadata(
    title: string,
    content: string,
    slug: string,
    category: string,
    tags: string[],
    publishedAt: string
  ): SEOMetadata {
    const description = this.generateMetaDescription(content);
    const keywords = this.extractKeywords(content, tags);
    const canonicalUrl = `${this.baseUrl}/blog/${slug}`;
    
    // Generate structured data
    const structuredData = this.generateStructuredData(
      title,
      description,
      content,
      slug,
      category,
      tags,
      publishedAt
    );

    return {
      title: this.optimizeTitle(title),
      description,
      keywords,
      canonicalUrl,
      openGraph: {
        title: this.optimizeTitle(title),
        description,
        type: 'article',
        url: canonicalUrl,
        siteName: this.siteName,
        image: `${this.baseUrl}/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`
      },
      twitter: {
        card: 'summary_large_image',
        title: this.optimizeTitle(title),
        description,
        image: `${this.baseUrl}/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`
      },
      structuredData,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      alternateLanguages: [
        { hreflang: 'en', href: canonicalUrl },
        { hreflang: 'x-default', href: canonicalUrl }
      ]
    };
  }

  /**
   * Optimize title for SEO (50-60 characters)
   */
  private optimizeTitle(title: string): string {
    const maxLength = 60;
    const suffix = ' | Sayola';
    
    if (title.length + suffix.length <= maxLength) {
      return title + suffix;
    }
    
    const truncatedTitle = title.substring(0, maxLength - suffix.length - 3) + '...';
    return truncatedTitle + suffix;
  }

  /**
   * Generate meta description (150-160 characters)
   */
  private generateMetaDescription(content: string): string {
    const maxLength = 160;
    
    // Extract first paragraph or first few sentences
    const firstParagraph = content.split('\n\n')[0];
    const sentences = firstParagraph.split('. ');
    
    let description = '';
    for (const sentence of sentences) {
      if (description.length + sentence.length + 2 <= maxLength) {
        description += (description ? '. ' : '') + sentence;
      } else {
        break;
      }
    }
    
    if (description.length < 120) {
      // If too short, add more content
      const words = content.replace(/[^\w\s]/g, ' ').split(/\s+/);
      description = words.slice(0, 25).join(' ');
    }
    
    return description.length > maxLength 
      ? description.substring(0, maxLength - 3) + '...'
      : description;
  }

  /**
   * Extract and optimize keywords
   */
  private extractKeywords(content: string, tags: string[]): string[] {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);

    // Extract words from content
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    // Count word frequency
    const wordCount: { [word: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Get top keywords
    const topWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    // Combine with tags and add Portuguese learning related keywords
    const keywords = [
      ...tags.map(tag => tag.toLowerCase()),
      ...topWords,
      'european portuguese',
      'portuguese learning',
      'language learning',
      'portuguese grammar',
      'portuguese vocabulary'
    ];

    return [...new Set(keywords)].slice(0, 15);
  }

  /**
   * Generate comprehensive structured data
   */
  private generateStructuredData(
    title: string,
    description: string,
    content: string,
    slug: string,
    category: string,
    tags: string[],
    publishedAt: string
  ): any {
    const url = `${this.baseUrl}/blog/${slug}`;
    const imageUrl = `${this.baseUrl}/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`;
    
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${url}#article`,
          headline: title,
          description,
          image: {
            '@type': 'ImageObject',
            url: imageUrl,
            width: 1200,
            height: 630
          },
          author: {
            '@type': 'Organization',
            name: this.defaultAuthor,
            url: this.baseUrl
          },
          publisher: {
            '@type': 'Organization',
            name: this.siteName,
            url: this.baseUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${this.baseUrl}/logo.png`,
              width: 200,
              height: 60
            }
          },
          datePublished: publishedAt,
          dateModified: publishedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url
          },
          articleSection: category,
          keywords: tags.join(', '),
          wordCount: content.split(/\s+/).length,
          inLanguage: 'en',
          about: {
            '@type': 'Thing',
            name: 'European Portuguese Language Learning'
          }
        },
        {
          '@type': 'WebPage',
          '@id': url,
          url,
          name: title,
          description,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${this.baseUrl}#website`
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: imageUrl
          },
          datePublished: publishedAt,
          dateModified: publishedAt,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: this.baseUrl
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${this.baseUrl}/blog`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: title,
                item: url
              }
            ]
          }
        },
        {
          '@type': 'WebSite',
          '@id': `${this.baseUrl}#website`,
          url: this.baseUrl,
          name: this.siteName,
          description: 'Learn European Portuguese with practical lessons, grammar guides, and cultural insights.',
          publisher: {
            '@type': 'Organization',
            name: this.siteName
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    };
  }

  /**
   * Analyze content for E-E-A-T factors
   */
  analyzeEEAT(content: string, title: string): EEATFactors {
    const practicalExamples = (content.match(/example|for instance|such as|like this/gi) || []).length;
    const realWorldScenarios = (content.match(/in real life|practical|everyday|common situation/gi) || []).length;
    const citations = (content.match(/according to|research shows|studies indicate/gi) || []).length;
    const externalLinks = (content.match(/https?:\/\/[^\s)]+/g) || []).length;
    const internalLinks = (content.match(/\/[a-z-]+/g) || []).length;

    return {
      experience: {
        authorCredentials: ['Language Learning Expert', 'Portuguese Native Speaker', 'Educational Content Creator'],
        practicalExamples,
        realWorldScenarios
      },
      expertise: {
        topicDepth: Math.min(10, Math.floor(content.length / 200)),
        technicalAccuracy: 9, // High accuracy for language learning content
        comprehensiveness: Math.min(10, Math.floor(content.split('\n\n').length / 2))
      },
      authoritativeness: {
        citations,
        externalLinks,
        internalLinks
      },
      trustworthiness: {
        factualAccuracy: 9, // High accuracy for educational content
        sourceCredibility: 8, // Established language learning platform
        transparency: 9 // Clear authorship and purpose
      }
    };
  }

  /**
   * Analyze content structure and readability
   */
  analyzeContent(content: string): ContentAnalysis {
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    const images = content.match(/!\[.*?\]\(.*?\)/g) || [];
    const internalLinks = content.match(/\[.*?\]\(\/[^)]+\)/g) || [];
    const externalLinks = content.match(/\[.*?\]\(https?:\/\/[^)]+\)/g) || [];

    // Calculate readability score (simplified Flesch Reading Ease)
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.estimateSyllables(words.join(' ')) / words.length;
    const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    // Calculate keyword density
    const keywordDensity: { [keyword: string]: number } = {};
    const totalWords = words.length;
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        keywordDensity[cleanWord] = (keywordDensity[cleanWord] || 0) + 1;
      }
    });

    // Convert to percentages
    Object.keys(keywordDensity).forEach(keyword => {
      keywordDensity[keyword] = (keywordDensity[keyword] / totalWords) * 100;
    });

    return {
      readabilityScore: Math.max(0, Math.min(100, readabilityScore)),
      keywordDensity,
      headingStructure: headings.map(heading => ({
        level: heading.match(/^#+/)?.[0].length || 1,
        text: heading.replace(/^#+\s+/, '')
      })),
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      imageCount: images.length,
      linkCount: {
        internal: internalLinks.length,
        external: externalLinks.length
      }
    };
  }

  /**
   * Estimate syllables in text (simplified)
   */
  private estimateSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;

    words.forEach(word => {
      const vowels = word.match(/[aeiouy]+/g);
      syllables += vowels ? vowels.length : 1;
      
      // Adjust for silent e
      if (word.endsWith('e')) {
        syllables--;
      }
      
      // Minimum of 1 syllable per word
      syllables = Math.max(syllables, 1);
    });

    return syllables;
  }

  /**
   * Generate SEO recommendations
   */
  generateRecommendations(analysis: ContentAnalysis, eeat: EEATFactors): string[] {
    const recommendations: string[] = [];

    // Content length recommendations
    if (analysis.wordCount < 300) {
      recommendations.push('Consider expanding content to at least 300 words for better SEO performance');
    } else if (analysis.wordCount > 2000) {
      recommendations.push('Content is quite long - consider breaking into multiple posts or adding a table of contents');
    }

    // Readability recommendations
    if (analysis.readabilityScore < 60) {
      recommendations.push('Content readability could be improved - consider shorter sentences and simpler words');
    }

    // Heading structure recommendations
    if (analysis.headingStructure.length === 0) {
      recommendations.push('Add headings (H2, H3) to improve content structure and SEO');
    }

    // Image recommendations
    if (analysis.imageCount === 0) {
      recommendations.push('Consider adding relevant images to improve engagement and SEO');
    }

    // Link recommendations
    if (analysis.linkCount.internal < 2) {
      recommendations.push('Add more internal links to related content to improve site structure');
    }
    if (analysis.linkCount.external === 0) {
      recommendations.push('Consider adding authoritative external links to support your content');
    }

    // E-E-A-T recommendations
    if (eeat.experience.practicalExamples < 2) {
      recommendations.push('Add more practical examples to demonstrate experience');
    }
    if (eeat.authoritativeness.citations < 1) {
      recommendations.push('Include citations or references to authoritative sources');
    }

    return recommendations;
  }
}