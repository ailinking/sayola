// Grammar Network Service - Rede Gramatical
// Implements a comprehensive system for visualizing grammatical relationships in Portuguese

export interface GrammarNode {
  id: string;
  word: string;
  type: GrammarNodeType;
  category: string;
  level: number; // Depth in the network
  position: { x: number; y: number };
  properties: GrammarProperties;
  connections: string[]; // IDs of connected nodes
}

export interface GrammarEdge {
  id: string;
  source: string;
  target: string;
  type: GrammarRelationType;
  strength: number; // 0-1, how strong the relationship is
  label: string;
  bidirectional: boolean;
}

export interface GrammarNetwork {
  nodes: GrammarNode[];
  edges: GrammarEdge[];
  centerNode: string; // ID of the central word
  metadata: NetworkMetadata;
}

export interface NetworkMetadata {
  totalNodes: number;
  totalEdges: number;
  maxDepth: number;
  categories: string[];
  complexity: 'simple' | 'moderate' | 'complex' | 'advanced';
}

export interface GrammarProperties {
  pos: string; // Part of speech
  gender?: 'masculine' | 'feminine';
  number?: 'singular' | 'plural';
  tense?: string;
  mood?: string;
  person?: string;
  frequency: number; // Usage frequency
  difficulty: number; // Learning difficulty
  etymology?: string;
  examples: string[];
}

export interface GrammarRule {
  id: string;
  name: string;
  description: string;
  examples: string[];
  exceptions: string[];
  difficulty: string;
}

export type GrammarNodeType = 
  | 'word' 
  | 'concept' 
  | 'rule' 
  | 'pattern' 
  | 'exception' 
  | 'category';

export type GrammarRelationType = 
  | 'synonym' 
  | 'antonym' 
  | 'hypernym' 
  | 'hyponym' 
  | 'meronym' 
  | 'holonym'
  | 'derivation' 
  | 'inflection' 
  | 'collocation' 
  | 'semantic' 
  | 'syntactic'
  | 'phonetic' 
  | 'etymological' 
  | 'pragmatic';

// Portuguese Grammar Categories
export const GRAMMAR_CATEGORIES = {
  SUBSTANTIVOS: {
    name: 'Substantivos',
    color: '#3B82F6',
    subcategories: ['comum', 'próprio', 'concreto', 'abstrato', 'coletivo', 'composto']
  },
  ADJETIVOS: {
    name: 'Adjetivos',
    color: '#10B981',
    subcategories: ['qualificativo', 'pátrio', 'numeral', 'possessivo', 'demonstrativo']
  },
  VERBOS: {
    name: 'Verbos',
    color: '#F59E0B',
    subcategories: ['regular', 'irregular', 'auxiliar', 'modal', 'pronominal']
  },
  ADVÉRBIOS: {
    name: 'Advérbios',
    color: '#EF4444',
    subcategories: ['modo', 'tempo', 'lugar', 'intensidade', 'afirmação', 'negação']
  },
  PREPOSIÇÕES: {
    name: 'Preposições',
    color: '#8B5CF6',
    subcategories: ['simples', 'compostas', 'locuções']
  },
  CONJUNÇÕES: {
    name: 'Conjunções',
    color: '#EC4899',
    subcategories: ['coordenativas', 'subordinativas']
  },
  PRONOMES: {
    name: 'Pronomes',
    color: '#06B6D4',
    subcategories: ['pessoais', 'possessivos', 'demonstrativos', 'relativos', 'indefinidos']
  },
  ARTIGOS: {
    name: 'Artigos',
    color: '#84CC16',
    subcategories: ['definidos', 'indefinidos']
  }
};

// Grammar Rules Database
export const PORTUGUESE_GRAMMAR_RULES = {
  // Noun-Adjective Agreement
  'concordancia_nominal': {
    id: 'concordancia_nominal',
    name: 'Concordância Nominal',
    description: 'Adjetivos concordam em gênero e número com substantivos',
    examples: ['casa bonita', 'casas bonitas', 'menino alto', 'meninos altos'],
    exceptions: ['cores compostas: olhos azul-claros'],
    difficulty: 'intermediate'
  },
  
  // Verb Conjugation
  'conjugacao_verbal': {
    id: 'conjugacao_verbal',
    name: 'Conjugação Verbal',
    description: 'Verbos variam conforme pessoa, número, tempo e modo',
    examples: ['eu falo', 'tu falas', 'ele fala', 'nós falamos'],
    exceptions: ['verbos irregulares: ser, ter, ir, vir'],
    difficulty: 'advanced'
  },
  
  // Crase
  'crase': {
    id: 'crase',
    name: 'Crase',
    description: 'Fusão da preposição "a" com artigo "a" ou pronome demonstrativo',
    examples: ['Vou à escola', 'Refiro-me àquela pessoa'],
    exceptions: ['antes de palavras masculinas: a cavalo'],
    difficulty: 'advanced'
  },
  
  // Plural Formation
  'formacao_plural': {
    id: 'formacao_plural',
    name: 'Formação do Plural',
    description: 'Regras para formar plural de substantivos e adjetivos',
    examples: ['casa → casas', 'animal → animais', 'cidadão → cidadãos'],
    exceptions: ['óculos (invariável)', 'lápis (invariável)'],
    difficulty: 'intermediate'
  }
};

export class GrammarNetworkService {
  private static instance: GrammarNetworkService;
  
  public static getInstance(): GrammarNetworkService {
    if (!GrammarNetworkService.instance) {
      GrammarNetworkService.instance = new GrammarNetworkService();
    }
    return GrammarNetworkService.instance;
  }
  
  /**
   * Generate a grammar network for a given word
   */
  public generateNetwork(word: string, depth: number = 2): GrammarNetwork {
    const centerNode = this.createWordNode(word, 0, { x: 0, y: 0 });
    const nodes: GrammarNode[] = [centerNode];
    const edges: GrammarEdge[] = [];
    
    // Generate connected nodes based on grammatical relationships
    this.expandNetwork(centerNode, nodes, edges, depth, 1);
    
    // Position nodes using force-directed layout
    this.positionNodes(nodes);
    
    const metadata: NetworkMetadata = {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      maxDepth: depth,
      categories: [...new Set(nodes.map(n => n.category))],
      complexity: this.calculateComplexity(nodes.length, edges.length)
    };
    
    return {
      nodes,
      edges,
      centerNode: centerNode.id,
      metadata
    };
  }
  
  /**
   * Create a word node with grammatical properties
   */
  private createWordNode(word: string, level: number, position: { x: number; y: number }): GrammarNode {
    const properties = this.analyzeWordProperties(word);
    const category = this.categorizeWord(properties.pos);
    
    return {
      id: `word_${word}_${level}`,
      word,
      type: 'word',
      category,
      level,
      position,
      properties,
      connections: []
    };
  }
  
  /**
   * Expand the network by adding related words and concepts
   */
  private expandNetwork(
    parentNode: GrammarNode, 
    nodes: GrammarNode[], 
    edges: GrammarEdge[], 
    maxDepth: number, 
    currentLevel: number
  ): void {
    if (currentLevel > maxDepth) return;
    
    const relatedWords = this.findRelatedWords(parentNode.word, parentNode.properties.pos);
    const grammarRules = this.findApplicableRules(parentNode.word, parentNode.properties.pos);
    
    // Add related words
    relatedWords.forEach((related, index) => {
      const angle = (index / relatedWords.length) * 2 * Math.PI;
      const radius = currentLevel * 150;
      const position = {
        x: parentNode.position.x + Math.cos(angle) * radius,
        y: parentNode.position.y + Math.sin(angle) * radius
      };
      
      const relatedNode = this.createWordNode(related.word, currentLevel, position);
      nodes.push(relatedNode);
      
      const edge: GrammarEdge = {
        id: `edge_${parentNode.id}_${relatedNode.id}`,
        source: parentNode.id,
        target: relatedNode.id,
        type: related.relation,
        strength: related.strength,
        label: this.getRelationLabel(related.relation),
        bidirectional: this.isBidirectionalRelation(related.relation)
      };
      edges.push(edge);
      
      parentNode.connections.push(relatedNode.id);
      relatedNode.connections.push(parentNode.id);
      
      // Recursively expand (with reduced depth)
      if (currentLevel < maxDepth) {
        this.expandNetwork(relatedNode, nodes, edges, maxDepth, currentLevel + 1);
      }
    });
    
    // Add grammar rule nodes
    grammarRules.forEach((rule, index) => {
      const ruleNode: GrammarNode = {
        id: `rule_${rule.id}_${currentLevel}`,
        word: rule.name,
        type: 'rule',
        category: 'REGRAS',
        level: currentLevel,
        position: {
          x: parentNode.position.x + (index - grammarRules.length/2) * 100,
          y: parentNode.position.y + currentLevel * 100
        },
        properties: {
          pos: 'rule',
          frequency: 0.5,
          difficulty: rule.difficulty === 'advanced' ? 0.9 : rule.difficulty === 'intermediate' ? 0.6 : 0.3,
          examples: rule.examples
        },
        connections: [parentNode.id]
      };
      
      nodes.push(ruleNode);
      
      const ruleEdge: GrammarEdge = {
        id: `edge_${parentNode.id}_${ruleNode.id}`,
        source: parentNode.id,
        target: ruleNode.id,
        type: 'syntactic',
        strength: 0.8,
        label: 'aplica regra',
        bidirectional: false
      };
      edges.push(ruleEdge);
      
      parentNode.connections.push(ruleNode.id);
    });
  }
  
  /**
   * Analyze grammatical properties of a word
   */
  private analyzeWordProperties(word: string): GrammarProperties {
    // This would typically use NLP libraries or databases
    // For demo purposes, we'll use heuristics
    
    const pos = this.detectPOS(word);
    const gender = this.detectGender(word);
    const number = this.detectNumber(word);
    
    return {
      pos,
      gender,
      number,
      frequency: Math.random(), // Would be from corpus data
      difficulty: Math.random(),
      examples: [`Exemplo com "${word}".`]
    };
  }
  
  /**
   * Detect part of speech using heuristics
   */
  private detectPOS(word: string): string {
    // Common Portuguese word endings
    if (word.endsWith('ção') || word.endsWith('são') || word.endsWith('dade')) {
      return 'substantivo';
    }
    if (word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) {
      return 'verbo';
    }
    if (word.endsWith('mente')) {
      return 'advérbio';
    }
    if (word.endsWith('oso') || word.endsWith('osa') || word.endsWith('ivo') || word.endsWith('iva')) {
      return 'adjetivo';
    }
    
    return 'substantivo'; // Default
  }
  
  /**
   * Detect gender using word endings
   */
  private detectGender(word: string): 'masculine' | 'feminine' | undefined {
    if (word.endsWith('a') || word.endsWith('ção') || word.endsWith('são') || word.endsWith('dade')) {
      return 'feminine';
    }
    if (word.endsWith('o') || word.endsWith('or') || word.endsWith('ês')) {
      return 'masculine';
    }
    return undefined;
  }
  
  /**
   * Detect number (singular/plural)
   */
  private detectNumber(word: string): 'singular' | 'plural' | undefined {
    if (word.endsWith('s') && word.length > 3) {
      return 'plural';
    }
    return 'singular';
  }
  
  /**
   * Find words related to the given word
   */
  private findRelatedWords(word: string, pos: string): Array<{word: string, relation: GrammarRelationType, strength: number}> {
    // This would typically query a linguistic database
    // For demo purposes, we'll generate some related words
    
    const related: Array<{word: string, relation: GrammarRelationType, strength: number}> = [];
    
    if (pos === 'substantivo') {
      // Add some related nouns
      related.push(
        { word: word + 's', relation: 'inflection', strength: 0.9 },
        { word: 'pequeno ' + word, relation: 'collocation', strength: 0.7 },
        { word: 'grande ' + word, relation: 'collocation', strength: 0.7 }
      );
    }
    
    if (pos === 'adjetivo') {
      // Add comparative forms
      related.push(
        { word: 'mais ' + word, relation: 'inflection', strength: 0.8 },
        { word: 'muito ' + word, relation: 'collocation', strength: 0.6 }
      );
    }
    
    if (pos === 'verbo') {
      // Add conjugated forms
      related.push(
        { word: word.replace(/ar$|er$|ir$/, 'ando'), relation: 'inflection', strength: 0.9 },
        { word: word.replace(/ar$/, 'ou').replace(/er$|ir$/, 'eu'), relation: 'inflection', strength: 0.9 }
      );
    }
    
    return related;
  }
  
  /**
   * Find grammar rules applicable to a word
   */
  private findApplicableRules(word: string, pos: string): Array<GrammarRule> {
    const applicableRules = [];
    
    if (pos === 'substantivo' || pos === 'adjetivo') {
      applicableRules.push(PORTUGUESE_GRAMMAR_RULES.concordancia_nominal);
      applicableRules.push(PORTUGUESE_GRAMMAR_RULES.formacao_plural);
    }
    
    if (pos === 'verbo') {
      applicableRules.push(PORTUGUESE_GRAMMAR_RULES.conjugacao_verbal);
    }
    
    return applicableRules;
  }
  
  /**
   * Categorize word based on POS
   */
  private categorizeWord(pos: string): string {
    const posMap: { [key: string]: string } = {
      'substantivo': 'SUBSTANTIVOS',
      'adjetivo': 'ADJETIVOS',
      'verbo': 'VERBOS',
      'advérbio': 'ADVÉRBIOS',
      'preposição': 'PREPOSIÇÕES',
      'conjunção': 'CONJUNÇÕES',
      'pronome': 'PRONOMES',
      'artigo': 'ARTIGOS'
    };
    
    return posMap[pos] || 'OUTROS';
  }
  
  /**
   * Get human-readable label for relation type
   */
  private getRelationLabel(relation: GrammarRelationType): string {
    const labels: { [key in GrammarRelationType]: string } = {
      'synonym': 'sinônimo',
      'antonym': 'antônimo',
      'hypernym': 'hiperônimo',
      'hyponym': 'hipônimo',
      'meronym': 'merônimo',
      'holonym': 'holônimo',
      'derivation': 'derivação',
      'inflection': 'flexão',
      'collocation': 'colocação',
      'semantic': 'semântico',
      'syntactic': 'sintático',
      'phonetic': 'fonético',
      'etymological': 'etimológico',
      'pragmatic': 'pragmático'
    };
    
    return labels[relation];
  }
  
  /**
   * Check if relation is bidirectional
   */
  private isBidirectionalRelation(relation: GrammarRelationType): boolean {
    const bidirectional: GrammarRelationType[] = [
      'synonym', 'antonym', 'collocation', 'semantic'
    ];
    
    return bidirectional.includes(relation);
  }
  
  /**
   * Position nodes using a simple force-directed algorithm
   */
  private positionNodes(nodes: GrammarNode[]): void {
    // Simple circular layout for demo
    // In a real implementation, you'd use a proper force-directed algorithm
    
    const centerNode = nodes[0];
    const angleStep = (2 * Math.PI) / Math.max(nodes.length - 1, 1);
    
    nodes.slice(1).forEach((node, index) => {
      const angle = index * angleStep;
      const radius = node.level * 120;
      
      node.position = {
        x: centerNode.position.x + Math.cos(angle) * radius,
        y: centerNode.position.y + Math.sin(angle) * radius
      };
    });
  }
  
  /**
   * Calculate network complexity
   */
  private calculateComplexity(nodeCount: number, edgeCount: number): 'simple' | 'moderate' | 'complex' | 'advanced' {
    const density = edgeCount / (nodeCount * (nodeCount - 1) / 2);
    
    if (nodeCount <= 5 && density <= 0.3) return 'simple';
    if (nodeCount <= 15 && density <= 0.5) return 'moderate';
    if (nodeCount <= 30 && density <= 0.7) return 'complex';
    return 'advanced';
  }
  
  /**
   * Get category color
   */
  public getCategoryColor(category: string): string {
    return GRAMMAR_CATEGORIES[category as keyof typeof GRAMMAR_CATEGORIES]?.color || '#6B7280';
  }
  
  /**
   * Get all available categories
   */
  public getCategories(): typeof GRAMMAR_CATEGORIES {
    return GRAMMAR_CATEGORIES;
  }
  
  /**
   * Search for words by category
   */
  public searchByCategory(category: string): string[] {
    // This would typically query a database
    // For demo purposes, return some example words
    
    const examples: { [key: string]: string[] } = {
      'SUBSTANTIVOS': ['casa', 'livro', 'pessoa', 'cidade', 'amor'],
      'ADJETIVOS': ['bonito', 'grande', 'inteligente', 'feliz', 'azul'],
      'VERBOS': ['falar', 'comer', 'dormir', 'trabalhar', 'estudar'],
      'ADVÉRBIOS': ['rapidamente', 'bem', 'muito', 'sempre', 'aqui']
    };
    
    return examples[category] || [];
  }
}