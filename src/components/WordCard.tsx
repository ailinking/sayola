'use client';

import { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Globe, Mic } from 'lucide-react';
import { ttsService } from '@/lib/ttsService';

interface Phonetic {
  text?: string;
  audio?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Array<{
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
  }>;
}

interface WordData {
  word: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  sourceUrls?: string[];
}

interface WordCardProps {
  wordData: WordData;
  onPlayAudio?: (audioUrl: string) => void;
  className?: string;
  compact?: boolean;
}

export default function WordCard({ wordData, onPlayAudio, className = "", compact = false }: WordCardProps) {
  const [audioLoading, setAudioLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);

  const handlePlayAudio = async (audioUrl: string) => {
    if (!audioUrl) return;
    
    setAudioLoading(true);
    try {
      if (onPlayAudio) {
        await onPlayAudio(audioUrl);
      } else {
        const audio = new Audio(audioUrl);
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleTTSAudio = async () => {
    setTtsLoading(true);
    try {
      if (ttsService.isConfigured()) {
        // Use Google Cloud TTS
        const audioResult = await ttsService.generateAudio(wordData.word);
        if (audioResult.audioUrl) {
          const audio = new Audio(audioResult.audioUrl);
          await audio.play();
          
          // Clean up previous URL
          if (generatedAudioUrl) {
            ttsService.revokeAudioUrl(generatedAudioUrl);
          }
          setGeneratedAudioUrl(audioResult.audioUrl);
        }
      } else {
        // Fallback to Web Speech API
        await ttsService.generateFallbackAudio(wordData.word);
      }
    } catch (error) {
      console.error('Error generating TTS audio:', error);
      // Fallback to Web Speech API if TTS fails
      try {
        await ttsService.generateFallbackAudio(wordData.word);
      } catch (fallbackError) {
        console.error('Fallback TTS also failed:', fallbackError);
      }
    } finally {
      setTtsLoading(false);
    }
  };

  const mainPhonetic = wordData.phonetics?.find(p => p.audio) || wordData.phonetics?.[0];

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${compact ? 'p-4' : 'p-6'} ${className}`}>
      {/* Word Header */}
      <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-4'}`}>
        <div className="flex items-center space-x-3">
          <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 capitalize`}>
            {wordData.word}
          </h2>
          {mainPhonetic?.text && (
            <span className={`text-gray-600 ${compact ? 'text-base' : 'text-lg'}`}>
              /{mainPhonetic.text}/
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {mainPhonetic?.audio && (
            <button
              onClick={() => handlePlayAudio(mainPhonetic.audio!)}
              disabled={audioLoading}
              className={`flex items-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 ${compact ? 'px-2 py-1' : 'px-3 py-2'} rounded-md transition-colors disabled:opacity-50`}
            >
              {audioLoading ? (
                <VolumeX className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} animate-pulse`} />
              ) : (
                <Volume2 className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
              )}
              {!compact && <span className="text-sm">Play</span>}
            </button>
          )}
          
          {/* TTS Button */}
          <button
            onClick={handleTTSAudio}
            disabled={ttsLoading}
            className={`flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 ${compact ? 'px-2 py-1' : 'px-3 py-2'} rounded-md transition-colors disabled:opacity-50`}
            title="Generate Portuguese pronunciation"
          >
            {ttsLoading ? (
              <VolumeX className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} animate-pulse`} />
            ) : (
              <Mic className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            )}
            {!compact && <span className="text-sm">PT</span>}
          </button>
        </div>
      </div>

      {/* Meanings */}
      {wordData.meanings && wordData.meanings.length > 0 && (
        <div className={compact ? "space-y-2" : "space-y-4"}>
          {wordData.meanings.slice(0, compact ? 2 : wordData.meanings.length).map((meaning, meaningIndex) => (
            <div key={meaningIndex} className="border-l-4 border-green-500 pl-4">
              <div className={`flex items-center space-x-2 ${compact ? 'mb-1' : 'mb-2'}`}>
                <BookOpen className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700 capitalize">
                  {meaning.partOfSpeech}
                </span>
              </div>
              
              <div className={compact ? "space-y-1" : "space-y-2"}>
                {meaning.definitions.slice(0, compact ? 1 : 3).map((definition, defIndex) => (
                  <div key={defIndex} className="text-gray-700">
                    <p className={`${compact ? 'text-sm' : ''} mb-1`}>{definition.definition}</p>
                    {!compact && definition.example && (
                      <p className="text-sm text-gray-600 italic pl-4 border-l-2 border-gray-200">
                        &ldquo;{definition.example}&rdquo;
                      </p>
                    )}
                    {!compact && definition.synonyms && definition.synonyms.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500 font-medium">Synonyms: </span>
                        <span className="text-xs text-blue-600">
                          {definition.synonyms.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Source */}
      {wordData.sourceUrls && wordData.sourceUrls.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <span>Source: </span>
            <a 
              href={wordData.sourceUrls[0]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Free Dictionary API
            </a>
          </div>
        </div>
      )}
    </div>
  );
}