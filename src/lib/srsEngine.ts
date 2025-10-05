// SRS (Spaced Repetition System) Engine
// Based on the SM-2 algorithm with modifications for language learning

export interface SRSCard {
  word: string;
  addedAt: number;
  reviewCount: number;
  lastReviewed: number | null;
  nextReview: number;
  difficulty: number; // 0-5, where 0 is easiest and 5 is hardest
  interval: number; // Days until next review
  easeFactor: number; // Multiplier for interval calculation (1.3 - 2.5)
  streak: number; // Consecutive correct answers
}

export interface ReviewResult {
  quality: number; // 0-5, where 0 is complete blackout and 5 is perfect recall
  timeSpent: number; // Milliseconds spent on review
}

export class SRSEngine {
  private static readonly MIN_EASE_FACTOR = 1.3;
  private static readonly MAX_EASE_FACTOR = 2.5;
  private static readonly DEFAULT_EASE_FACTOR = 2.5;
  
  // Initial intervals for new cards (in days)
  private static readonly INITIAL_INTERVALS = [1, 6];

  /**
   * Create a new SRS card for a word
   */
  static createCard(word: string): SRSCard {
    const now = Date.now();
    return {
      word,
      addedAt: now,
      reviewCount: 0,
      lastReviewed: null,
      nextReview: now + (24 * 60 * 60 * 1000), // Tomorrow
      difficulty: 0,
      interval: 1,
      easeFactor: this.DEFAULT_EASE_FACTOR,
      streak: 0
    };
  }

  /**
   * Update card based on review result
   */
  static updateCard(card: SRSCard, result: ReviewResult): SRSCard {
    const now = Date.now();
    const updatedCard = { ...card };

    updatedCard.reviewCount++;
    updatedCard.lastReviewed = now;

    // Update difficulty based on quality and time spent
    this.updateDifficulty(updatedCard, result);

    // Update ease factor based on quality (SM-2 algorithm)
    this.updateEaseFactor(updatedCard, result.quality);

    // Calculate new interval
    this.calculateNextInterval(updatedCard, result.quality);

    // Update streak
    if (result.quality >= 3) {
      updatedCard.streak++;
    } else {
      updatedCard.streak = 0;
    }

    // Set next review time
    updatedCard.nextReview = now + (updatedCard.interval * 24 * 60 * 60 * 1000);

    return updatedCard;
  }

  /**
   * Update difficulty based on performance
   */
  private static updateDifficulty(card: SRSCard, result: ReviewResult): void {
    const { quality, timeSpent } = result;
    
    // Base difficulty adjustment on quality
    let difficultyChange = 0;
    
    if (quality <= 1) {
      difficultyChange = 1; // Increase difficulty
    } else if (quality >= 4) {
      difficultyChange = -0.5; // Decrease difficulty
    }
    
    // Adjust based on time spent (longer time = more difficult)
    const expectedTime = 5000; // 5 seconds expected
    if (timeSpent > expectedTime * 2) {
      difficultyChange += 0.5;
    } else if (timeSpent < expectedTime / 2) {
      difficultyChange -= 0.3;
    }
    
    card.difficulty = Math.max(0, Math.min(5, card.difficulty + difficultyChange));
  }

  /**
   * Update ease factor using SM-2 algorithm
   */
  private static updateEaseFactor(card: SRSCard, quality: number): void {
    if (quality < 3) {
      // Reset ease factor for poor performance
      card.easeFactor = Math.max(
        this.MIN_EASE_FACTOR,
        card.easeFactor - 0.2
      );
    } else {
      // Improve ease factor for good performance
      const improvement = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
      card.easeFactor = Math.min(
        this.MAX_EASE_FACTOR,
        card.easeFactor + improvement
      );
    }
  }

  /**
   * Calculate next interval based on SM-2 algorithm with modifications
   */
  private static calculateNextInterval(card: SRSCard, quality: number): void {
    if (quality < 3) {
      // Reset to beginning for poor performance
      card.interval = 1;
    } else if (card.reviewCount === 1) {
      card.interval = this.INITIAL_INTERVALS[0];
    } else if (card.reviewCount === 2) {
      card.interval = this.INITIAL_INTERVALS[1];
    } else {
      // Use ease factor for subsequent reviews
      card.interval = Math.round(card.interval * card.easeFactor);
    }

    // Apply difficulty modifier
    const difficultyModifier = 1 + (card.difficulty * 0.1);
    card.interval = Math.max(1, Math.round(card.interval / difficultyModifier));

    // Cap maximum interval at 365 days
    card.interval = Math.min(365, card.interval);
  }

  /**
   * Get cards due for review
   */
  static getDueCards(cards: SRSCard[]): SRSCard[] {
    const now = Date.now();
    return cards
      .filter(card => card.nextReview <= now)
      .sort((a, b) => {
        // Prioritize by overdue time, then by difficulty
        const overdueA = now - a.nextReview;
        const overdueB = now - b.nextReview;
        
        if (overdueA !== overdueB) {
          return overdueB - overdueA; // More overdue first
        }
        
        return b.difficulty - a.difficulty; // Higher difficulty first
      });
  }

  /**
   * Get cards by difficulty level
   */
  static getCardsByDifficulty(cards: SRSCard[], difficulty: number): SRSCard[] {
    return cards.filter(card => Math.floor(card.difficulty) === difficulty);
  }

  /**
   * Get study statistics
   */
  static getStudyStats(cards: SRSCard[]): {
    total: number;
    due: number;
    new: number;
    learning: number;
    mature: number;
    averageDifficulty: number;
    totalReviews: number;
  } {
    const now = Date.now();
    const dueCards = cards.filter(card => card.nextReview <= now);
    const newCards = cards.filter(card => card.reviewCount === 0);
    const learningCards = cards.filter(card => card.reviewCount > 0 && card.interval < 21);
    const matureCards = cards.filter(card => card.interval >= 21);
    
    const totalDifficulty = cards.reduce((sum, card) => sum + card.difficulty, 0);
    const totalReviews = cards.reduce((sum, card) => sum + card.reviewCount, 0);

    return {
      total: cards.length,
      due: dueCards.length,
      new: newCards.length,
      learning: learningCards.length,
      mature: matureCards.length,
      averageDifficulty: cards.length > 0 ? totalDifficulty / cards.length : 0,
      totalReviews
    };
  }

  /**
   * Get optimal study session size
   */
  static getOptimalSessionSize(cards: SRSCard[]): number {
    const dueCards = this.getDueCards(cards);
    const baseSize = Math.min(20, dueCards.length); // Max 20 cards per session
    
    // Adjust based on average difficulty
    const stats = this.getStudyStats(cards);
    const difficultyModifier = 1 - (stats.averageDifficulty * 0.1);
    
    return Math.max(5, Math.round(baseSize * difficultyModifier));
  }

  /**
   * Export cards for backup
   */
  static exportCards(cards: SRSCard[]): string {
    return JSON.stringify(cards, null, 2);
  }

  /**
   * Import cards from backup
   */
  static importCards(data: string): SRSCard[] {
    try {
      const cards = JSON.parse(data);
      return cards.filter((card: any) => this.isValidCard(card));
    } catch (error) {
      throw new Error('Invalid card data format');
    }
  }

  /**
   * Validate card structure
   */
  private static isValidCard(card: any): boolean {
    return (
      typeof card.word === 'string' &&
      typeof card.addedAt === 'number' &&
      typeof card.reviewCount === 'number' &&
      (card.lastReviewed === null || typeof card.lastReviewed === 'number') &&
      typeof card.nextReview === 'number' &&
      typeof card.difficulty === 'number' &&
      typeof card.interval === 'number' &&
      typeof card.easeFactor === 'number' &&
      typeof card.streak === 'number'
    );
  }
}

// Storage helper functions
export class SRSStorage {
  private static readonly STORAGE_KEY = 'srsCollection';

  static saveCards(cards: SRSCard[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Failed to save SRS cards:', error);
    }
  }

  static loadCards(): SRSCard[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load SRS cards:', error);
    }
    return [];
  }

  static addCard(word: string): SRSCard {
    const cards = this.loadCards();
    const existingCard = cards.find(card => card.word === word);
    
    if (existingCard) {
      return existingCard;
    }
    
    const newCard = SRSEngine.createCard(word);
    cards.push(newCard);
    this.saveCards(cards);
    
    return newCard;
  }

  static updateCard(updatedCard: SRSCard): void {
    const cards = this.loadCards();
    const index = cards.findIndex(card => card.word === updatedCard.word);
    
    if (index !== -1) {
      cards[index] = updatedCard;
      this.saveCards(cards);
    }
  }

  static removeCard(word: string): void {
    const cards = this.loadCards();
    const filteredCards = cards.filter(card => card.word !== word);
    this.saveCards(filteredCards);
  }

  static getDueCards(): SRSCard[] {
    const cards = this.loadCards();
    return SRSEngine.getDueCards(cards);
  }

  static getStats() {
    const cards = this.loadCards();
    return SRSEngine.getStudyStats(cards);
  }
}