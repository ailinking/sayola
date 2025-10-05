import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { SEOOptimizer } from './seoOptimizer';
import { AutoTagger } from './autoTagger';
import { InterlinkingSystem } from './interlinkingSystem';
import { UniquenessValidator } from './uniquenessValidator';

// Types for blog post structure
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  slug: string;
  relatedPosts: string[];
  seoMetadata?: any;
}

export interface BlogTopic {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keywords: string[];
}

// Portuguese learning topics database
const PORTUGUESE_LEARNING_TOPICS: BlogTopic[] = [
  {
    title: "Using Portuguese Gestures and Body Language in Conversation",
    description: "Learn essential Portuguese gestures and non-verbal communication that complement spoken language",
    category: "Culture",
    difficulty: "intermediate",
    keywords: ["gestures", "body language", "non-verbal", "communication", "culture"]
  },
  {
    title: "Portuguese Diminutives: Adding Warmth to Your Speech",
    description: "Master the use of diminutives (-inho, -inha) to sound more natural and affectionate",
    category: "Grammar",
    difficulty: "intermediate",
    keywords: ["diminutives", "suffixes", "affection", "natural speech", "grammar"]
  },
  {
    title: "Navigating Portuguese Banking and Financial Terms",
    description: "Essential vocabulary and phrases for banking, investments, and financial transactions in Portugal",
    category: "Vocabulary",
    difficulty: "advanced",
    keywords: ["banking", "finance", "money", "transactions", "business"]
  },
  {
    title: "Portuguese Weather Expressions and Seasonal Vocabulary",
    description: "Learn to discuss weather patterns, seasons, and climate with authentic Portuguese expressions",
    category: "Vocabulary",
    difficulty: "beginner",
    keywords: ["weather", "seasons", "climate", "expressions", "daily conversation"]
  },
  {
    title: "Understanding Portuguese Regional Accents and Dialects",
    description: "Navigate the differences between Northern, Central, and Southern Portuguese accents",
    category: "Pronunciation",
    difficulty: "advanced",
    keywords: ["accents", "dialects", "regional", "pronunciation", "listening"]
  },
  {
    title: "Portuguese Cooking Vocabulary: From Market to Table",
    description: "Master culinary terms, cooking methods, and food-related conversations",
    category: "Vocabulary",
    difficulty: "intermediate",
    keywords: ["cooking", "food", "kitchen", "recipes", "culinary"]
  },
  {
    title: "Using Portuguese Reflexive Pronouns Correctly",
    description: "Understand when and how to use reflexive pronouns in different contexts",
    category: "Grammar",
    difficulty: "intermediate",
    keywords: ["reflexive pronouns", "grammar", "pronouns", "syntax", "usage"]
  },
  {
    title: "Portuguese Email and Formal Writing Etiquette",
    description: "Learn proper formal writing conventions for business and academic contexts",
    category: "Writing",
    difficulty: "advanced",
    keywords: ["formal writing", "email", "business", "etiquette", "professional"]
  },
  {
    title: "Mastering Portuguese Conditional Sentences",
    description: "Learn to express hypothetical situations and conditions naturally",
    category: "Grammar",
    difficulty: "advanced",
    keywords: ["conditional", "hypothetical", "if clauses", "subjunctive", "grammar"]
  },
  {
    title: "Portuguese Transportation and Travel Vocabulary",
    description: "Navigate public transport, airports, and travel situations with confidence",
    category: "Vocabulary",
    difficulty: "beginner",
    keywords: ["transportation", "travel", "public transport", "airport", "navigation"]
  }
];

export class BlogGenerator {
  private readonly blogDir = path.join(process.cwd(), 'content', 'blog');
  private readonly usedTopicsFile = path.join(this.blogDir, 'used-topics.json');
  private readonly counterFile = path.join(this.blogDir, 'post-counter.json');
  private readonly seoOptimizer = new SEOOptimizer();
  private readonly autoTagger = new AutoTagger();
  private readonly interlinkingSystem = new InterlinkingSystem();
  private readonly uniquenessValidator = new UniquenessValidator();
  private readonly existingPosts: BlogPost[] = [];
  private postCounter: number = 1;

  constructor() {
    this.ensureBlogDirectory();
    this.loadExistingPosts();
    this.loadPostCounter();
  }

  private async ensureBlogDirectory(): Promise<void> {
    if (!existsSync(this.blogDir)) {
      await mkdir(this.blogDir, { recursive: true });
    }
  }

  private async loadExistingPosts(): Promise<void> {
    try {
      const postsFile = path.join(this.blogDir, 'posts.json');
      if (existsSync(postsFile)) {
        const data = await readFile(postsFile, 'utf-8');
        this.existingPosts.push(...JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading existing posts:', error);
    }
  }

  private async loadPostCounter(): Promise<void> {
    try {
      if (existsSync(this.counterFile)) {
        const counterData = await readFile(this.counterFile, 'utf-8');
        const { counter } = JSON.parse(counterData);
        this.postCounter = counter || 1;
      } else {
        // Initialize counter based on existing posts
        this.postCounter = this.existingPosts.length + 1;
        await this.savePostCounter();
      }
    } catch (error) {
      console.error('Error loading post counter:', error);
      this.postCounter = 1;
    }
  }

  private async savePostCounter(): Promise<void> {
    try {
      await writeFile(this.counterFile, JSON.stringify({ counter: this.postCounter }, null, 2));
    } catch (error) {
      console.error('Error saving post counter:', error);
    }
  }

  private async savePost(post: BlogPost): Promise<void> {
    // Save individual post file
    const postFile = path.join(this.blogDir, `${post.slug}.json`);
    await writeFile(postFile, JSON.stringify(post, null, 2));

    // Update posts index
    this.existingPosts.push(post);
    const postsFile = path.join(this.blogDir, 'posts.json');
    await writeFile(postsFile, JSON.stringify(this.existingPosts, null, 2));

    // Increment and save counter for next post
    this.postCounter++;
    await this.savePostCounter();
  }

  private generateSlug(): string {
    return this.postCounter.toString();
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  private generateSEOKeywords(topic: BlogTopic, content: string): string[] {
    const baseKeywords = [
      'Portuguese learning',
      'European Portuguese',
      'Portuguese language',
      'learn Portuguese',
      'Portuguese grammar',
      'Portuguese vocabulary'
    ];

    return [...baseKeywords, ...topic.keywords].slice(0, 10);
  }

  private findRelatedPosts(currentTopic: BlogTopic): string[] {
    return this.existingPosts
      .filter(post => 
        post.category === currentTopic.category ||
        post.tags.some(tag => currentTopic.keywords.includes(tag))
      )
      .slice(0, 3)
      .map(post => post.slug);
  }

  private generateContent(topic: BlogTopic): string {
    // This is a template-based content generator
    // In a real implementation, you might integrate with an AI service like OpenAI
    const sections = [
      {
        title: "Introduction",
        content: `Learning ${topic.title.toLowerCase()} is an essential skill for anyone serious about mastering European Portuguese. This practical guide will help you understand and apply these concepts in real-world situations.`
      },
      {
        title: "Why This Matters",
        content: `Understanding ${topic.description.toLowerCase()} will significantly improve your communication skills and help you sound more natural when speaking Portuguese.`
      },
      {
        title: "Practical Examples",
        content: `Let's explore some real-world scenarios where you'll use these concepts:\n\n• Daily conversations with Portuguese speakers\n• Professional interactions in Portugal\n• Social situations and cultural events\n• Academic or business presentations`
      },
      {
        title: "Step-by-Step Guide",
        content: `Follow these practical steps to master this concept:\n\n1. **Start with the basics**: Begin with simple examples and gradually increase complexity\n2. **Practice regularly**: Dedicate 10-15 minutes daily to practice\n3. **Use in context**: Apply what you learn in real conversations\n4. **Get feedback**: Practice with native speakers when possible`
      },
      {
        title: "Common Mistakes to Avoid",
        content: `Here are the most frequent errors learners make and how to avoid them:\n\n• Overthinking the rules instead of practicing naturally\n• Translating directly from English\n• Ignoring regional variations\n• Not practicing enough in real situations`
      },
      {
        title: "Conclusion",
        content: `Mastering ${topic.title.toLowerCase()} takes time and practice, but with consistent effort, you'll see significant improvement in your Portuguese communication skills. Remember to practice regularly and don't be afraid to make mistakes – they're part of the learning process!`
      }
    ];

    return sections
      .map(section => `## ${section.title}\n\n${section.content}`)
      .join('\n\n');
  }

  private regenerateUniqueContent(topic: BlogTopic, recommendations: string[]): string {
    // Apply recommendations to create more unique content
    const uniqueIntro = this.generateUniqueIntroduction(topic);
    const uniqueSections = this.generateUniqueSections(topic);
    
    const sections = [
      {
        title: "Introduction",
        content: uniqueIntro
      },
      {
        title: "Understanding the Fundamentals",
        content: `${topic.description} This comprehensive guide will walk you through practical applications and real-world usage.`
      },
      {
        title: "Essential Elements",
        content: `Key aspects to focus on:\n\n${topic.keywords.map((keyword, index) => `${index + 1}. ${keyword}`).join('\n')}`
      },
      {
        title: "Practical Implementation",
        content: `Consider these scenarios for applying what you've learned:\n\n• Everyday Situations: Integrate these concepts into your daily Portuguese conversations\n• Academic Context: Apply proper structure in formal writing and speaking\n• Social Interactions: Use appropriate language levels in different social settings`
      },
      {
        title: "Mastery Strategies",
        content: `To excel in ${topic.title.toLowerCase()}:\n\n• Practice consistently with varied examples\n• Seek feedback from native Portuguese speakers\n• Apply concepts in different contexts\n• Monitor your progress regularly`
      },
      {
        title: "Moving Forward",
        content: `Your journey with ${topic.title.toLowerCase()} is an investment in your Portuguese fluency. Consistent practice and real-world application will lead to natural usage.\n\nContinue building on these foundations for lasting language success!`
      }
    ];

    return sections
      .map(section => `## ${section.title}\n\n${section.content}`)
      .join('\n\n');
  }

  private generateUniqueIntroduction(topic: BlogTopic): string {
    const intros = [
      `Mastering ${topic.title.toLowerCase()} opens doors to authentic Portuguese communication.`,
      `Understanding ${topic.title.toLowerCase()} is a cornerstone of European Portuguese fluency.`,
      `Effective ${topic.title.toLowerCase()} usage distinguishes confident Portuguese speakers.`,
      `The key to natural Portuguese lies in proper ${topic.title.toLowerCase()} application.`
    ];
    
    return intros[Math.floor(Math.random() * intros.length)];
  }

  private generateUniqueSections(topic: BlogTopic): string {
    const sections = [
      `## Common Patterns\n\nRecognizing patterns in ${topic.title.toLowerCase()} helps accelerate your learning process.`,
      `## Advanced Applications\n\nOnce you master the basics, explore more sophisticated uses of ${topic.title.toLowerCase()}.`,
      `## Cultural Context\n\nUnderstanding the cultural background enhances your ${topic.title.toLowerCase()} usage.`,
      `## Regional Variations\n\nEuropean Portuguese has subtle variations in ${topic.title.toLowerCase()} across different regions.`
    ];
    
    return sections[Math.floor(Math.random() * sections.length)];
  }

  private applyUniquenessModifications(content: string, duplicateSegments: any[]): string {
    let modifiedContent = content;
    
    // Replace common phrases with alternatives
    const replacements = [
      { from: 'essential for effective communication', to: 'crucial for successful interaction' },
      { from: 'real-world applications', to: 'practical implementations' },
      { from: 'significantly improve', to: 'substantially enhance' },
      { from: 'practice regularly', to: 'maintain consistent practice' },
      { from: 'native speakers', to: 'Portuguese speakers' },
      { from: 'everyday interactions', to: 'daily conversations' },
      { from: 'business contexts', to: 'professional environments' },
      { from: 'language nuances', to: 'linguistic subtleties' }
    ];
    
    replacements.forEach(replacement => {
      modifiedContent = modifiedContent.replace(
        new RegExp(replacement.from, 'gi'),
        replacement.to
      );
    });
    
    return modifiedContent;
  }

  private getUnusedTopic(): BlogTopic | null {
    const usedTitles = this.existingPosts.map(post => post.title);
    const availableTopics = PORTUGUESE_LEARNING_TOPICS.filter(
      topic => !usedTitles.some(title => 
        title.toLowerCase().includes(topic.title.toLowerCase()) ||
        topic.title.toLowerCase().includes(title.toLowerCase())
      )
    );

    if (availableTopics.length === 0) {
      return null;
    }

    // Return a random unused topic
    return availableTopics[Math.floor(Math.random() * availableTopics.length)];
  }

  /**
   * Generate a new blog post with full automation
   */
  public async generateNewPost(): Promise<BlogPost | null> {
    const topic = this.getUnusedTopic();
    if (!topic) {
      console.log('No unused topics available');
      return null;
    }

    // Load existing posts for interlinking
    this.interlinkingSystem.loadPosts(this.existingPosts);
    
    let content = this.generateContent(topic);
    const slug = this.generateSlug();
    const now = new Date().toISOString();
    
    // Validate content uniqueness
    const uniquenessResult = this.uniquenessValidator.validateUniqueness(
      content,
      topic.title,
      this.existingPosts
    );
    
    // If content is not unique enough, regenerate with modifications
    if (!uniquenessResult.isUnique) {
      console.log(`Content similarity detected (${Math.round(uniquenessResult.similarityScore * 100)}%). Regenerating...`);
      content = this.regenerateUniqueContent(topic, uniquenessResult.recommendations);
      
      // Validate again
      const secondValidation = this.uniquenessValidator.validateUniqueness(
        content,
        topic.title,
        this.existingPosts
      );
      
      if (!secondValidation.isUnique) {
        console.log('Content still not unique enough. Applying additional modifications...');
        content = this.applyUniquenessModifications(content, secondValidation.duplicateContent);
      }
    }
    
    // Auto-tag and categorize content
    const taggingResult = this.autoTagger.analyzeContent(topic.title, content);
    
    // Generate SEO metadata
    const seoMetadata = this.seoOptimizer.generateSEOMetadata(
      topic.title,
      content,
      slug,
      taggingResult.category,
      taggingResult.tags,
      now
    );

    // Create initial post
    const post: BlogPost = {
      id: `post-${Date.now()}`,
      title: topic.title,
      excerpt: topic.description,
      content,
      author: 'Sayola Team',
      publishedAt: now,
      updatedAt: now,
      readTime: this.calculateReadTime(content),
      category: taggingResult.category,
      tags: taggingResult.tags,
      featured: Math.random() > 0.7, // 30% chance of being featured
      seoTitle: `${topic.title} | Learn European Portuguese | Sayola`,
      seoDescription: topic.description,
      keywords: seoMetadata.keywords,
      slug,
      relatedPosts: this.findRelatedPosts(topic),
      seoMetadata
    };

    // Generate automatic internal links
    post.content = this.interlinkingSystem.generateAutomaticLinks(content, post.id);
    
    // Find related posts
    const relatedPosts = this.interlinkingSystem.findRelatedPosts(post.id);
    post.relatedPosts = relatedPosts.map(rp => rp.id);

    await this.savePost(post);
    await this.updateInterlinking(post);
    
    // Update existing posts with new interlinking opportunities
    await this.updateExistingPostLinks(post);

    return post;
  }

  private async updateInterlinking(newPost: BlogPost): Promise<void> {
    // Update related posts to include the new post
    for (const relatedSlug of newPost.relatedPosts) {
      const relatedPost = this.existingPosts.find(p => p.slug === relatedSlug);
      if (relatedPost && !relatedPost.relatedPosts.includes(newPost.slug)) {
        relatedPost.relatedPosts.push(newPost.slug);
        relatedPost.updatedAt = new Date().toISOString();
        
        // Save updated post
        const postFile = path.join(this.blogDir, `${relatedPost.slug}.json`);
        await writeFile(postFile, JSON.stringify(relatedPost, null, 2));
      }
    }

    // Update posts index
    const postsFile = path.join(this.blogDir, 'posts.json');
    await writeFile(postsFile, JSON.stringify(this.existingPosts, null, 2));
  }

  private async updateExistingPostLinks(newPost: BlogPost): Promise<void> {
    // Update existing posts with new interlinking opportunities
    for (const existingPost of this.existingPosts) {
      if (existingPost.id !== newPost.id) {
        const updatedContent = this.interlinkingSystem.generateAutomaticLinks(
          existingPost.content,
          existingPost.id
        );
        
        if (updatedContent !== existingPost.content) {
          existingPost.content = updatedContent;
          existingPost.updatedAt = new Date().toISOString();
          
          // Save updated post
          const postFile = path.join(this.blogDir, `${existingPost.slug}.json`);
          await writeFile(postFile, JSON.stringify(existingPost, null, 2));
        }
      }
    }
  }

  public async getAllPosts(): Promise<BlogPost[]> {
    return [...this.existingPosts];
  }

  public async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.existingPosts.find(post => post.slug === slug) || null;
  }
}

// Export singleton instance
export const blogGenerator = new BlogGenerator();