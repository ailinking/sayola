import axios from 'axios';

export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface WordData {
  word: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  sourceUrls?: string[];
}

export interface DictionaryResponse {
  success: boolean;
  data?: WordData[];
  error?: string;
}

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries';

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
        error: 'No definitions found for this word'
      };

    } catch (error: unknown) {
      console.error('Dictionary API Error:', error);

      if (error && typeof error === 'object' && 'response' in error && 
          (error as { response?: { status?: number } }).response?.status === 404) {
        return {
          success: false,
          error: `No definitions found for "${word}". Please check the spelling or try a different word.`
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