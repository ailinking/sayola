// Text-to-Speech Service for Portuguese pronunciation
// This service handles audio generation using Google Cloud TTS API

export interface TTSConfig {
  languageCode: string;
  voiceName?: string;
  ssmlGender?: 'NEUTRAL' | 'FEMALE' | 'MALE';
  audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
  speakingRate?: number;
  pitch?: number;
}

export interface AudioResult {
  audioContent: string; // Base64 encoded audio
  audioUrl?: string; // Blob URL for playback
}

class TTSService {
  private apiKey: string | null = null;
  private baseUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  
  constructor() {
    // In a real implementation, this would come from environment variables
    // For demo purposes, we'll use a placeholder
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_TTS_API_KEY || null;
  }

  /**
   * Set the API key for Google Cloud TTS
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Check if TTS service is configured
   */
  isConfigured(): boolean {
    return this.apiKey !== null;
  }

  /**
   * Generate audio for Portuguese text
   */
  async generateAudio(
    text: string, 
    config: Partial<TTSConfig> = {}
  ): Promise<AudioResult> {
    if (!this.apiKey) {
      throw new Error('Google Cloud TTS API key not configured');
    }

    const defaultConfig: TTSConfig = {
      languageCode: 'pt-BR', // Brazilian Portuguese
      voiceName: 'pt-BR-Wavenet-A',
      ssmlGender: 'FEMALE',
      audioEncoding: 'MP3',
      speakingRate: 1.0,
      pitch: 0.0,
      ...config
    };

    const requestBody = {
      input: { text },
      voice: {
        languageCode: defaultConfig.languageCode,
        name: defaultConfig.voiceName,
        ssmlGender: defaultConfig.ssmlGender
      },
      audioConfig: {
        audioEncoding: defaultConfig.audioEncoding,
        speakingRate: defaultConfig.speakingRate,
        pitch: defaultConfig.pitch
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.audioContent) {
        throw new Error('No audio content received from TTS API');
      }

      // Convert base64 to blob URL for playback
      const audioBlob = this.base64ToBlob(data.audioContent, 'audio/mpeg');
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioContent: data.audioContent,
        audioUrl
      };
    } catch (error) {
      console.error('TTS generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate audio for multiple Portuguese variants
   */
  async generateMultipleVariants(text: string): Promise<{
    brazilian: AudioResult;
    european: AudioResult;
  }> {
    const [brazilian, european] = await Promise.all([
      this.generateAudio(text, {
        languageCode: 'pt-BR',
        voiceName: 'pt-BR-Wavenet-A'
      }),
      this.generateAudio(text, {
        languageCode: 'pt-PT',
        voiceName: 'pt-PT-Wavenet-A'
      })
    ]);

    return { brazilian, european };
  }

  /**
   * Convert base64 string to Blob
   */
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  /**
   * Clean up blob URLs to prevent memory leaks
   */
  revokeAudioUrl(audioUrl: string): void {
    URL.revokeObjectURL(audioUrl);
  }

  /**
   * Get available Portuguese voices
   */
  getAvailableVoices(): { code: string; name: string; gender: string }[] {
    return [
      { code: 'pt-BR-Wavenet-A', name: 'Brazilian Portuguese (Female)', gender: 'FEMALE' },
      { code: 'pt-BR-Wavenet-B', name: 'Brazilian Portuguese (Male)', gender: 'MALE' },
      { code: 'pt-BR-Standard-A', name: 'Brazilian Portuguese Standard (Female)', gender: 'FEMALE' },
      { code: 'pt-PT-Wavenet-A', name: 'European Portuguese (Female)', gender: 'FEMALE' },
      { code: 'pt-PT-Wavenet-B', name: 'European Portuguese (Male)', gender: 'MALE' },
      { code: 'pt-PT-Standard-A', name: 'European Portuguese Standard (Female)', gender: 'FEMALE' }
    ];
  }

  /**
   * Fallback TTS using Web Speech API (for demo/development)
   */
  async generateFallbackAudio(text: string): Promise<void> {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      // Try to find a Portuguese voice
      const voices = speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.startsWith('pt') || voice.name.toLowerCase().includes('portuguese')
      );
      
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }
      
      speechSynthesis.speak(utterance);
    } else {
      throw new Error('Speech synthesis not supported in this browser');
    }
  }
}

// Export singleton instance
export const ttsService = new TTSService();
export default TTSService;