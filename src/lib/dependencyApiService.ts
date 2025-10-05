// Dependency Parsing API Integration Service
// Provides integration with external Portuguese NLP services for advanced dependency parsing

import { Token, DependencyRelation, ParsedSentence } from './dependencyParser';

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retries: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    model: string;
    confidence: number;
  };
}

export interface ExternalParseResult {
  tokens: ExternalToken[];
  dependencies: ExternalDependency[];
  sentence: string;
  language: string;
  model: string;
  confidence: number;
}

export interface ExternalToken {
  id: number;
  text: string;
  lemma: string;
  pos: string;
  tag: string;
  features?: { [key: string]: string };
  start: number;
  end: number;
}

export interface ExternalDependency {
  head: number;
  dependent: number;
  relation: string;
  confidence: number;
}

// Available API providers
export const API_PROVIDERS = {
  SPACY_API: {
    name: 'spaCy Portuguese API',
    baseUrl: 'https://api.spacy.io/v1',
    models: ['pt_core_news_sm', 'pt_core_news_md', 'pt_core_news_lg'],
    features: ['pos', 'dep', 'ner', 'lemma']
  },
  STANZA_API: {
    name: 'Stanford Stanza API',
    baseUrl: 'https://stanza.run/api/v1',
    models: ['pt'],
    features: ['tokenize', 'pos', 'lemma', 'depparse']
  },
  NLPNET_API: {
    name: 'nlpnet Portuguese API',
    baseUrl: 'https://nlpnet.herokuapp.com/api/v1',
    models: ['pt'],
    features: ['pos', 'srl', 'parse']
  },
  LOCAL_MOCK: {
    name: 'Local Mock Service',
    baseUrl: 'http://localhost:8000/api/v1',
    models: ['mock'],
    features: ['all']
  }
};

export class DependencyApiService {
  private config: ApiConfig;
  private cache: Map<string, ParsedSentence> = new Map();
  private requestQueue: Array<{ sentence: string; resolve: (value: ApiResponse<ParsedSentence>) => void; reject: (reason?: unknown) => void }> = [];
  private isProcessing = false;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: API_PROVIDERS.LOCAL_MOCK.baseUrl,
      timeout: 10000,
      retries: 3,
      ...config
    };
  }

  /**
   * Parse a sentence using external API
   */
  async parseSentence(sentence: string, useCache = true): Promise<ApiResponse<ParsedSentence>> {
    const cacheKey = this.getCacheKey(sentence);
    
    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      return {
        success: true,
        data: this.cache.get(cacheKey)!,
        metadata: {
          processingTime: 0,
          model: 'cached',
          confidence: 1.0
        }
      };
    }

    try {
      const startTime = Date.now();
      const result = await this.makeApiRequest(sentence);
      const processingTime = Date.now() - startTime;

      if (result.success && result.data) {
        const parsedSentence = this.convertToInternalFormat(result.data);
        
        // Cache the result
        if (useCache) {
          this.cache.set(cacheKey, parsedSentence);
        }

        return {
          success: true,
          data: parsedSentence,
          metadata: {
            processingTime,
            model: result.data.model,
            confidence: result.data.confidence
          }
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to parse sentence'
      };

    } catch (error) {
      console.error('API parsing error:', error);
      
      // Fallback to local parsing
      const fallbackResult = await this.fallbackParsing(sentence);
      return {
        success: true,
        data: fallbackResult,
        metadata: {
          processingTime: 100,
          model: 'fallback',
          confidence: 0.7
        }
      };
    }
  }

  /**
   * Batch parse multiple sentences
   */
  async parseBatch(sentences: string[]): Promise<ApiResponse<ParsedSentence[]>> {
    const results: ParsedSentence[] = [];
    const errors: string[] = [];

    for (const sentence of sentences) {
      try {
        const result = await this.parseSentence(sentence);
        if (result.success && result.data) {
          results.push(result.data);
        } else {
          errors.push(`Failed to parse: "${sentence}"`);
        }
      } catch {
        errors.push(`Error parsing: "${sentence}"`);
      }
    }

    return {
      success: errors.length === 0,
      data: results,
      error: errors.length > 0 ? errors.join('; ') : undefined
    };
  }

  /**
   * Make API request with retry logic
   */
  private async makeApiRequest(sentence: string): Promise<ApiResponse<ExternalParseResult>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const response = await this.performRequest(sentence);
        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    return {
      success: false,
      error: `Failed after ${this.config.retries} attempts: ${lastError?.message}`
    };
  }

  /**
   * Perform the actual HTTP request
   */
  private async performRequest(sentence: string): Promise<ApiResponse<ExternalParseResult>> {
    // For demo purposes, we'll simulate an API call
    // In a real implementation, this would make actual HTTP requests
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate API response
        const mockResult: ExternalParseResult = this.generateMockApiResponse(sentence);
        resolve({
          success: true,
          data: mockResult
        });
      }, Math.random() * 1000 + 500); // Simulate network delay
    });
  }

  /**
   * Generate mock API response for demonstration
   */
  private generateMockApiResponse(sentence: string): ExternalParseResult {
    const words = sentence.split(/\s+/);
    const tokens: ExternalToken[] = [];
    const dependencies: ExternalDependency[] = [];
    
    let charOffset = 0;
    words.forEach((word, index) => {
      // Find actual position in sentence
      const wordStart = sentence.indexOf(word, charOffset);
      const wordEnd = wordStart + word.length;
      charOffset = wordEnd;

      tokens.push({
        id: index + 1,
        text: word,
        lemma: this.getLemma(word),
        pos: this.getPOS(word),
        tag: this.getDetailedPOS(word),
        start: wordStart,
        end: wordEnd,
        features: this.getFeatures(word)
      });

      // Create dependencies (simplified)
      if (index > 0) {
        dependencies.push({
          head: this.getHead(index, words),
          dependent: index + 1,
          relation: this.getRelation(word, index),
          confidence: 0.8 + Math.random() * 0.2
        });
      }
    });

    return {
      tokens,
      dependencies,
      sentence,
      language: 'pt',
      model: 'mock-pt-model-v1.0',
      confidence: 0.85 + Math.random() * 0.1
    };
  }

  /**
   * Convert external API format to internal format
   */
  private convertToInternalFormat(apiResult: ExternalParseResult): ParsedSentence {
    const tokens: Token[] = apiResult.tokens.map(token => ({
      id: token.id,
      text: token.text,
      lemma: token.lemma,
      pos: token.pos,
      posDescription: this.getPOSDescription(token.pos),
      head: 0, // Will be set based on dependencies
      deprel: 'dep',
      deprelDescription: 'Dependency',
      startChar: token.start,
      endChar: token.end
    }));

    // Update head information based on dependencies
    apiResult.dependencies.forEach(dep => {
      const dependentToken = tokens.find(t => t.id === dep.dependent);
      if (dependentToken) {
        dependentToken.head = dep.head;
        dependentToken.deprel = dep.relation;
        dependentToken.deprelDescription = this.getDeprelDescription(dep.relation);
      }
    });

    const dependencies: DependencyRelation[] = apiResult.dependencies.map(dep => {
      const headToken = tokens.find(t => t.id === dep.head) || tokens[0];
      const dependentToken = tokens.find(t => t.id === dep.dependent) || tokens[0];
      
      return {
        id: `${dep.head}-${dep.dependent}`,
        head: headToken,
        dependent: dependentToken,
        relation: dep.relation,
        description: this.getDeprelDescription(dep.relation),
        color: this.getRelationColor(dep.relation),
        strength: dep.confidence
      };
    });

    // Find root token
    const root = tokens.find(token => token.head === 0) || tokens[0];

    return {
      text: apiResult.sentence,
      tokens,
      dependencies,
      root,
      complexity: this.determineComplexity(tokens),
      confidence: apiResult.confidence
    };
  }

  /**
   * Get POS description
   */
  private getPOSDescription(pos: string): string {
    const descriptions: Record<string, string> = {
      'NOUN': 'Substantivo',
      'VERB': 'Verbo',
      'ADJ': 'Adjetivo',
      'ADV': 'Advérbio',
      'PRON': 'Pronome',
      'DET': 'Determinante',
      'ADP': 'Preposição',
      'CONJ': 'Conjunção',
      'CCONJ': 'Conjunção Coordenativa',
      'SCONJ': 'Conjunção Subordinativa',
      'NUM': 'Numeral',
      'PART': 'Partícula',
      'INTJ': 'Interjeição',
      'PUNCT': 'Pontuação',
      'X': 'Outro',
      'SYM': 'Símbolo'
    };
    return descriptions[pos] || pos;
  }

  /**
   * Get dependency relation description
   */
  private getDeprelDescription(relation: string): string {
    const descriptions: Record<string, string> = {
      'root': 'Raiz da sentença',
      'nsubj': 'Sujeito nominal',
      'obj': 'Objeto direto',
      'iobj': 'Objeto indireto',
      'obl': 'Complemento oblíquo',
      'advmod': 'Modificador adverbial',
      'amod': 'Modificador adjetival',
      'det': 'Determinante',
      'case': 'Marcador de caso',
      'mark': 'Marcador subordinativo',
      'cc': 'Conjunção coordenativa',
      'conj': 'Conjunção',
      'cop': 'Cópula',
      'aux': 'Auxiliar',
      'nmod': 'Modificador nominal',
      'acl': 'Oração adjetiva',
      'advcl': 'Oração adverbial',
      'ccomp': 'Complemento oracional',
      'xcomp': 'Complemento aberto',
      'csubj': 'Sujeito oracional',
      'punct': 'Pontuação',
      'fixed': 'Expressão fixa',
      'flat': 'Nome próprio',
      'compound': 'Palavra composta'
    };
    return descriptions[relation] || relation;
  }

  /**
   * Get relation color
   */
  private getRelationColor(relation: string): string {
    const colors: Record<string, string> = {
      'root': '#dc2626',
      'nsubj': '#2563eb',
      'obj': '#16a34a',
      'iobj': '#ca8a04',
      'obl': '#9333ea',
      'advmod': '#dc2626',
      'amod': '#ea580c',
      'det': '#0891b2',
      'case': '#be123c',
      'mark': '#7c3aed',
      'cc': '#059669',
      'conj': '#0d9488',
      'cop': '#7c2d12',
      'aux': '#a21caf',
      'nmod': '#1d4ed8',
      'acl': '#b91c1c',
      'advcl': '#c2410c',
      'ccomp': '#15803d',
      'xcomp': '#0369a1',
      'csubj': '#7c3aed',
      'punct': '#6b7280',
      'fixed': '#374151',
      'flat': '#4b5563',
      'compound': '#6b7280'
    };
    return colors[relation] || '#6b7280';
  }

  /**
   * Determine sentence complexity
   */
  private determineComplexity(tokens: Token[]): 'simple' | 'compound' | 'complex' {
    const verbCount = tokens.filter(t => t.pos === 'VERB').length;
    const conjunctionCount = tokens.filter(t => t.pos === 'CCONJ' || t.pos === 'SCONJ').length;
    
    if (verbCount <= 1 && conjunctionCount === 0) {
      return 'simple';
    } else if (verbCount > 1 && conjunctionCount > 0) {
      return 'complex';
    } else {
      return 'compound';
    }
  }

  /**
   * Fallback parsing using local heuristics
   */
  private async fallbackParsing(sentence: string): Promise<ParsedSentence> {
    // Import local parser dynamically to avoid circular dependencies
    const { DependencyParser } = await import('./dependencyParser');
    const parser = new DependencyParser();
    return parser.parseSentence(sentence);
  }

  /**
   * Helper methods for mock data generation
   */
  private getLemma(word: string): string {
    // Simple lemmatization rules for Portuguese
    if (word.endsWith('ção')) return word.replace('ção', 'ção');
    if (word.endsWith('mente')) return word.replace('mente', '');
    if (word.endsWith('ando')) return word.replace('ando', 'ar');
    if (word.endsWith('endo')) return word.replace('endo', 'er');
    if (word.endsWith('indo')) return word.replace('indo', 'ir');
    if (word.endsWith('ou')) return word.replace('ou', 'ar');
    if (word.endsWith('eu')) return word.replace('eu', 'er');
    if (word.endsWith('iu')) return word.replace('iu', 'ir');
    return word.toLowerCase();
  }

  private getPOS(word: string): string {
    if (word.match(/^[A-Z]/)) return 'PROPN';
    if (word.endsWith('mente')) return 'ADV';
    if (word.match(/ar$|er$|ir$/)) return 'VERB';
    if (word.match(/ção$|são$|dade$/)) return 'NOUN';
    if (word.match(/oso$|osa$|ivo$|iva$/)) return 'ADJ';
    if (['o', 'a', 'os', 'as'].includes(word.toLowerCase())) return 'DET';
    if (['de', 'em', 'para', 'com', 'por'].includes(word.toLowerCase())) return 'ADP';
    if (['e', 'ou', 'mas', 'que'].includes(word.toLowerCase())) return 'CCONJ';
    return 'NOUN';
  }

  private getDetailedPOS(word: string): string {
    const pos = this.getPOS(word);
    if (pos === 'NOUN') return 'NOUN';
    if (pos === 'VERB') return 'VERB';
    if (pos === 'ADJ') return 'ADJ';
    return pos;
  }

  private getFeatures(word: string): { [key: string]: string } {
    const features: { [key: string]: string } = {};
    
    if (word.endsWith('a') || word.endsWith('as')) {
      features.Gender = 'Fem';
    } else if (word.endsWith('o') || word.endsWith('os')) {
      features.Gender = 'Masc';
    }
    
    if (word.endsWith('s')) {
      features.Number = 'Plur';
    } else {
      features.Number = 'Sing';
    }
    
    return features;
  }

  private getHead(index: number, words: string[]): number {
    // Simple heuristic: most words depend on the verb or the previous word
    if (index === 1) return 0; // Root
    
    // Find verb in sentence
    for (let i = 0; i < words.length; i++) {
      if (this.getPOS(words[i]) === 'VERB') {
        return i + 1;
      }
    }
    
    return Math.max(1, index); // Default to previous word
  }

  private getRelation(word: string, index: number): string {
    const pos = this.getPOS(word);
    
    if (index === 0) return 'root';
    if (pos === 'DET') return 'det';
    if (pos === 'ADJ') return 'amod';
    if (pos === 'ADP') return 'case';
    if (pos === 'ADV') return 'advmod';
    if (pos === 'NOUN') return 'obj';
    if (pos === 'VERB') return 'ccomp';
    
    return 'dep';
  }

  /**
   * Generate cache key for sentence
   */
  private getCacheKey(sentence: string): string {
    return `parse_${sentence.toLowerCase().trim()}`;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<ApiResponse<boolean>> {
    try {
      const testSentence = "Teste de conectividade.";
      const result = await this.parseSentence(testSentence, false);
      
      return {
        success: result.success,
        data: result.success,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        error: `Connection test failed: ${(error as Error).message}`
      };
    }
  }
}