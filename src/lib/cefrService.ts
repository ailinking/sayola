// CEFR (Common European Framework of Reference) Proficiency Level Service
// Classifies Portuguese words according to A1-C2 levels

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface CEFRClassification {
  level: CEFRLevel;
  confidence: number; // 0-1 confidence score
  reasoning: string;
  category: 'vocabulary' | 'grammar' | 'function';
}

export interface CEFRLevelInfo {
  level: CEFRLevel;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  examples: string[];
}

// CEFR Level definitions
export const CEFR_LEVELS: Record<CEFRLevel, CEFRLevelInfo> = {
  A1: {
    level: 'A1',
    name: 'Beginner',
    description: 'Basic everyday words and expressions',
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    examples: ['casa', 'água', 'sim', 'não', 'obrigado']
  },
  A2: {
    level: 'A2',
    name: 'Elementary',
    description: 'Common words for daily activities',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    examples: ['trabalho', 'família', 'comprar', 'estudar', 'viajar']
  },
  B1: {
    level: 'B1',
    name: 'Intermediate',
    description: 'Words for familiar topics and situations',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    examples: ['experiência', 'opinião', 'desenvolver', 'sociedade', 'cultura']
  },
  B2: {
    level: 'B2',
    name: 'Upper Intermediate',
    description: 'Complex topics and abstract concepts',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    examples: ['consequência', 'estratégia', 'implementar', 'sustentabilidade', 'democracia']
  },
  C1: {
    level: 'C1',
    name: 'Advanced',
    description: 'Sophisticated vocabulary and nuanced meanings',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    examples: ['paradigma', 'epistemologia', 'concatenar', 'hegemonia', 'dialética']
  },
  C2: {
    level: 'C2',
    name: 'Proficient',
    description: 'Highly specialized and academic vocabulary',
    color: 'bg-red-100 text-red-800 border-red-200',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    examples: ['hermenêutica', 'fenomenologia', 'epistemológico', 'ontológico', 'heurística']
  }
};

// Portuguese word frequency and complexity database
const PORTUGUESE_CEFR_DATABASE: Record<string, CEFRLevel> = {
  // A1 - Basic everyday words (1000 most common words)
  'o': 'A1', 'a': 'A1', 'de': 'A1', 'e': 'A1', 'do': 'A1', 'da': 'A1', 'em': 'A1', 'um': 'A1', 'para': 'A1', 'é': 'A1',
  'com': 'A1', 'não': 'A1', 'uma': 'A1', 'os': 'A1', 'no': 'A1', 'se': 'A1', 'na': 'A1', 'por': 'A1', 'mais': 'A1', 'as': 'A1',
  'dos': 'A1', 'como': 'A1', 'mas': 'A1', 'foi': 'A1', 'ao': 'A1', 'das': 'A1', 'tem': 'A1', 'à': 'A1', 'seu': 'A1',
  'casa': 'A1', 'água': 'A1', 'sim': 'A1', 'obrigado': 'A1', 'obrigada': 'A1', 'por favor': 'A1', 'desculpe': 'A1',
  'bom': 'A1', 'boa': 'A1', 'dia': 'A1', 'noite': 'A1', 'manhã': 'A1', 'tarde': 'A1', 'hoje': 'A1', 'ontem': 'A1', 'amanhã': 'A1',
  'eu': 'A1', 'você': 'A1', 'ele': 'A1', 'ela': 'A1', 'nós': 'A1', 'vocês': 'A1', 'eles': 'A1', 'elas': 'A1',
  'ser': 'A1', 'estar': 'A1', 'ter': 'A1', 'fazer': 'A1', 'ir': 'A1', 'vir': 'A1', 'ver': 'A1', 'dar': 'A1', 'saber': 'A1', 'poder': 'A1',
  'nome': 'A1', 'idade': 'A1', 'ano': 'A1', 'mês': 'A1', 'semana': 'A1', 'hora': 'A1', 'minuto': 'A1', 'segundo': 'A1',
  'pai': 'A1', 'mãe': 'A1', 'filho': 'A1', 'filha': 'A1', 'irmão': 'A1', 'irmã': 'A1', 'família': 'A1',
  'comer': 'A1', 'beber': 'A1', 'dormir': 'A1', 'acordar': 'A1', 'trabalhar': 'A1', 'estudar': 'A1',
  
  // A2 - Elementary level (2000-3000 most common words)
  'trabalho': 'A2', 'escola': 'A2', 'universidade': 'A2', 'professor': 'A2', 'aluno': 'A2', 'estudante': 'A2',
  'comprar': 'A2', 'vender': 'A2', 'dinheiro': 'A2', 'preço': 'A2', 'caro': 'A2', 'barato': 'A2',
  'viajar': 'A2', 'viagem': 'A2', 'hotel': 'A2', 'restaurante': 'A2', 'comida': 'A2', 'bebida': 'A2',
  'saúde': 'A2', 'médico': 'A2', 'hospital': 'A2', 'doente': 'A2', 'remédio': 'A2',
  'cidade': 'A2', 'país': 'A2', 'mundo': 'A2', 'lugar': 'A2', 'rua': 'A2',
  'amigo': 'A2', 'amiga': 'A2', 'namorado': 'A2', 'namorada': 'A2', 'casado': 'A2', 'solteiro': 'A2',
  'feliz': 'A2', 'triste': 'A2', 'alegre': 'A2', 'nervoso': 'A2', 'calmo': 'A2', 'preocupado': 'A2',
  'importante': 'A2', 'interessante': 'A2', 'difícil': 'A2', 'fácil': 'A2', 'possível': 'A2', 'impossível': 'A2',
  
  // B1 - Intermediate level
  'experiência': 'B1', 'opinião': 'B1', 'desenvolver': 'B1', 'sociedade': 'B1', 'cultura': 'B1',
  'política': 'B1', 'economia': 'B1', 'história': 'B1', 'geografia': 'B1', 'ciência': 'B1',
  'tecnologia': 'B1', 'internet': 'B1', 'computador': 'B1', 'telefone': 'B1', 'comunicação': 'B1',
  'ambiente': 'B1', 'natureza': 'B1', 'animal': 'B1', 'planta': 'B1', 'clima': 'B1',
  'educação': 'B1', 'conhecimento': 'B1', 'aprender': 'B1', 'ensinar': 'B1', 'descobrir': 'B1',
  'relacionamento': 'B1', 'personalidade': 'B1', 'caráter': 'B1', 'comportamento': 'B1', 'atitude': 'B1',
  'problema': 'B1', 'solução': 'B1', 'decisão': 'B1', 'escolha': 'B1', 'oportunidade': 'B1',
  'sucesso': 'B1', 'fracasso': 'B1', 'objetivo': 'B1', 'meta': 'B1', 'resultado': 'B1',
  
  // B2 - Upper Intermediate level
  'consequência': 'B2', 'estratégia': 'B2', 'implementar': 'B2', 'sustentabilidade': 'B2', 'democracia': 'B2',
  'globalização': 'B2', 'diversidade': 'B2', 'multiculturalismo': 'B2', 'integração': 'B2', 'cooperação': 'B2',
  'inovação': 'B2', 'criatividade': 'B2', 'eficiência': 'B2', 'produtividade': 'B2', 'competitividade': 'B2',
  'responsabilidade': 'B2', 'compromisso': 'B2', 'transparência': 'B2', 'accountability': 'B2', 'governança': 'B2',
  'complexidade': 'B2', 'sofisticação': 'B2', 'elaboração': 'B2', 'refinamento': 'B2', 'aprimoramento': 'B2',
  'perspectiva': 'B2', 'abordagem': 'B2', 'metodologia': 'B2', 'framework': 'B2', 'paradigma': 'B2',
  'análise': 'B2', 'síntese': 'B2', 'avaliação': 'B2', 'interpretação': 'B2', 'compreensão': 'B2',
  
  // C1 - Advanced level
  'epistemologia': 'C1', 'concatenar': 'C1', 'hegemonia': 'C1', 'dialética': 'C1', 'hermenêutica': 'C1',
  'fenomenologia': 'C1', 'ontologia': 'C1', 'axiologia': 'C1', 'teleologia': 'C1', 'deontologia': 'C1',
  'empirismo': 'C1', 'racionalismo': 'C1', 'pragmatismo': 'C1', 'existencialismo': 'C1', 'estruturalismo': 'C1',
  'desconstrução': 'C1', 'metacognição': 'C1', 'metalinguagem': 'C1', 'intertextualidade': 'C1', 'polifonia': 'C1',
  'interdisciplinaridade': 'C1', 'transdisciplinaridade': 'C1', 'multidisciplinaridade': 'C1', 'holístico': 'C1', 'sistêmico': 'C1',
  'epistemológico': 'C1', 'metodológico': 'C1', 'conceitual': 'C1', 'teórico': 'C1', 'empírico': 'C1',
  
  // C2 - Proficient level
  'heurística': 'C2', 'algorítmico': 'C2', 'estocástico': 'C2', 'determinístico': 'C2', 'probabilístico': 'C2',
  'ontológico': 'C2', 'fenomenológico': 'C2', 'hermenêutico': 'C2', 'dialético': 'C2',
  'paradigmático': 'C2', 'sintagmático': 'C2', 'diacrônico': 'C2', 'sincrônico': 'C2', 'polissêmico': 'C2',
  'metalinguístico': 'C2', 'metadiscursivo': 'C2', 'metaficcional': 'C2', 'metatextual': 'C2', 'metacrítico': 'C2',
  'incomensurabilidade': 'C2', 'irredutibilidade': 'C2', 'indeterminação': 'C2', 'indecidibilidade': 'C2', 'incompletude': 'C2'
};

export class CEFRService {
  /**
   * Classify a Portuguese word according to CEFR levels
   */
  static classifyWord(word: string): CEFRClassification {
    const normalizedWord = word.toLowerCase().trim();
    
    // Direct lookup in database
    if (PORTUGUESE_CEFR_DATABASE[normalizedWord]) {
      return {
        level: PORTUGUESE_CEFR_DATABASE[normalizedWord],
        confidence: 0.95,
        reasoning: 'Direct database match',
        category: 'vocabulary'
      };
    }
    
    // Heuristic classification based on word characteristics
    return this.heuristicClassification(normalizedWord);
  }
  
  /**
   * Heuristic classification for words not in database
   */
  private static heuristicClassification(word: string): CEFRClassification {
    const length = word.length;
    const syllableCount = this.estimateSyllables(word);
    const hasComplexSuffixes = this.hasComplexSuffixes(word);
    const hasLatinRoots = this.hasLatinRoots(word);
    const isCompound = this.isCompoundWord(word);
    
    let level: CEFRLevel;
    let confidence: number;
    let reasoning: string;
    
    // Very short, common words
    if (length <= 3 && !hasComplexSuffixes) {
      level = 'A1';
      confidence = 0.8;
      reasoning = 'Short, basic word';
    }
    // Medium length, simple structure
    else if (length <= 6 && syllableCount <= 3 && !hasComplexSuffixes) {
      level = 'A2';
      confidence = 0.7;
      reasoning = 'Medium length, simple structure';
    }
    // Longer words with moderate complexity
    else if (length <= 10 && syllableCount <= 4 && !hasLatinRoots) {
      level = 'B1';
      confidence = 0.6;
      reasoning = 'Moderate length and complexity';
    }
    // Complex words with Latin roots or technical suffixes
    else if (hasLatinRoots || hasComplexSuffixes || isCompound) {
      if (length > 12 || syllableCount > 5) {
        level = 'C1';
        confidence = 0.65;
        reasoning = 'Complex word with Latin roots or technical suffixes';
      } else {
        level = 'B2';
        confidence = 0.6;
        reasoning = 'Moderately complex word';
      }
    }
    // Very long or highly complex words
    else if (length > 15 || syllableCount > 6) {
      level = 'C2';
      confidence = 0.7;
      reasoning = 'Very long or highly complex word';
    }
    // Default to intermediate
    else {
      level = 'B1';
      confidence = 0.5;
      reasoning = 'Default intermediate classification';
    }
    
    return {
      level,
      confidence,
      reasoning,
      category: 'vocabulary'
    };
  }
  
  /**
   * Estimate syllable count in Portuguese
   */
  private static estimateSyllables(word: string): number {
    const vowels = 'aeiouáéíóúâêîôûãõ';
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      const isVowel = vowels.includes(char);
      
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    return Math.max(1, count);
  }
  
  /**
   * Check for complex suffixes
   */
  private static hasComplexSuffixes(word: string): boolean {
    const complexSuffixes = [
      'ção', 'são', 'mento', 'mente', 'idade', 'ismo', 'ista', 'ologia', 'ografia',
      'ância', 'ência', 'ável', 'ível', 'oso', 'osa', 'ico', 'ica', 'tico', 'tica'
    ];
    
    return complexSuffixes.some(suffix => word.endsWith(suffix));
  }
  
  /**
   * Check for Latin roots
   */
  private static hasLatinRoots(word: string): boolean {
    const latinRoots = [
      'trans', 'inter', 'super', 'sub', 'pre', 'post', 'anti', 'contra', 'meta',
      'pseudo', 'neo', 'proto', 'auto', 'hetero', 'homo', 'multi', 'uni', 'bi', 'tri'
    ];
    
    return latinRoots.some(root => word.includes(root));
  }
  
  /**
   * Check if word is compound
   */
  private static isCompoundWord(word: string): boolean {
    return word.includes('-') || word.length > 12;
  }
  
  /**
   * Get CEFR level information
   */
  static getLevelInfo(level: CEFRLevel): CEFRLevelInfo {
    return CEFR_LEVELS[level];
  }
  
  /**
   * Get all CEFR levels
   */
  static getAllLevels(): CEFRLevelInfo[] {
    return Object.values(CEFR_LEVELS);
  }
  
  /**
   * Compare CEFR levels (returns -1, 0, 1)
   */
  static compareLevels(level1: CEFRLevel, level2: CEFRLevel): number {
    const order: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const index1 = order.indexOf(level1);
    const index2 = order.indexOf(level2);
    return index1 - index2;
  }
  
  /**
   * Get difficulty score (0-5)
   */
  static getDifficultyScore(level: CEFRLevel): number {
    const scores: Record<CEFRLevel, number> = {
      'A1': 0, 'A2': 1, 'B1': 2, 'B2': 3, 'C1': 4, 'C2': 5
    };
    return scores[level];
  }
}