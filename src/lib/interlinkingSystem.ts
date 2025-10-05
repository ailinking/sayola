interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured: boolean;
  keywords?: string[];
  relatedPosts?: string[];
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  relevanceScore: number;
  relationshipType: 'category' | 'tags' | 'content' | 'keywords';
}

interface InterlinkSuggestion {
  sourcePostId: string;
  targetPostId: string;
  anchorText: string;
  context: string;
  relevanceScore: number;
  position: number;
}

export class InterlinkingSystem {
  private posts: BlogPost[] = [];
  private readonly maxRelatedPosts = 5;
  private readonly minRelevanceScore = 0.3;

  /**
   * Load all blog posts for analysis
   */
  loadPosts(posts: BlogPost[]): void {
    this.posts = posts;
  }

  /**
   * Find related posts for a given post
   */
  findRelatedPosts(postId: string): RelatedPost[] {
    const currentPost = this.posts.find(p => p.id === postId);
    if (!currentPost) return [];

    const relatedPosts: RelatedPost[] = [];

    this.posts.forEach(post => {
      if (post.id === postId) return;

      const relevanceScore = this.calculateRelevanceScore(currentPost, post);
      if (relevanceScore >= this.minRelevanceScore) {
        const relationshipType = this.determineRelationshipType(currentPost, post);
        
        relatedPosts.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          relevanceScore,
          relationshipType
        });
      }
    });

    // Sort by relevance score and return top results
    return relatedPosts
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, this.maxRelatedPosts);
  }

  /**
   * Calculate relevance score between two posts
   */
  private calculateRelevanceScore(post1: BlogPost, post2: BlogPost): number {
    let score = 0;

    // Category similarity (30% weight)
    if (post1.category === post2.category) {
      score += 0.3;
    }

    // Tag similarity (40% weight)
    const commonTags = post1.tags.filter(tag => post2.tags.includes(tag));
    const tagSimilarity = commonTags.length / Math.max(post1.tags.length, post2.tags.length);
    score += tagSimilarity * 0.4;

    // Content similarity (20% weight)
    const contentSimilarity = this.calculateContentSimilarity(post1.content, post2.content);
    score += contentSimilarity * 0.2;

    // Keyword similarity (10% weight)
    if (post1.keywords && post2.keywords) {
      const commonKeywords = post1.keywords.filter(keyword => 
        post2.keywords!.includes(keyword)
      );
      const keywordSimilarity = commonKeywords.length / Math.max(post1.keywords.length, post2.keywords.length);
      score += keywordSimilarity * 0.1;
    }

    return Math.min(1, score);
  }

  /**
   * Calculate content similarity using simple text analysis
   */
  private calculateContentSimilarity(content1: string, content2: string): number {
    const words1 = this.extractSignificantWords(content1);
    const words2 = this.extractSignificantWords(content2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Extract significant words from content
   */
  private extractSignificantWords(content: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);

    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 50); // Limit to top 50 words for performance
  }

  /**
   * Determine the type of relationship between posts
   */
  private determineRelationshipType(post1: BlogPost, post2: BlogPost): 'category' | 'tags' | 'content' | 'keywords' {
    if (post1.category === post2.category) {
      return 'category';
    }

    const commonTags = post1.tags.filter(tag => post2.tags.includes(tag));
    if (commonTags.length > 0) {
      return 'tags';
    }

    if (post1.keywords && post2.keywords) {
      const commonKeywords = post1.keywords.filter(keyword => 
        post2.keywords!.includes(keyword)
      );
      if (commonKeywords.length > 0) {
        return 'keywords';
      }
    }

    return 'content';
  }

  /**
   * Generate interlink suggestions for a post
   */
  generateInterlinkSuggestions(postId: string): InterlinkSuggestion[] {
    const currentPost = this.posts.find(p => p.id === postId);
    if (!currentPost) return [];

    const relatedPosts = this.findRelatedPosts(postId);
    const suggestions: InterlinkSuggestion[] = [];

    relatedPosts.forEach(relatedPost => {
      const anchorTexts = this.generateAnchorTexts(currentPost, relatedPost);
      const contexts = this.findLinkingContexts(currentPost.content, relatedPost);

      contexts.forEach((context, index) => {
        if (index < anchorTexts.length) {
          suggestions.push({
            sourcePostId: postId,
            targetPostId: relatedPost.id,
            anchorText: anchorTexts[index],
            context: context.text,
            relevanceScore: relatedPost.relevanceScore,
            position: context.position
          });
        }
      });
    });

    return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Generate appropriate anchor texts for linking
   */
  private generateAnchorTexts(sourcePost: BlogPost, targetPost: RelatedPost): string[] {
    const anchorTexts: string[] = [];

    // Use post title variations
    anchorTexts.push(targetPost.title);
    
    // Use category-based anchors
    if (targetPost.relationshipType === 'category') {
      anchorTexts.push(`more about ${targetPost.category.toLowerCase()}`);
      anchorTexts.push(`${targetPost.category.toLowerCase()} guide`);
    }

    // Use tag-based anchors
    const commonTags = sourcePost.tags.filter(tag => targetPost.tags.includes(tag));
    commonTags.forEach(tag => {
      anchorTexts.push(`${tag.toLowerCase()} examples`);
      anchorTexts.push(`learn ${tag.toLowerCase()}`);
    });

    // Generic helpful anchors
    anchorTexts.push('related article');
    anchorTexts.push('helpful guide');
    anchorTexts.push('detailed explanation');

    return anchorTexts.slice(0, 3); // Limit to 3 anchor text options
  }

  /**
   * Find appropriate contexts for linking within content
   */
  private findLinkingContexts(content: string, targetPost: RelatedPost): { text: string; position: number }[] {
    const contexts: { text: string; position: number }[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length < 20) return; // Skip very short sentences

      // Look for sentences that mention related topics
      const relevantKeywords = [
        ...targetPost.tags.map(tag => tag.toLowerCase()),
        targetPost.category.toLowerCase(),
        ...this.extractSignificantWords(targetPost.excerpt).slice(0, 5)
      ];

      const sentenceLower = trimmedSentence.toLowerCase();
      const hasRelevantKeyword = relevantKeywords.some(keyword => 
        sentenceLower.includes(keyword)
      );

      if (hasRelevantKeyword) {
        contexts.push({
          text: trimmedSentence,
          position: index
        });
      }
    });

    return contexts.slice(0, 2); // Limit to 2 contexts per related post
  }

  /**
   * Update post with related posts
   */
  updatePostRelations(postId: string): BlogPost | null {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    const relatedPosts = this.findRelatedPosts(postId);
    post.relatedPosts = relatedPosts.map(rp => rp.id);

    return post;
  }

  /**
   * Update all posts with related posts
   */
  updateAllPostRelations(): BlogPost[] {
    this.posts.forEach(post => {
      this.updatePostRelations(post.id);
    });

    return this.posts;
  }

  /**
   * Generate automatic internal links for content
   */
  generateAutomaticLinks(content: string, currentPostId: string): string {
    let updatedContent = content;
    const suggestions = this.generateInterlinkSuggestions(currentPostId);

    // Sort suggestions by position to avoid index shifting
    const sortedSuggestions = suggestions
      .filter(s => s.relevanceScore > 0.5) // Only high-relevance links
      .sort((a, b) => b.position - a.position)
      .slice(0, 3); // Limit to 3 automatic links

    sortedSuggestions.forEach(suggestion => {
      const targetPost = this.posts.find(p => p.id === suggestion.targetPostId);
      if (!targetPost) return;

      const linkMarkdown = `[${suggestion.anchorText}](/blog/${targetPost.slug})`;
      
      // Find the sentence and add the link at the end
      const sentences = updatedContent.split(/([.!?]+)/);
      if (suggestion.position < sentences.length) {
        const sentenceIndex = suggestion.position * 2; // Account for separators
        if (sentences[sentenceIndex] && !sentences[sentenceIndex].includes('](/blog/')) {
          sentences[sentenceIndex] += ` ${linkMarkdown}`;
        }
      }
      
      updatedContent = sentences.join('');
    });

    return updatedContent;
  }

  /**
   * Get posts that should link to a specific post
   */
  getBacklinkOpportunities(targetPostId: string): RelatedPost[] {
    const targetPost = this.posts.find(p => p.id === targetPostId);
    if (!targetPost) return [];

    const backlinkOpportunities: RelatedPost[] = [];

    this.posts.forEach(post => {
      if (post.id === targetPostId) return;

      const relevanceScore = this.calculateRelevanceScore(post, targetPost);
      if (relevanceScore >= this.minRelevanceScore) {
        const relationshipType = this.determineRelationshipType(post, targetPost);
        
        backlinkOpportunities.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          relevanceScore,
          relationshipType
        });
      }
    });

    return backlinkOpportunities
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, this.maxRelatedPosts);
  }

  /**
   * Generate a site-wide linking report
   */
  generateLinkingReport(): {
    totalPosts: number;
    averageRelatedPosts: number;
    postsWithoutRelations: number;
    topLinkedPosts: { postId: string; title: string; linkCount: number }[];
  } {
    const totalPosts = this.posts.length;
    let totalRelations = 0;
    let postsWithoutRelations = 0;
    const linkCounts: { [postId: string]: number } = {};

    this.posts.forEach(post => {
      const relatedPosts = this.findRelatedPosts(post.id);
      totalRelations += relatedPosts.length;
      
      if (relatedPosts.length === 0) {
        postsWithoutRelations++;
      }

      // Count how many times this post is linked to
      linkCounts[post.id] = 0;
      this.posts.forEach(otherPost => {
        if (otherPost.id !== post.id) {
          const otherRelated = this.findRelatedPosts(otherPost.id);
          if (otherRelated.some(rp => rp.id === post.id)) {
            linkCounts[post.id]++;
          }
        }
      });
    });

    const averageRelatedPosts = totalPosts > 0 ? totalRelations / totalPosts : 0;
    
    const topLinkedPosts = Object.entries(linkCounts)
      .map(([postId, linkCount]) => {
        const post = this.posts.find(p => p.id === postId);
        return {
          postId,
          title: post?.title || 'Unknown',
          linkCount
        };
      })
      .sort((a, b) => b.linkCount - a.linkCount)
      .slice(0, 10);

    return {
      totalPosts,
      averageRelatedPosts,
      postsWithoutRelations,
      topLinkedPosts
    };
  }
}