'use client';

import { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Globe, Mic, Heart, ChevronDown, ChevronUp, Languages, BookMarked, Shuffle } from 'lucide-react';
import { ttsService } from '@/lib/ttsService';
import LinkableText from './LinkableText';
import { CEFRBadge } from './CEFRBadge';

interface Phonetic {
  text?: string;
  audio?: string;
}

interface Definition {
  definition: string;
  englishTranslation?: string;
  example?: string;
  exampleTranslation?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  partOfSpeechEnglish?: string;
  definitions: Definition[];
}

interface Inflection {
  form: string;
  type: string;
  example: string;
}

interface WordData {
  word: string;
  englishTranslation?: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  sourceUrls?: string[];
  difficulty?: string;
  frequency?: number;
  inflections?: Inflection[];
  relatedWords?: string[];
}

interface WordCardProps {
  wordData: WordData;
  onPlayAudio?: (audioUrl: string) => void;
  onCollectWord?: (word: string) => void;
  className?: string;
  compact?: boolean;
}

export default function WordCard({ wordData, onPlayAudio, onCollectWord, className = "", compact = false }: WordCardProps) {
  const [audioLoading, setAudioLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [showInflections, setShowInflections] = useState(false);
  const [showThesaurus, setShowThesaurus] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

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
        const audioResult = await ttsService.generateAudio(wordData.word);
        if (audioResult.audioUrl) {
          const audio = new Audio(audioResult.audioUrl);
          await audio.play();
          
          if (generatedAudioUrl) {
            ttsService.revokeAudioUrl(generatedAudioUrl);
          }
          setGeneratedAudioUrl(audioResult.audioUrl);
        }
      } else {
        await ttsService.generateFallbackAudio(wordData.word);
      }
    } catch (error) {
      console.error('Error generating TTS audio:', error);
      try {
        await ttsService.generateFallbackAudio(wordData.word);
      } catch (fallbackError) {
        console.error('Fallback TTS also failed:', fallbackError);
      }
    } finally {
      setTtsLoading(false);
    }
  };

  const handleCollectWord = () => {
    setIsCollected(!isCollected);
    if (onCollectWord) {
      onCollectWord(wordData.word);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mainPhonetic = wordData.phonetics?.find(p => p.audio) || wordData.phonetics?.[0];

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${compact ? 'p-4' : 'p-6'} ${className}`}>
      {/* Word Header */}
      <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-4'}`}>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 capitalize`}>
              {wordData.word}
            </h2>
            <CEFRBadge 
              word={wordData.word} 
              size={compact ? 'sm' : 'md'}
              showTooltip={true}
            />
            {wordData.englishTranslation && (
              <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                <Languages className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">
                  {wordData.englishTranslation}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {mainPhonetic?.text && (
              <span className={`text-gray-600 ${compact ? 'text-base' : 'text-lg'}`}>
                /{mainPhonetic.text}/
              </span>
            )}
            {wordData.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(wordData.difficulty)}`}>
                {wordData.difficulty}
              </span>
            )}
            {wordData.frequency && (
              <span className="text-xs text-gray-500">
                Frequency: {wordData.frequency}%
              </span>
            )}
          </div>
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

          <button
            onClick={handleCollectWord}
            className={`flex items-center space-x-1 ${isCollected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} hover:bg-red-200 ${compact ? 'px-2 py-1' : 'px-3 py-2'} rounded-md transition-colors`}
            title="Collect word"
          >
            <Heart className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} ${isCollected ? 'fill-current' : ''}`} />
            {!compact && <span className="text-sm">Collect</span>}
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
                {meaning.partOfSpeechEnglish && (
                  <span className="text-sm text-gray-500">
                    ({meaning.partOfSpeechEnglish})
                  </span>
                )}
              </div>
              
              <div className={compact ? "space-y-1" : "space-y-3"}>
                {meaning.definitions.slice(0, compact ? 1 : 3).map((definition, defIndex) => (
                  <div key={defIndex} className="text-gray-700">
                    <div className="mb-2">
                      <div className={`${compact ? 'text-sm' : ''} mb-1 font-medium`}>
                        <LinkableText text={definition.definition} />
                      </div>
                      {definition.englishTranslation && (
                        <p className="text-sm text-blue-600 italic">
                          → {definition.englishTranslation}
                        </p>
                      )}
                    </div>
                    
                    {!compact && definition.example && (
                      <div className="bg-gray-50 p-3 rounded-md mb-2">
                        <div className="text-sm text-gray-700 italic mb-1">
                          &ldquo;<LinkableText text={definition.example} />&rdquo;
                        </div>
                        {definition.exampleTranslation && (
                          <p className="text-xs text-blue-600">
                            → {definition.exampleTranslation}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {!compact && definition.synonyms && definition.synonyms.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 font-medium">Synonyms: </span>
                        <span className="text-xs text-blue-600">
                          <LinkableText text={definition.synonyms.slice(0, 4).join(', ')} />
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

      {/* Interactive Features */}
      {!compact && (
        <div className="mt-6 space-y-4">
          {/* Inflections */}
          {wordData.inflections && wordData.inflections.length > 0 && (
            <div className="border rounded-lg p-4">
              <button
                onClick={() => setShowInflections(!showInflections)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Shuffle className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-700">Inflections</span>
                </div>
                {showInflections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showInflections && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {wordData.inflections.map((inflection, index) => (
                    <div key={index} className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">
                        <LinkableText text={inflection.form} />
                      </div>
                      <div className="text-xs text-purple-600">{inflection.type}</div>
                      <div className="text-sm text-gray-700 italic">
                        <LinkableText text={inflection.example} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Thesaurus */}
          {wordData.relatedWords && wordData.relatedWords.length > 0 && (
            <div className="border rounded-lg p-4">
              <button
                onClick={() => setShowThesaurus(!showThesaurus)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <BookMarked className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-indigo-700">Related Words</span>
                </div>
                {showThesaurus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showThesaurus && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {wordData.relatedWords.map((word, index) => (
                      <span key={index} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-sm">
                        <LinkableText text={word} />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Source */}
      {wordData.sourceUrls && wordData.sourceUrls.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <span>Source: </span>
              <span className="text-blue-600">
                {wordData.sourceUrls[0].includes('Local') ? 'Local Portuguese Dictionary' : 'Free Dictionary API'}
              </span>
          </div>
        </div>
      )}
    </div>
  );
}