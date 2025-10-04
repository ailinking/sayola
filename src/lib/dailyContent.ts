// Daily Content Generation System for Portuguese Learning
// Provides word of the day, phrases, cultural content, and learning tips

export interface DailyWord {
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  exampleTranslation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  etymology?: string;
}

export interface DailyPhrase {
  phrase: string;
  translation: string;
  pronunciation: string;
  context: string;
  usage: string;
  formality: 'formal' | 'informal' | 'neutral';
  region: 'brazil' | 'portugal' | 'both';
}

export interface CulturalTip {
  title: string;
  content: string;
  category: 'culture' | 'history' | 'food' | 'music' | 'tradition' | 'language';
  region: 'brazil' | 'portugal' | 'both';
  imageUrl?: string;
}

export interface LearningTip {
  title: string;
  content: string;
  category: 'grammar' | 'pronunciation' | 'vocabulary' | 'listening' | 'speaking';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DailyContent {
  date: string;
  wordOfTheDay: DailyWord;
  phraseOfTheDay: DailyPhrase;
  culturalTip: CulturalTip;
  learningTip: LearningTip;
  challenge?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

class DailyContentService {
  private contentCache: Map<string, DailyContent> = new Map();

  // Sample data - in a real app, this would come from a database or API
  private sampleWords: DailyWord[] = [
    {
      word: "saudade",
      translation: "longing, nostalgia",
      pronunciation: "saw-DAH-jee",
      partOfSpeech: "noun",
      definition: "A deep emotional state of nostalgic longing for something or someone that one loves",
      example: "Tenho saudade da minha terra natal.",
      exampleTranslation: "I miss my homeland.",
      difficulty: "intermediate",
      category: "emotions",
      etymology: "From Latin 'solitas' meaning solitude"
    },
    {
      word: "cafezinho",
      translation: "small coffee",
      pronunciation: "ka-feh-ZEE-nyoo",
      partOfSpeech: "noun",
      definition: "A small cup of strong coffee, typically served black",
      example: "Vamos tomar um cafezinho?",
      exampleTranslation: "Shall we have a little coffee?",
      difficulty: "beginner",
      category: "food"
    },
    {
      word: "desenrascar",
      translation: "to figure it out, to manage",
      pronunciation: "deh-zen-has-KAR",
      partOfSpeech: "verb",
      definition: "To solve a problem creatively with limited resources",
      example: "Ele sempre consegue se desenrascar.",
      exampleTranslation: "He always manages to figure it out.",
      difficulty: "advanced",
      category: "actions"
    }
  ];

  private samplePhrases: DailyPhrase[] = [
    {
      phrase: "Que tal?",
      translation: "How about it? / What do you think?",
      pronunciation: "keh tahl",
      context: "Used to suggest something or ask for opinion",
      usage: "Que tal irmos ao cinema hoje?",
      formality: "informal",
      region: "both"
    },
    {
      phrase: "Está na cara",
      translation: "It's obvious",
      pronunciation: "esh-TAH nah KAH-rah",
      context: "When something is very clear or obvious",
      usage: "Está na cara que ele está nervoso.",
      formality: "informal",
      region: "brazil"
    },
    {
      phrase: "Dar uma volta",
      translation: "To take a walk/stroll",
      pronunciation: "dahr OO-mah VOL-tah",
      context: "Going for a casual walk or drive",
      usage: "Vamos dar uma volta no parque?",
      formality: "neutral",
      region: "both"
    }
  ];

  private sampleCulturalTips: CulturalTip[] = [
    {
      title: "Brazilian Greeting Customs",
      content: "In Brazil, it's common to greet friends and family with kisses on the cheek. The number varies by region - one kiss in São Paulo, two in Rio de Janeiro, and three in some parts of Minas Gerais!",
      category: "culture",
      region: "brazil"
    },
    {
      title: "Portuguese Fado Music",
      content: "Fado is a traditional Portuguese music genre characterized by mournful tunes and lyrics, often expressing saudade. It's recognized by UNESCO as an Intangible Cultural Heritage of Humanity.",
      category: "music",
      region: "portugal"
    },
    {
      title: "Coffee Culture",
      content: "Both Brazil and Portugal have strong coffee cultures. In Brazil, 'cafezinho' is offered to guests as a sign of hospitality, while in Portugal, 'bica' (espresso) is the preferred way to drink coffee.",
      category: "food",
      region: "both"
    }
  ];

  private sampleLearningTips: LearningTip[] = [
    {
      title: "Mastering Portuguese Pronunciation",
      content: "Portuguese has nasal sounds that don't exist in English. Practice words ending in -ão, -ãe, and -õe. Listen to native speakers and try to mimic the nasal quality.",
      category: "pronunciation",
      difficulty: "beginner"
    },
    {
      title: "Understanding Subjunctive Mood",
      content: "The subjunctive mood in Portuguese expresses doubt, emotion, or hypothetical situations. Start with common phrases like 'Espero que...' (I hope that...) and 'É possível que...' (It's possible that...).",
      category: "grammar",
      difficulty: "intermediate"
    },
    {
      title: "Building Vocabulary Through Cognates",
      content: "Many Portuguese words are similar to English due to Latin roots. Words ending in -ção often correspond to English -tion (nação/nation, informação/information).",
      category: "vocabulary",
      difficulty: "beginner"
    }
  ];

  /**
   * Get daily content for a specific date
   */
  getDailyContent(date?: Date): DailyContent {
    const targetDate = date || new Date();
    const dateKey = targetDate.toISOString().split('T')[0];

    // Check cache first
    if (this.contentCache.has(dateKey)) {
      return this.contentCache.get(dateKey)!;
    }

    // Generate content based on date
    const dayOfYear = this.getDayOfYear(targetDate);
    
    const content: DailyContent = {
      date: dateKey,
      wordOfTheDay: this.selectByIndex(this.sampleWords, dayOfYear),
      phraseOfTheDay: this.selectByIndex(this.samplePhrases, dayOfYear),
      culturalTip: this.selectByIndex(this.sampleCulturalTips, dayOfYear),
      learningTip: this.selectByIndex(this.sampleLearningTips, dayOfYear),
      challenge: this.generateChallenge(dayOfYear)
    };

    // Cache the content
    this.contentCache.set(dateKey, content);
    return content;
  }

  /**
   * Get content for the current week
   */
  getWeeklyContent(): DailyContent[] {
    const today = new Date();
    const weekContent: DailyContent[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      weekContent.push(this.getDailyContent(date));
    }
    
    return weekContent.reverse(); // Oldest to newest
  }

  /**
   * Get random word by difficulty
   */
  getRandomWordByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): DailyWord {
    const filteredWords = this.sampleWords.filter(word => word.difficulty === difficulty);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)] || this.sampleWords[0];
  }

  /**
   * Get random phrase by region
   */
  getRandomPhraseByRegion(region: 'brazil' | 'portugal' | 'both'): DailyPhrase {
    const filteredPhrases = this.samplePhrases.filter(phrase => 
      phrase.region === region || phrase.region === 'both'
    );
    return filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)] || this.samplePhrases[0];
  }

  /**
   * Search content by keyword
   */
  searchContent(keyword: string): {
    words: DailyWord[];
    phrases: DailyPhrase[];
    tips: (CulturalTip | LearningTip)[];
  } {
    const lowerKeyword = keyword.toLowerCase();
    
    return {
      words: this.sampleWords.filter(word => 
        word.word.toLowerCase().includes(lowerKeyword) ||
        word.translation.toLowerCase().includes(lowerKeyword) ||
        word.category.toLowerCase().includes(lowerKeyword)
      ),
      phrases: this.samplePhrases.filter(phrase =>
        phrase.phrase.toLowerCase().includes(lowerKeyword) ||
        phrase.translation.toLowerCase().includes(lowerKeyword)
      ),
      tips: [
        ...this.sampleCulturalTips.filter(tip =>
          tip.title.toLowerCase().includes(lowerKeyword) ||
          tip.content.toLowerCase().includes(lowerKeyword)
        ),
        ...this.sampleLearningTips.filter(tip =>
          tip.title.toLowerCase().includes(lowerKeyword) ||
          tip.content.toLowerCase().includes(lowerKeyword)
        )
      ]
    };
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private selectByIndex<T>(array: T[], index: number): T {
    return array[index % array.length];
  }

  private generateChallenge(dayOfYear: number): DailyContent['challenge'] {
    const challenges = [
      {
        question: "What does 'saudade' mean?",
        options: ["Happiness", "Longing/Nostalgia", "Anger", "Surprise"],
        correctAnswer: 1,
        explanation: "Saudade is a uniquely Portuguese word expressing deep nostalgic longing."
      },
      {
        question: "How do you say 'small coffee' in Portuguese?",
        options: ["Café grande", "Cafezinho", "Café preto", "Café com leite"],
        correctAnswer: 1,
        explanation: "Cafezinho is the diminutive form of café, meaning a small coffee."
      },
      {
        question: "Which greeting involves kisses on the cheek in Brazil?",
        options: ["Handshake only", "Hug only", "Kisses on cheek", "Bow"],
        correctAnswer: 2,
        explanation: "In Brazil, it's common to greet with kisses on the cheek, varying by region."
      }
    ];

    return challenges[dayOfYear % challenges.length];
  }
}

// Export singleton instance
export const dailyContentService = new DailyContentService();
export default DailyContentService;