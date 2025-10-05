'use client';

import React, { useState, useCallback } from 'react';
import { DictionaryService, type WordData } from '@/lib/dictionaryApi';
import { CEFRBadge } from './CEFRBadge';

interface LinkableTextProps {
  text: string;
  className?: string;
  onWordClick?: (word: string, wordData?: WordData) => void;
  excludeWords?: string[]; // Words to not make clickable (e.g., the current word being displayed)
}

interface WordLookupPopupProps {
  word: string;
  wordData: WordData | null;
  position: { x: number; y: number };
  onClose: () => void;
  loading: boolean;
}

const WordLookupPopup: React.FC<WordLookupPopupProps> = ({
  word,
  wordData,
  position,
  onClose,
  loading
}) => {
  return (
    <div
      className="linkable-text-popup fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-lg text-gray-900">{word}</h3>
          <CEFRBadge word={word} size="sm" showTooltip={false} />
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          ×
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Looking up...</span>
        </div>
      ) : wordData ? (
        <div className="space-y-2">
          {wordData.phonetics && wordData.phonetics.length > 0 && wordData.phonetics[0]?.text && (
            <p className="text-sm text-gray-600 italic">/{wordData.phonetics[0].text}/</p>
          )}
          
          {wordData.englishTranslation && (
            <p className="text-sm font-medium text-blue-700">
              {wordData.englishTranslation}
            </p>
          )}
          
          {wordData.meanings && wordData.meanings.length > 0 && (
            <div className="space-y-1">
              {wordData.meanings.slice(0, 2).map((meaning, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-700">{meaning.partOfSpeech}:</span>
                  <span className="ml-1 text-gray-600">
                    {meaning.definitions[0]?.definition}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                window.open(`/search?q=${encodeURIComponent(word)}`, '_blank');
                onClose();
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              View full definition →
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">No definition found</p>
      )}
    </div>
  );
};

const LinkableText: React.FC<LinkableTextProps> = ({
  text,
  className = '',
  onWordClick,
  excludeWords = []
}) => {
  const [popup, setPopup] = useState<{
    word: string;
    position: { x: number; y: number };
    wordData: WordData | null;
    loading: boolean;
  } | null>(null);

  // Portuguese word pattern - matches words with Portuguese characters
  const portugueseWordPattern = /\b[a-záàâãéêíóôõúçñA-ZÁÀÂÃÉÊÍÓÔÕÚÇÑ]+\b/g;

  const handleWordClick = useCallback(async (word: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    const normalizedWord = DictionaryService.normalizeWord(word.toLowerCase());
    
    // Don't make excluded words clickable
    if (excludeWords.some(excluded => 
      DictionaryService.normalizeWord(excluded.toLowerCase()) === normalizedWord
    )) {
      return;
    }

    // Get click position for popup
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    // Show loading popup
    setPopup({
      word: normalizedWord,
      position,
      wordData: null,
      loading: true
    });

    try {
      // Look up the word
      const response = await DictionaryService.searchWord(normalizedWord);
      const wordData = response.success && response.data && response.data.length > 0 ? response.data[0] : null;
      
      setPopup(prev => prev ? {
        ...prev,
        wordData,
        loading: false
      } : null);

      // Call the optional callback
      if (onWordClick) {
        onWordClick(normalizedWord, wordData || undefined);
      }
    } catch (error) {
      console.error('Error looking up word:', error);
      setPopup(prev => prev ? {
        ...prev,
        wordData: null,
        loading: false
      } : null);
    }
  }, [excludeWords, onWordClick]);

  const closePopup = useCallback(() => {
    setPopup(null);
  }, []);

  // Close popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup) {
        const target = event.target as HTMLElement;
        // Check if the click is outside the popup and not on a LinkableText button
        if (!target.closest('.linkable-text-popup') && !target.closest('.linkable-text-button')) {
          closePopup();
        }
      }
    };

    if (popup) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [popup, closePopup]);

  const renderTextWithLinks = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    // Reset the regex
    portugueseWordPattern.lastIndex = 0;

    while ((match = portugueseWordPattern.exec(text)) !== null) {
      const word = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + word.length;

      // Add text before the word
      if (startIndex > lastIndex) {
        parts.push(text.slice(lastIndex, startIndex));
      }

      // Check if this word should be excluded
      const normalizedWord = DictionaryService.normalizeWord(word.toLowerCase());
      const isExcluded = excludeWords.some(excluded => 
        DictionaryService.normalizeWord(excluded.toLowerCase()) === normalizedWord
      );

      // Add the word (clickable or not)
      if (isExcluded || word.length < 3) {
        // Don't make very short words or excluded words clickable
        parts.push(word);
      } else {
        parts.push(
          <button
            key={`${word}-${startIndex}`}
            onClick={(e) => handleWordClick(word, e)}
            className="linkable-text-button text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
            title={`Look up "${word}"`}
          >
            {word}
          </button>
        );
      }

      lastIndex = endIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <>
      <span className={className}>
        {renderTextWithLinks(text)}
      </span>
      
      {popup && (
        <WordLookupPopup
          word={popup.word}
          wordData={popup.wordData}
          position={popup.position}
          onClose={closePopup}
          loading={popup.loading}
        />
      )}
    </>
  );
};

export default LinkableText;