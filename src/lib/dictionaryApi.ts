import axios from 'axios';

export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Definition {
  definition: string;
  englishTranslation?: string;
  example?: string;
  exampleTranslation?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  partOfSpeechEnglish?: string;
  definitions: Definition[];
}

export interface Inflection {
  form: string;
  type: string;
  example?: string;
}

export interface WordData {
  word: string;
  englishTranslation?: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  inflections?: Inflection[];
  relatedWords?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  frequency?: number;
  sourceUrls?: string[];
}

export interface DictionaryResponse {
  success: boolean;
  data?: WordData[];
  error?: string;
}

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries';

// Local Portuguese vocabulary database
const PORTUGUESE_WORDS: Record<string, WordData> = {
  'felicidade': {
    word: 'felicidade',
    englishTranslation: 'happiness',
    phonetics: [{ text: '/fe.li.si.ˈda.de/' }],
    difficulty: 'intermediate',
    frequency: 85,
    meanings: [{
      partOfSpeech: 'substantivo feminino',
      partOfSpeechEnglish: 'feminine noun',
      definitions: [{
        definition: 'Estado de quem está feliz; alegria, contentamento',
        englishTranslation: 'State of being happy; joy, contentment',
        example: 'A felicidade é um sentimento que todos buscam.',
        exampleTranslation: 'Happiness is a feeling that everyone seeks.',
        synonyms: ['alegria', 'contentamento', 'júbilo', 'satisfação']
      }, {
        definition: 'Circunstância favorável; sorte, ventura',
        englishTranslation: 'Favorable circumstance; luck, fortune',
        example: 'Que felicidade encontrar você aqui!',
        exampleTranslation: 'What luck to find you here!',
        synonyms: ['sorte', 'ventura', 'fortuna']
      }]
    }],
    inflections: [
      { form: 'felicidades', type: 'plural', example: 'Muitas felicidades!' }
    ],
    relatedWords: ['feliz', 'felizmente', 'infelicidade'],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'saudade': {
    word: 'saudade',
    englishTranslation: 'longing, nostalgia',
    phonetics: [{ text: '/saw.ˈda.de/' }],
    difficulty: 'advanced',
    frequency: 70,
    meanings: [{
      partOfSpeech: 'substantivo feminino',
      partOfSpeechEnglish: 'feminine noun',
      definitions: [{
        definition: 'Sentimento melancólico de falta de alguém ou algo querido',
        englishTranslation: 'Melancholic feeling of missing someone or something dear',
        example: 'Sinto saudade dos meus amigos.',
        exampleTranslation: 'I miss my friends.',
        synonyms: ['nostalgia', 'melancolia', 'lembrança']
      }, {
        definition: 'Lembrança nostálgica e carinhosa',
        englishTranslation: 'Nostalgic and affectionate memory',
        example: 'Que saudade da minha infância!',
        exampleTranslation: 'How I miss my childhood!',
        synonyms: ['nostalgia', 'recordação']
      }]
    }],
    inflections: [
      { form: 'saudades', type: 'plural', example: 'Muitas saudades de casa.' }
    ],
    relatedWords: ['saudoso', 'saudosismo'],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'obrigado': {
    word: 'obrigado',
    phonetics: [{ text: '/o.bri.ˈga.do/' }],
    meanings: [{
      partOfSpeech: 'interjection',
      definitions: [{
        definition: 'Expressão de agradecimento (usado por homens)',
        example: 'Obrigado pela ajuda!',
        synonyms: ['agradecido']
      }]
    }],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'obrigada': {
    word: 'obrigada',
    phonetics: [{ text: '/o.bri.ˈga.da/' }],
    meanings: [{
      partOfSpeech: 'interjection',
      definitions: [{
        definition: 'Expressão de agradecimento (usado por mulheres)',
        example: 'Obrigada pela ajuda!',
        synonyms: ['agradecida']
      }]
    }],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'família': {
    word: 'família',
    phonetics: [{ text: '/fa.ˈmi.lja/' }],
    meanings: [{
      partOfSpeech: 'noun',
      definitions: [{
        definition: 'Grupo de pessoas aparentadas que vivem em geral na mesma casa',
        example: 'Minha família é muito unida.',
        synonyms: ['parentes', 'lar']
      }]
    }],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'amor': {
    word: 'amor',
    englishTranslation: 'love',
    phonetics: [{ text: '/a.ˈmor/' }],
    difficulty: 'beginner',
    frequency: 95,
    meanings: [{
      partOfSpeech: 'substantivo masculino',
      partOfSpeechEnglish: 'masculine noun',
      definitions: [{
        definition: 'Sentimento de afeição profunda por alguém ou algo',
        englishTranslation: 'Feeling of deep affection for someone or something',
        example: 'O amor é o sentimento mais forte.',
        exampleTranslation: 'Love is the strongest feeling.',
        synonyms: ['afeição', 'carinho', 'paixão', 'ternura']
      }, {
        definition: 'Pessoa amada',
        englishTranslation: 'Beloved person',
        example: 'Ela é o amor da minha vida.',
        exampleTranslation: 'She is the love of my life.',
        synonyms: ['amado', 'querido', 'bem-amado']
      }]
    }],
    inflections: [
      { form: 'amores', type: 'plural', example: 'Os amores da juventude.' }
    ],
    relatedWords: ['amar', 'amado', 'amoroso', 'desamor'],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'casa': {
    word: 'casa',
    englishTranslation: 'house, home',
    phonetics: [{ text: '/ˈka.za/' }],
    difficulty: 'beginner',
    frequency: 98,
    meanings: [{
      partOfSpeech: 'substantivo feminino',
      partOfSpeechEnglish: 'feminine noun',
      definitions: [{
        definition: 'Edificação destinada à habitação',
        englishTranslation: 'Building intended for habitation',
        example: 'Vou para casa depois do trabalho.',
        exampleTranslation: 'I go home after work.',
        synonyms: ['lar', 'residência', 'moradia', 'habitação']
      }, {
        definition: 'Família, linhagem',
        englishTranslation: 'Family, lineage',
        example: 'A casa real portuguesa.',
        exampleTranslation: 'The Portuguese royal house.',
        synonyms: ['família', 'linhagem', 'dinastia']
      }]
    }],
    inflections: [
      { form: 'casas', type: 'plural', example: 'As casas da rua.' }
    ],
    relatedWords: ['caseiro', 'casinha', 'casal'],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'água': {
    word: 'água',
    phonetics: [{ text: '/ˈa.gwa/' }],
    meanings: [{
      partOfSpeech: 'noun',
      definitions: [{
        definition: 'Líquido transparente, incolor, inodoro e insípido',
        example: 'Preciso beber mais água.',
        synonyms: ['H2O']
      }]
    }],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'bom': {
    word: 'bom',
    phonetics: [{ text: '/ˈbõ/' }],
    meanings: [{
      partOfSpeech: 'adjective',
      definitions: [{
        definition: 'Que tem qualidade; que é adequado ou satisfatório',
        example: 'Este é um bom livro.',
        synonyms: ['excelente', 'ótimo', 'adequado']
      }]
    }],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'boa': {
    word: 'boa',
    englishTranslation: 'good (feminine)',
    phonetics: [{ text: '/ˈbo.a/' }],
    difficulty: 'beginner',
    frequency: 96,
    meanings: [{
      partOfSpeech: 'adjetivo feminino',
      partOfSpeechEnglish: 'feminine adjective',
      definitions: [{
        definition: 'Feminino de bom; que tem qualidade',
        englishTranslation: 'Feminine of good; that has quality',
        example: 'Tenha uma boa noite!',
        exampleTranslation: 'Have a good night!',
        synonyms: ['excelente', 'ótima', 'adequada', 'perfeita']
      }]
    }],
    relatedWords: ['bom', 'bondade', 'bondoso'],
    sourceUrls: ['Local Portuguese Dictionary']
  },
  'amar': {
    word: 'amar',
    englishTranslation: 'to love',
    phonetics: [{ text: '/a.ˈmar/' }],
    difficulty: 'beginner',
    frequency: 90,
    meanings: [{
      partOfSpeech: 'verbo transitivo',
      partOfSpeechEnglish: 'transitive verb',
      definitions: [{
        definition: 'Ter amor por; sentir afeição profunda',
        englishTranslation: 'To have love for; to feel deep affection',
        example: 'Eu amo minha família.',
        exampleTranslation: 'I love my family.',
        synonyms: ['adorar', 'querer bem', 'estimar']
      }, {
        definition: 'Gostar muito de; ter paixão por',
        englishTranslation: 'To like very much; to have passion for',
        example: 'Ela ama dançar.',
        exampleTranslation: 'She loves to dance.',
        synonyms: ['adorar', 'apaixonar-se', 'gostar']
      }]
    }],
    inflections: [
      { form: 'amo', type: 'presente 1ª pessoa singular', example: 'Eu amo você.' },
      { form: 'amas', type: 'presente 2ª pessoa singular', example: 'Tu amas a vida.' },
      { form: 'ama', type: 'presente 3ª pessoa singular', example: 'Ele ama música.' },
      { form: 'amamos', type: 'presente 1ª pessoa plural', example: 'Nós amamos viajar.' },
      { form: 'amam', type: 'presente 3ª pessoa plural', example: 'Eles amam estudar.' },
      { form: 'amei', type: 'pretérito perfeito 1ª pessoa singular', example: 'Eu amei aquele filme.' },
      { form: 'amava', type: 'pretérito imperfeito 1ª pessoa singular', example: 'Eu amava brincar.' }
    ],
    relatedWords: ['amor', 'amado', 'amoroso', 'amante'],
    sourceUrls: ['Local Portuguese Dictionary']
  }
};

export class DictionaryService {
  /**
   * Search for a word in English dictionary
   */
  static async searchWord(word: string, language: string = 'en'): Promise<DictionaryResponse> {
    try {
      if (!word || word.trim().length === 0) {
        return {
          success: false,
          error: 'Please provide a word to search'
        };
      }

      const cleanWord = word.trim().toLowerCase();
      
      // First, check local Portuguese dictionary
      if (PORTUGUESE_WORDS[cleanWord]) {
        return {
          success: true,
          data: [PORTUGUESE_WORDS[cleanWord]]
        };
      }
      
      const url = `${DICTIONARY_API_BASE}/${language}/${encodeURIComponent(cleanWord)}`;
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Sayola-Portuguese-Learning-App'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        error: `No definitions found for "${cleanWord}"`
      };

    } catch (error: unknown) {
      console.error('Dictionary API Error:', error);
      const cleanWord = word.trim().toLowerCase();

      if (error && typeof error === 'object' && 'response' in error && 
          (error as { response?: { status?: number } }).response?.status === 404) {
        return {
          success: false,
          error: `No definitions found for "${cleanWord}". Please check the spelling or try a different word.`
        };
      }

      if (error && typeof error === 'object' && 'code' in error && 
          (error as { code?: string }).code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request timeout. Please check your internet connection and try again.'
        };
      }

      return {
        success: false,
        error: 'Unable to fetch word definition. Please try again later.'
      };
    }
  }

  /**
   * Search for Portuguese words (using English API for now, can be extended)
   */
  static async searchPortugueseWord(word: string): Promise<DictionaryResponse> {
    // For now, we'll use the English API to search for Portuguese words
    // In a production app, you might want to use a Portuguese-specific dictionary API
    return this.searchWord(word, 'en');
  }

  /**
   * Get word suggestions based on partial input
   */
  static async getSuggestions(partialWord: string): Promise<string[]> {
    try {
      // This is a simple implementation - in production you might want to use
      // a dedicated autocomplete API or maintain your own word list
      if (partialWord.length < 2) return [];

      // For now, return some common Portuguese words that start with the input
      const commonWords = [
        'obrigado', 'obrigada', 'olá', 'oi', 'bom', 'boa', 'dia', 'noite',
        'família', 'casa', 'água', 'comida', 'amor', 'feliz', 'triste',
        'grande', 'pequeno', 'bonito', 'feio', 'novo', 'velho',
        'trabalho', 'escola', 'amigo', 'amiga', 'livro', 'música',
        'saudade', 'felicidade', 'liberdade', 'verdade', 'cidade'
      ];

      return commonWords
        .filter(word => word.toLowerCase().startsWith(partialWord.toLowerCase()))
        .slice(0, 5);

    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * Validate if a word contains only valid characters
   */
  static isValidWord(word: string): boolean {
    // Allow letters, accented characters, hyphens, and apostrophes
    const validWordRegex = /^[a-zA-ZÀ-ÿ\-']+$/;
    return validWordRegex.test(word.trim());
  }

  /**
   * Clean and normalize word input
   */
  static normalizeWord(word: string): string {
    return word.trim().toLowerCase().replace(/\s+/g, ' ');
  }
}