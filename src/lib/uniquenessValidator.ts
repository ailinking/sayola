interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  publishedAt: string;
}

interface UniquenessResult {
  isUnique: boolean;
  similarityScore: number;
  duplicateContent: {
    postId: string;
    title: string;
    similarityPercentage: number;
    duplicateSegments: string[];
  }[];
  recommendations: string[];
}

interface ContentSegment {
  text: string;
  hash: string;
  position: number;
}

export class UniquenessValidator {
  private readonly minSimilarityThreshold = 0.3; // 30% similarity threshold
  private readonly segmentLength = 50; // Words per segment for comparison
  private readonly minSegmentSimilarity = 0.8; // 80% similarity for segment match

  /**
   * Validate content uniqueness against existing posts
   */
  validateUniqueness(newContent: string, newTitle: string, existingPosts: BlogPost[]): UniquenessResult {
    const duplicateContent: UniquenessResult['duplicateContent'] = [];
    let maxSimilarity = 0;

    // Check against each existing post
    existingPosts.forEach(post => {
      const titleSimilarity = this.calculateTextSimilarity(newTitle, post.title);
      const contentSimilarity = this.calculateTextSimilarity(newContent, post.content);
      const overallSimilarity = Math.max(titleSimilarity, contentSimilarity);

      if (overallSimilarity > this.minSimilarityThreshold) {
        const duplicateSegments = this.findDuplicateSegments(newContent, post.content);
        
        duplicateContent.push({
          postId: post.id,
          title: post.title,
          similarityPercentage: Math.round(overallSimilarity * 100),
          duplicateSegments
        });
      }

      maxSimilarity = Math.max(maxSimilarity, overallSimilarity);
    });

    const isUnique = maxSimilarity < this.minSimilarityThreshold;
    const recommendations = this.generateRecommendations(duplicateContent, maxSimilarity);

    return {
      isUnique,
      similarityScore: maxSimilarity,
      duplicateContent: duplicateContent.sort((a, b) => b.similarityPercentage - a.similarityPercentage),
      recommendations
    };
  }

  /**
   * Calculate text similarity using multiple algorithms
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    // Normalize texts
    const normalized1 = this.normalizeText(text1);
    const normalized2 = this.normalizeText(text2);

    // Calculate different similarity metrics
    const jaccardSimilarity = this.calculateJaccardSimilarity(normalized1, normalized2);
    const cosineSimilarity = this.calculateCosineSimilarity(normalized1, normalized2);
    const levenshteinSimilarity = this.calculateLevenshteinSimilarity(normalized1, normalized2);

    // Weighted average of different metrics
    return (jaccardSimilarity * 0.4 + cosineSimilarity * 0.4 + levenshteinSimilarity * 0.2);
  }

  /**
   * Normalize text for comparison
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate Jaccard similarity coefficient
   */
  private calculateJaccardSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));

    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  /**
   * Calculate cosine similarity
   */
  private calculateCosineSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');

    // Create word frequency vectors
    const allWords = [...new Set([...words1, ...words2])];
    const vector1 = allWords.map(word => words1.filter(w => w === word).length);
    const vector2 = allWords.map(word => words2.filter(w => w === word).length);

    // Calculate dot product
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);

    // Calculate magnitudes
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    return magnitude1 === 0 || magnitude2 === 0 ? 0 : dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Calculate Levenshtein similarity
   */
  private calculateLevenshteinSimilarity(text1: string, text2: string): number {
    const distance = this.levenshteinDistance(text1, text2);
    const maxLength = Math.max(text1.length, text2.length);
    
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Find duplicate segments between two texts
   */
  private findDuplicateSegments(text1: string, text2: string): string[] {
    const segments1 = this.createSegments(text1);
    const segments2 = this.createSegments(text2);
    const duplicateSegments: string[] = [];

    segments1.forEach(segment1 => {
      segments2.forEach(segment2 => {
        const similarity = this.calculateTextSimilarity(segment1.text, segment2.text);
        if (similarity > this.minSegmentSimilarity) {
          duplicateSegments.push(segment1.text);
        }
      });
    });

    return [...new Set(duplicateSegments)]; // Remove duplicates
  }

  /**
   * Create text segments for comparison
   */
  private createSegments(text: string): ContentSegment[] {
    const words = text.split(' ');
    const segments: ContentSegment[] = [];

    for (let i = 0; i < words.length - this.segmentLength + 1; i++) {
      const segmentWords = words.slice(i, i + this.segmentLength);
      const segmentText = segmentWords.join(' ');
      const hash = this.simpleHash(segmentText);

      segments.push({
        text: segmentText,
        hash,
        position: i
      });
    }

    return segments;
  }

  /**
   * Simple hash function for text segments
   */
  private simpleHash(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Generate recommendations for improving uniqueness
   */
  private generateRecommendations(duplicateContent: UniquenessResult['duplicateContent'], maxSimilarity: number): string[] {
    const recommendations: string[] = [];

    if (maxSimilarity > 0.7) {
      recommendations.push('Content is very similar to existing posts. Consider completely rewriting with a different approach.');
    } else if (maxSimilarity > 0.5) {
      recommendations.push('Content has significant similarities. Rewrite duplicate sections and add more original insights.');
    } else if (maxSimilarity > 0.3) {
      recommendations.push('Some similarities detected. Review and modify similar sections to improve uniqueness.');
    }

    if (duplicateContent.length > 0) {
      recommendations.push(`Found similarities with ${duplicateContent.length} existing post(s). Review the highlighted sections.`);
      
      duplicateContent.forEach(duplicate => {
        if (duplicate.duplicateSegments.length > 0) {
          recommendations.push(`Rewrite sections similar to "${duplicate.title}" (${duplicate.similarityPercentage}% similar).`);
        }
      });
    }

    // General recommendations for improving uniqueness
    if (maxSimilarity > this.minSimilarityThreshold) {
      recommendations.push('Add more personal insights and unique perspectives.');
      recommendations.push('Include specific examples and case studies.');
      recommendations.push('Use different vocabulary and sentence structures.');
      recommendations.push('Add original research or data points.');
      recommendations.push('Include practical exercises or activities.');
    }

    return recommendations;
  }

  /**
   * Check title uniqueness
   */
  validateTitleUniqueness(newTitle: string, existingPosts: BlogPost[]): {
    isUnique: boolean;
    similarTitles: { postId: string; title: string; similarity: number }[];
  } {
    const similarTitles: { postId: string; title: string; similarity: number }[] = [];

    existingPosts.forEach(post => {
      const similarity = this.calculateTextSimilarity(newTitle, post.title);
      if (similarity > 0.5) { // 50% similarity threshold for titles
        similarTitles.push({
          postId: post.id,
          title: post.title,
          similarity: Math.round(similarity * 100) / 100
        });
      }
    });

    return {
      isUnique: similarTitles.length === 0,
      similarTitles: similarTitles.sort((a, b) => b.similarity - a.similarity)
    };
  }

  /**
   * Generate content uniqueness report
   */
  generateUniquenessReport(posts: BlogPost[]): {
    totalPosts: number;
    uniquePosts: number;
    duplicatePairs: { post1: string; post2: string; similarity: number }[];
    averageUniqueness: number;
  } {
    const duplicatePairs: { post1: string; post2: string; similarity: number }[] = [];
    let totalSimilarity = 0;
    let comparisons = 0;

    for (let i = 0; i < posts.length; i++) {
      for (let j = i + 1; j < posts.length; j++) {
        const similarity = this.calculateTextSimilarity(posts[i].content, posts[j].content);
        totalSimilarity += similarity;
        comparisons++;

        if (similarity > this.minSimilarityThreshold) {
          duplicatePairs.push({
            post1: posts[i].title,
            post2: posts[j].title,
            similarity: Math.round(similarity * 100) / 100
          });
        }
      }
    }

    const averageUniqueness = comparisons > 0 ? 1 - (totalSimilarity / comparisons) : 1;
    const uniquePosts = posts.length - duplicatePairs.length;

    return {
      totalPosts: posts.length,
      uniquePosts,
      duplicatePairs: duplicatePairs.sort((a, b) => b.similarity - a.similarity),
      averageUniqueness: Math.round(averageUniqueness * 100) / 100
    };
  }

  /**
   * Suggest content improvements for uniqueness
   */
  suggestImprovements(content: string, duplicateSegments: string[]): string[] {
    const suggestions: string[] = [];

    // Analyze content structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const words = content.split(/\s+/);

    // Content length suggestions
    if (words.length < 500) {
      suggestions.push('Expand content to at least 500 words for better uniqueness.');
    }

    // Structure suggestions
    if (paragraphs.length < 3) {
      suggestions.push('Break content into more paragraphs for better structure.');
    }

    if (sentences.length < 10) {
      suggestions.push('Add more detailed explanations and examples.');
    }

    // Specific improvements for duplicate segments
    if (duplicateSegments.length > 0) {
      suggestions.push('Rewrite the following similar sections:');
      duplicateSegments.slice(0, 3).forEach(segment => {
        suggestions.push(`- "${segment.substring(0, 100)}..."`);
      });
    }

    // General uniqueness improvements
    suggestions.push('Add personal anecdotes or experiences.');
    suggestions.push('Include specific Portuguese examples with translations.');
    suggestions.push('Add practical exercises or activities.');
    suggestions.push('Include cultural context and real-world applications.');
    suggestions.push('Use varied sentence structures and vocabulary.');

    return suggestions;
  }
}