interface TaggingResult {
  category: string;
  tags: string[];
  confidence: number;
  suggestedTags: string[];
}

interface CategoryDefinition {
  name: string;
  keywords: string[];
  weight: number;
  description: string;
}

interface TagDefinition {
  name: string;
  keywords: string[];
  category: string;
  weight: number;
}

export class AutoTagger {
  private readonly categories: CategoryDefinition[] = [
    {
      name: 'Grammar',
      keywords: ['verb', 'noun', 'adjective', 'conjugation', 'tense', 'grammar', 'syntax', 'sentence', 'clause', 'pronoun', 'article', 'preposition'],
      weight: 1.0,
      description: 'Portuguese grammar rules, verb conjugations, and sentence structure'
    },
    {
      name: 'Vocabulary',
      keywords: ['word', 'vocabulary', 'meaning', 'definition', 'synonym', 'antonym', 'expression', 'phrase', 'idiom', 'slang'],
      weight: 1.0,
      description: 'Portuguese vocabulary, words, phrases, and expressions'
    },
    {
      name: 'Pronunciation',
      keywords: ['pronunciation', 'accent', 'sound', 'phonetic', 'stress', 'intonation', 'rhythm', 'speak', 'speaking'],
      weight: 1.0,
      description: 'Portuguese pronunciation, accents, and speaking techniques'
    },
    {
      name: 'Culture',
      keywords: ['culture', 'tradition', 'custom', 'festival', 'food', 'music', 'art', 'history', 'society', 'lifestyle'],
      weight: 0.9,
      description: 'Portuguese and Lusophone culture, traditions, and customs'
    },
    {
      name: 'Conversation',
      keywords: ['conversation', 'dialogue', 'chat', 'talk', 'discuss', 'communicate', 'interaction', 'social', 'practice'],
      weight: 0.9,
      description: 'Conversational Portuguese and communication skills'
    },
    {
      name: 'Travel',
      keywords: ['travel', 'trip', 'vacation', 'tourist', 'hotel', 'restaurant', 'airport', 'transport', 'direction', 'map'],
      weight: 0.8,
      description: 'Portuguese for travel and tourism'
    },
    {
      name: 'Business',
      keywords: ['business', 'work', 'job', 'office', 'meeting', 'professional', 'career', 'interview', 'email', 'formal'],
      weight: 0.8,
      description: 'Business Portuguese and professional communication'
    },
    {
      name: 'Beginner',
      keywords: ['beginner', 'basic', 'start', 'introduction', 'first', 'simple', 'easy', 'fundamental', 'elementary'],
      weight: 0.7,
      description: 'Content for Portuguese language beginners'
    },
    {
      name: 'Intermediate',
      keywords: ['intermediate', 'medium', 'progress', 'advance', 'develop', 'improve', 'practice', 'complex'],
      weight: 0.7,
      description: 'Content for intermediate Portuguese learners'
    },
    {
      name: 'Advanced',
      keywords: ['advanced', 'complex', 'sophisticated', 'nuanced', 'expert', 'mastery', 'fluent', 'proficient'],
      weight: 0.7,
      description: 'Content for advanced Portuguese learners'
    }
  ];

  private readonly tags: TagDefinition[] = [
    // Grammar tags
    { name: 'Verbs', keywords: ['verb', 'conjugation', 'tense', 'infinitive', 'gerund', 'participle'], category: 'Grammar', weight: 1.0 },
    { name: 'Nouns', keywords: ['noun', 'gender', 'masculine', 'feminine', 'plural', 'singular'], category: 'Grammar', weight: 1.0 },
    { name: 'Adjectives', keywords: ['adjective', 'describe', 'quality', 'characteristic', 'agreement'], category: 'Grammar', weight: 1.0 },
    { name: 'Present Tense', keywords: ['present', 'now', 'currently', 'today', 'presente'], category: 'Grammar', weight: 0.9 },
    { name: 'Past Tense', keywords: ['past', 'yesterday', 'before', 'pretérito', 'imperfeito'], category: 'Grammar', weight: 0.9 },
    { name: 'Future Tense', keywords: ['future', 'tomorrow', 'will', 'going to', 'futuro'], category: 'Grammar', weight: 0.9 },
    { name: 'Subjunctive', keywords: ['subjunctive', 'doubt', 'emotion', 'wish', 'conjuntivo'], category: 'Grammar', weight: 0.8 },
    
    // Vocabulary tags
    { name: 'Family', keywords: ['family', 'mother', 'father', 'brother', 'sister', 'parent', 'child'], category: 'Vocabulary', weight: 0.9 },
    { name: 'Food', keywords: ['food', 'eat', 'drink', 'restaurant', 'meal', 'breakfast', 'lunch', 'dinner'], category: 'Vocabulary', weight: 0.9 },
    { name: 'Colors', keywords: ['color', 'red', 'blue', 'green', 'yellow', 'black', 'white'], category: 'Vocabulary', weight: 0.8 },
    { name: 'Numbers', keywords: ['number', 'count', 'one', 'two', 'three', 'first', 'second'], category: 'Vocabulary', weight: 0.8 },
    { name: 'Time', keywords: ['time', 'hour', 'minute', 'day', 'week', 'month', 'year', 'clock'], category: 'Vocabulary', weight: 0.8 },
    { name: 'Weather', keywords: ['weather', 'rain', 'sun', 'cloud', 'wind', 'hot', 'cold'], category: 'Vocabulary', weight: 0.7 },
    
    // Pronunciation tags
    { name: 'Accent Marks', keywords: ['accent', 'acute', 'grave', 'circumflex', 'tilde', 'cedilla'], category: 'Pronunciation', weight: 0.9 },
    { name: 'Nasal Sounds', keywords: ['nasal', 'ão', 'ãe', 'nh', 'nasalization'], category: 'Pronunciation', weight: 0.8 },
    { name: 'R Sounds', keywords: ['r sound', 'rolling r', 'guttural r', 'pronunciation r'], category: 'Pronunciation', weight: 0.8 },
    
    // Culture tags
    { name: 'Portugal', keywords: ['portugal', 'portuguese', 'lisbon', 'porto', 'fado', 'azulejo'], category: 'Culture', weight: 0.9 },
    { name: 'Brazil', keywords: ['brazil', 'brazilian', 'rio', 'são paulo', 'samba', 'carnival'], category: 'Culture', weight: 0.9 },
    { name: 'Festivals', keywords: ['festival', 'celebration', 'holiday', 'carnival', 'festa'], category: 'Culture', weight: 0.8 },
    { name: 'Music', keywords: ['music', 'song', 'fado', 'samba', 'bossa nova', 'instrument'], category: 'Culture', weight: 0.8 },
    
    // Conversation tags
    { name: 'Greetings', keywords: ['greeting', 'hello', 'goodbye', 'good morning', 'good night'], category: 'Conversation', weight: 0.9 },
    { name: 'Politeness', keywords: ['polite', 'please', 'thank you', 'excuse me', 'sorry'], category: 'Conversation', weight: 0.9 },
    { name: 'Questions', keywords: ['question', 'ask', 'what', 'where', 'when', 'why', 'how'], category: 'Conversation', weight: 0.8 },
    
    // Travel tags
    { name: 'Transportation', keywords: ['transport', 'bus', 'train', 'plane', 'car', 'taxi', 'metro'], category: 'Travel', weight: 0.9 },
    { name: 'Accommodation', keywords: ['hotel', 'hostel', 'room', 'reservation', 'check-in', 'check-out'], category: 'Travel', weight: 0.8 },
    { name: 'Directions', keywords: ['direction', 'left', 'right', 'straight', 'north', 'south', 'map'], category: 'Travel', weight: 0.8 },
    
    // Business tags
    { name: 'Meetings', keywords: ['meeting', 'conference', 'presentation', 'agenda', 'schedule'], category: 'Business', weight: 0.9 },
    { name: 'Email', keywords: ['email', 'message', 'formal', 'informal', 'correspondence'], category: 'Business', weight: 0.8 },
    { name: 'Job Interview', keywords: ['interview', 'job', 'career', 'resume', 'qualification'], category: 'Business', weight: 0.8 }
  ];

  /**
   * Automatically tag and categorize content
   */
  analyzeContent(title: string, content: string): TaggingResult {
    const text = (title + ' ' + content).toLowerCase();
    const words = this.extractWords(text);
    
    // Calculate category scores
    const categoryScores = this.calculateCategoryScores(words);
    const bestCategory = this.getBestCategory(categoryScores);
    
    // Calculate tag scores
    const tagScores = this.calculateTagScores(words, bestCategory.name);
    const selectedTags = this.selectBestTags(tagScores);
    
    // Generate additional suggested tags
    const suggestedTags = this.generateSuggestedTags(words, selectedTags);
    
    return {
      category: bestCategory.name,
      tags: selectedTags,
      confidence: bestCategory.score,
      suggestedTags
    };
  }

  /**
   * Extract meaningful words from text
   */
  private extractWords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
      'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'ours', 'theirs'
    ]);

    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .map(word => word.toLowerCase());
  }

  /**
   * Calculate scores for each category
   */
  private calculateCategoryScores(words: string[]): { [category: string]: number } {
    const scores: { [category: string]: number } = {};
    
    this.categories.forEach(category => {
      let score = 0;
      let matches = 0;
      
      category.keywords.forEach(keyword => {
        const keywordWords = keyword.split(' ');
        const keywordMatches = keywordWords.every(kw => 
          words.some(word => word.includes(kw) || kw.includes(word))
        );
        
        if (keywordMatches) {
          score += category.weight;
          matches++;
        }
      });
      
      // Normalize score by content length and keyword matches
      scores[category.name] = (score * matches) / Math.max(words.length / 100, 1);
    });
    
    return scores;
  }

  /**
   * Get the best category with highest score
   */
  private getBestCategory(categoryScores: { [category: string]: number }): { name: string; score: number } {
    let bestCategory = 'Grammar';
    let bestScore = 0;
    
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score > bestScore) {
        bestCategory = category;
        bestScore = score;
      }
    });
    
    return { name: bestCategory, score: Math.min(1, bestScore) };
  }

  /**
   * Calculate scores for tags
   */
  private calculateTagScores(words: string[], primaryCategory: string): { [tag: string]: number } {
    const scores: { [tag: string]: number } = {};
    
    this.tags.forEach(tag => {
      let score = 0;
      let matches = 0;
      
      tag.keywords.forEach(keyword => {
        const keywordWords = keyword.split(' ');
        const keywordMatches = keywordWords.every(kw => 
          words.some(word => word.includes(kw) || kw.includes(word))
        );
        
        if (keywordMatches) {
          score += tag.weight;
          matches++;
        }
      });
      
      // Boost score if tag belongs to primary category
      if (tag.category === primaryCategory) {
        score *= 1.5;
      }
      
      // Normalize score
      scores[tag.name] = (score * matches) / Math.max(words.length / 50, 1);
    });
    
    return scores;
  }

  /**
   * Select the best tags based on scores
   */
  private selectBestTags(tagScores: { [tag: string]: number }): string[] {
    const sortedTags = Object.entries(tagScores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0.1); // Minimum threshold
    
    // Select top 5-8 tags
    const selectedTags = sortedTags.slice(0, 8).map(([tag]) => tag);
    
    // Ensure we have at least 3 tags
    if (selectedTags.length < 3) {
      const additionalTags = sortedTags
        .slice(selectedTags.length, selectedTags.length + (3 - selectedTags.length))
        .map(([tag]) => tag);
      selectedTags.push(...additionalTags);
    }
    
    return selectedTags;
  }

  /**
   * Generate additional suggested tags
   */
  private generateSuggestedTags(words: string[], selectedTags: string[]): string[] {
    const suggested: string[] = [];
    
    // Add level-based tags based on content complexity
    const complexWords = words.filter(word => word.length > 8).length;
    const totalWords = words.length;
    const complexityRatio = complexWords / totalWords;
    
    if (complexityRatio < 0.1) {
      suggested.push('Beginner');
    } else if (complexityRatio < 0.2) {
      suggested.push('Intermediate');
    } else {
      suggested.push('Advanced');
    }
    
    // Add Portuguese-specific tags
    const portugueseIndicators = [
      'portuguese', 'portugal', 'brazil', 'lusophone', 'european portuguese', 'brazilian portuguese'
    ];
    
    const hasPortugueseContext = portugueseIndicators.some(indicator =>
      words.some(word => word.includes(indicator.replace(' ', '')))
    );
    
    if (hasPortugueseContext) {
      if (words.some(word => word.includes('european') || word.includes('portugal'))) {
        suggested.push('European Portuguese');
      }
      if (words.some(word => word.includes('brazilian') || word.includes('brazil'))) {
        suggested.push('Brazilian Portuguese');
      }
    }
    
    // Add practical tags
    if (words.some(word => ['example', 'practice', 'exercise', 'tip'].includes(word))) {
      suggested.push('Practical');
    }
    
    if (words.some(word => ['common', 'everyday', 'daily', 'useful'].includes(word))) {
      suggested.push('Everyday Portuguese');
    }
    
    // Filter out already selected tags
    return suggested.filter(tag => !selectedTags.includes(tag));
  }

  /**
   * Get all available categories
   */
  getCategories(): CategoryDefinition[] {
    return this.categories;
  }

  /**
   * Get all available tags
   */
  getTags(): TagDefinition[] {
    return this.tags;
  }

  /**
   * Get tags by category
   */
  getTagsByCategory(category: string): TagDefinition[] {
    return this.tags.filter(tag => tag.category === category);
  }

  /**
   * Validate and clean tags
   */
  validateTags(tags: string[]): string[] {
    const validTags = this.tags.map(tag => tag.name);
    return tags.filter(tag => validTags.includes(tag) || tag.length > 2);
  }

  /**
   * Get related tags for a given tag
   */
  getRelatedTags(tagName: string): string[] {
    const tag = this.tags.find(t => t.name === tagName);
    if (!tag) return [];
    
    // Find tags in the same category
    const relatedTags = this.tags
      .filter(t => t.category === tag.category && t.name !== tagName)
      .map(t => t.name);
    
    return relatedTags.slice(0, 5);
  }
}