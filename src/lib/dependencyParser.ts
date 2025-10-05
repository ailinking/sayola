// Dependency Parser for Portuguese Sentence Analysis
// Provides grammatical structure analysis and dependency relationships

export interface Token {
  id: number;
  text: string;
  lemma: string;
  pos: string; // Part of speech
  posDescription: string;
  head: number; // ID of the head token (0 for root)
  deprel: string; // Dependency relation
  deprelDescription: string;
  startChar: number;
  endChar: number;
}

export interface DependencyRelation {
  id: string;
  head: Token;
  dependent: Token;
  relation: string;
  description: string;
  color: string;
  strength: number; // 0-1, for visual weight
}

export interface ParsedSentence {
  text: string;
  tokens: Token[];
  dependencies: DependencyRelation[];
  root: Token;
  complexity: 'simple' | 'compound' | 'complex';
  confidence: number;
}

// Portuguese POS tags and their descriptions
const POS_DESCRIPTIONS: Record<string, string> = {
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

// Dependency relations and their descriptions
const DEPREL_DESCRIPTIONS: Record<string, { description: string; color: string }> = {
  'root': { description: 'Raiz da sentença', color: '#dc2626' },
  'nsubj': { description: 'Sujeito nominal', color: '#2563eb' },
  'obj': { description: 'Objeto direto', color: '#16a34a' },
  'iobj': { description: 'Objeto indireto', color: '#ca8a04' },
  'obl': { description: 'Complemento oblíquo', color: '#9333ea' },
  'advmod': { description: 'Modificador adverbial', color: '#dc2626' },
  'amod': { description: 'Modificador adjetival', color: '#ea580c' },
  'det': { description: 'Determinante', color: '#0891b2' },
  'case': { description: 'Marcador de caso', color: '#be123c' },
  'mark': { description: 'Marcador subordinativo', color: '#7c3aed' },
  'cc': { description: 'Conjunção coordenativa', color: '#059669' },
  'conj': { description: 'Conjunção', color: '#0d9488' },
  'cop': { description: 'Cópula', color: '#7c2d12' },
  'aux': { description: 'Auxiliar', color: '#a21caf' },
  'nmod': { description: 'Modificador nominal', color: '#1d4ed8' },
  'acl': { description: 'Oração adjetiva', color: '#b91c1c' },
  'advcl': { description: 'Oração adverbial', color: '#c2410c' },
  'ccomp': { description: 'Complemento oracional', color: '#15803d' },
  'xcomp': { description: 'Complemento aberto', color: '#0369a1' },
  'csubj': { description: 'Sujeito oracional', color: '#7c3aed' },
  'punct': { description: 'Pontuação', color: '#6b7280' },
  'fixed': { description: 'Expressão fixa', color: '#374151' },
  'flat': { description: 'Nome próprio', color: '#4b5563' },
  'compound': { description: 'Palavra composta', color: '#6b7280' }
};

export class DependencyParser {
  private posModel: Map<string, string> = new Map();
  private dependencyRules: Map<string, string[]> = new Map();
  private apiService?: import('./dependencyApiService').DependencyApiService; // Will be imported dynamically to avoid circular deps

  constructor(useApi = false) {
    this.initializeModels();
    if (useApi) {
      this.initializeApiService();
    }
  }

  /**
   * Initialize API service for enhanced parsing
   */
  private async initializeApiService() {
    try {
      const { DependencyApiService } = await import('./dependencyApiService');
      this.apiService = new DependencyApiService();
    } catch (error) {
      console.warn('Failed to initialize API service, using local parsing only:', error);
    }
  }

  /**
   * Initialize POS and dependency models
   */
  private initializeModels() {
    // Initialize basic POS patterns
    this.posModel.set('articles', 'DET');
    this.posModel.set('prepositions', 'ADP');
    this.posModel.set('pronouns', 'PRON');
    
    // Initialize dependency rules
    this.dependencyRules.set('DET', ['det']);
    this.dependencyRules.set('ADJ', ['amod']);
    this.dependencyRules.set('ADV', ['advmod']);
  }

  /**
   * Parse a Portuguese sentence and extract dependency relationships
   * This is a simplified parser for demonstration - in production, you'd use spaCy, Stanza, or similar
   */
  async parseSentence(text: string, useApi = false): Promise<ParsedSentence> {
    // Try API parsing first if available and requested
    if (useApi && this.apiService) {
      try {
        const apiResult = await this.apiService.parseSentence(text);
        if (apiResult.success && apiResult.data) {
          return apiResult.data;
        }
      } catch (error) {
        console.warn('API parsing failed, falling back to local parsing:', error);
      }
    }

    // Fallback to local parsing
    return this.parseLocally(text);
  }

  /**
   * Local parsing implementation
   */
  private parseLocally(text: string): ParsedSentence {
    // Tokenize the sentence
    const tokens = this.tokenize(text);
    
    // Perform basic POS tagging
    const taggedTokens = this.posTag(tokens);
    
    // Extract dependencies using rule-based approach
    const dependencies = this.extractDependencies(taggedTokens);
    
    // Find root token
    const root = taggedTokens.find(token => token.head === 0) || taggedTokens[0];
    
    // Determine sentence complexity
    const complexity = this.determineSentenceComplexity(taggedTokens, dependencies);
    
    return {
      text,
      tokens: taggedTokens,
      dependencies,
      root,
      complexity,
      confidence: 0.75 // Simplified confidence score
    };
  }
  
  /**
   * Tokenize Portuguese text
   */
  private tokenize(text: string): Token[] {
    // Simple tokenization - split by spaces and punctuation
    const words = text.match(/\b\w+\b|[^\w\s]/g) || [];
    let charIndex = 0;
    
    return words.map((word, index) => {
      const startChar = text.indexOf(word, charIndex);
      const endChar = startChar + word.length;
      charIndex = endChar;
      
      return {
        id: index + 1,
        text: word,
        lemma: word.toLowerCase(),
        pos: 'UNKNOWN',
        posDescription: 'Desconhecido',
        head: 0,
        deprel: 'unknown',
        deprelDescription: 'Desconhecido',
        startChar,
        endChar
      };
    });
  }
  
  /**
   * Simple POS tagging for Portuguese
   */
  private posTag(tokens: Token[]): Token[] {
    return tokens.map(token => {
      const word = token.text.toLowerCase();
      let pos = 'NOUN'; // Default
      
      // Articles and determiners
      if (['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas', 'aquele', 'aquela', 'aqueles', 'aquelas'].includes(word)) {
        pos = 'DET';
      }
      // Prepositions
      else if (['de', 'em', 'para', 'por', 'com', 'sem', 'sobre', 'entre', 'até', 'desde', 'durante', 'contra', 'perante'].includes(word)) {
        pos = 'ADP';
      }
      // Pronouns
      else if (['eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas', 'me', 'te', 'se', 'nos', 'vos', 'lhe', 'lhes', 'meu', 'teu', 'seu', 'nosso', 'vosso'].includes(word)) {
        pos = 'PRON';
      }
      // Common verbs
      else if (['ser', 'estar', 'ter', 'haver', 'fazer', 'ir', 'vir', 'dar', 'ver', 'saber', 'poder', 'querer', 'dizer', 'falar', 'pensar', 'trabalhar', 'estudar', 'morar', 'gostar'].includes(word) || 
               word.match(/ar$|er$|ir$|ando$|endo$|indo$|ado$|ido$/)) {
        pos = 'VERB';
      }
      // Adjectives
      else if (word.match(/oso$|osa$|ivo$|iva$|ável$|ível$|ante$|ente$|al$|ar$/)) {
        pos = 'ADJ';
      }
      // Adverbs
      else if (word.match(/mente$/)) {
        pos = 'ADV';
      }
      // Conjunctions
      else if (['e', 'ou', 'mas', 'porém', 'contudo', 'entretanto', 'porque', 'que', 'se', 'quando', 'onde', 'como', 'enquanto'].includes(word)) {
        pos = word === 'e' || word === 'ou' || word === 'mas' ? 'CCONJ' : 'SCONJ';
      }
      // Punctuation
      else if (token.text.match(/[.,;:!?()[\]{}""'']/)) {
        pos = 'PUNCT';
      }
      // Numbers
      else if (token.text.match(/^\d+$/)) {
        pos = 'NUM';
      }
      
      return {
        ...token,
        pos,
        posDescription: POS_DESCRIPTIONS[pos] || 'Desconhecido'
      };
    });
  }
  
  /**
   * Extract dependency relationships using simplified rules
   */
  private extractDependencies(tokens: Token[]): DependencyRelation[] {
    const dependencies: DependencyRelation[] = [];
    
    // Find the main verb (root)
    let rootIndex = tokens.findIndex(token => token.pos === 'VERB');
    if (rootIndex === -1) rootIndex = Math.floor(tokens.length / 2); // Fallback to middle
    
    tokens[rootIndex].head = 0;
    tokens[rootIndex].deprel = 'root';
    tokens[rootIndex].deprelDescription = 'Raiz da sentença';
    
    // Simple dependency assignment
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.deprel === 'root') continue;
      
      // Determiners attach to the next noun
      if (token.pos === 'DET') {
        const nextNoun = tokens.slice(i + 1).find(t => t.pos === 'NOUN');
        if (nextNoun) {
          token.head = nextNoun.id;
          token.deprel = 'det';
          token.deprelDescription = 'Determinante';
        }
      }
      // Adjectives modify nouns
      else if (token.pos === 'ADJ') {
        const nearestNoun = this.findNearestToken(tokens, i, 'NOUN');
        if (nearestNoun) {
          token.head = nearestNoun.id;
          token.deprel = 'amod';
          token.deprelDescription = 'Modificador adjetival';
        }
      }
      // Adverbs modify verbs
      else if (token.pos === 'ADV') {
        const nearestVerb = this.findNearestToken(tokens, i, 'VERB');
        if (nearestVerb) {
          token.head = nearestVerb.id;
          token.deprel = 'advmod';
          token.deprelDescription = 'Modificador adverbial';
        }
      }
      // Prepositions
      else if (token.pos === 'ADP') {
        const nextToken = tokens[i + 1];
        if (nextToken) {
          token.head = nextToken.id;
          token.deprel = 'case';
          token.deprelDescription = 'Marcador de caso';
        }
      }
      // Default: attach to root
      else {
        token.head = tokens[rootIndex].id;
        if (token.pos === 'NOUN' && i < rootIndex) {
          token.deprel = 'nsubj';
          token.deprelDescription = 'Sujeito nominal';
        } else if (token.pos === 'NOUN' && i > rootIndex) {
          token.deprel = 'obj';
          token.deprelDescription = 'Objeto direto';
        } else {
          token.deprel = 'dep';
          token.deprelDescription = 'Dependência';
        }
      }
    }
    
    // Create dependency relations
    for (const token of tokens) {
      if (token.head > 0) {
        const head = tokens.find(t => t.id === token.head);
        if (head) {
          const deprelInfo = DEPREL_DESCRIPTIONS[token.deprel] || { description: 'Dependência', color: '#6b7280' };
          
          dependencies.push({
            id: `${head.id}-${token.id}`,
            head,
            dependent: token,
            relation: token.deprel,
            description: deprelInfo.description,
            color: deprelInfo.color,
            strength: token.deprel === 'root' ? 1 : 0.7
          });
        }
      }
    }
    
    return dependencies;
  }
  
  /**
   * Find the nearest token of a specific POS type
   */
  private findNearestToken(tokens: Token[], currentIndex: number, targetPos: string): Token | null {
    let minDistance = Infinity;
    let nearestToken: Token | null = null;
    
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].pos === targetPos) {
        const distance = Math.abs(i - currentIndex);
        if (distance < minDistance) {
          minDistance = distance;
          nearestToken = tokens[i];
        }
      }
    }
    
    return nearestToken;
  }
  
  /**
   * Determine sentence complexity based on structure
   */
  private determineSentenceComplexity(tokens: Token[], dependencies: DependencyRelation[]): 'simple' | 'compound' | 'complex' {
    const verbCount = tokens.filter(t => t.pos === 'VERB').length;
    const conjunctionCount = tokens.filter(t => t.pos === 'CCONJ' || t.pos === 'SCONJ').length;
    const clauseMarkers = dependencies.filter(d => d.relation === 'mark' || d.relation === 'cc').length;
    
    if (verbCount <= 1 && conjunctionCount === 0) {
      return 'simple';
    } else if (verbCount > 1 && conjunctionCount > 0 && clauseMarkers === 0) {
      return 'compound';
    } else {
      return 'complex';
    }
  }
  
  /**
   * Get dependency statistics for a parsed sentence
   */
  static getDependencyStats(parsed: ParsedSentence) {
    const stats = {
      tokenCount: parsed.tokens.length,
      verbCount: parsed.tokens.filter(t => t.pos === 'VERB').length,
      nounCount: parsed.tokens.filter(t => t.pos === 'NOUN').length,
      adjCount: parsed.tokens.filter(t => t.pos === 'ADJ').length,
      advCount: parsed.tokens.filter(t => t.pos === 'ADV').length,
      dependencyCount: parsed.dependencies.length,
      maxDepth: this.calculateMaxDepth(parsed),
      complexity: parsed.complexity
    };
    
    return stats;
  }
  
  /**
   * Calculate the maximum dependency depth
   */
  private static calculateMaxDepth(parsed: ParsedSentence): number {
    const getDepth = (token: Token, visited: Set<number> = new Set()): number => {
      if (visited.has(token.id)) return 0; // Avoid cycles
      visited.add(token.id);
      
      const dependents = parsed.tokens.filter(t => t.head === token.id);
      if (dependents.length === 0) return 1;
      
      return 1 + Math.max(...dependents.map(dep => getDepth(dep, new Set(visited))));
    };
    
    return getDepth(parsed.root);
  }
}