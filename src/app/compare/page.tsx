'use client';

import { useState } from 'react';
import { ArrowLeftRight, Volume2, BookOpen, AlertCircle, Plus, X } from 'lucide-react';
import SearchBox from '@/components/SearchBox';
import WordCard from '@/components/WordCard';
import { DictionaryService, WordData } from '@/lib/dictionaryApi';

interface ComparisonPair {
  id: string;
  word1: string;
  word2: string;
  data1: WordData | null;
  data2: WordData | null;
  loading1: boolean;
  loading2: boolean;
  error1: string | null;
  error2: string | null;
}

export default function ComparePage() {
  const [comparisons, setComparisons] = useState<ComparisonPair[]>([
    {
      id: '1',
      word1: '',
      word2: '',
      data1: null,
      data2: null,
      loading1: false,
      loading2: false,
      error1: null,
      error2: null,
    }
  ]);

  const searchWord = async (comparisonId: string, wordPosition: 'word1' | 'word2', query: string) => {
    if (!query.trim()) return;

    setComparisons(prev => prev.map(comp => 
      comp.id === comparisonId 
        ? { 
            ...comp, 
            [wordPosition]: query,
            [`loading${wordPosition === 'word1' ? '1' : '2'}`]: true,
            [`error${wordPosition === 'word1' ? '1' : '2'}`]: null,
            [`data${wordPosition === 'word1' ? '1' : '2'}`]: null,
          }
        : comp
    ));

    try {
      const result = await DictionaryService.searchWord(query);
      
      setComparisons(prev => prev.map(comp => 
        comp.id === comparisonId 
          ? { 
              ...comp,
              [`loading${wordPosition === 'word1' ? '1' : '2'}`]: false,
              [`data${wordPosition === 'word1' ? '1' : '2'}`]: result.success && result.data ? result.data[0] : null,
              [`error${wordPosition === 'word1' ? '1' : '2'}`]: result.success ? null : (result.error || 'No results found'),
            }
          : comp
      ));
    } catch {
      setComparisons(prev => prev.map(comp => 
        comp.id === comparisonId 
          ? { 
              ...comp,
              [`loading${wordPosition === 'word1' ? '1' : '2'}`]: false,
              [`error${wordPosition === 'word1' ? '1' : '2'}`]: 'An unexpected error occurred',
            }
          : comp
      ));
    }
  };

  const addComparison = () => {
    const newComparison: ComparisonPair = {
      id: Date.now().toString(),
      word1: '',
      word2: '',
      data1: null,
      data2: null,
      loading1: false,
      loading2: false,
      error1: null,
      error2: null,
    };
    setComparisons(prev => [...prev, newComparison]);
  };

  const removeComparison = (id: string) => {
    if (comparisons.length > 1) {
      setComparisons(prev => prev.filter(comp => comp.id !== id));
    }
  };

  const handlePlayAudio = async (audioUrl: string) => {
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const suggestedPairs = [
    { word1: 'happy', word2: 'feliz' },
    { word1: 'love', word2: 'amor' },
    { word1: 'family', word2: 'família' },
    { word1: 'beautiful', word2: 'bonito' },
    { word1: 'friend', word2: 'amigo' },
    { word1: 'house', word2: 'casa' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-3">
            <ArrowLeftRight className="w-8 h-8 text-green-600" />
            <span>Word Comparison</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compare words side by side to understand differences in meaning, pronunciation, and usage. 
            Perfect for learning Portuguese translations and exploring word relationships.
          </p>
        </div>

        {/* Suggested Pairs */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Comparisons</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {suggestedPairs.map((pair, index) => (
              <button
                key={index}
                onClick={() => {
                  if (comparisons.length > 0) {
                    searchWord(comparisons[0].id, 'word1', pair.word1);
                    searchWord(comparisons[0].id, 'word2', pair.word2);
                  }
                }}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:bg-green-50 transition-colors text-sm"
              >
                <div className="font-medium text-gray-900">{pair.word1}</div>
                <div className="text-gray-500 text-xs">vs</div>
                <div className="font-medium text-green-700">{pair.word2}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Comparisons */}
        <div className="space-y-8">
          {comparisons.map((comparison, index) => (
            <div key={comparison.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Comparison Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Comparison {index + 1}</span>
                </h3>
                {comparisons.length > 1 && (
                  <button
                    onClick={() => removeComparison(comparison.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Boxes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Word
                  </label>
                  <SearchBox
                    onSearch={(query) => searchWord(comparison.id, 'word1', query)}
                    loading={comparison.loading1}
                    placeholder="Enter first word..."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Second Word
                  </label>
                  <SearchBox
                    onSearch={(query) => searchWord(comparison.id, 'word2', query)}
                    loading={comparison.loading2}
                    placeholder="Enter second word..."
                    className="w-full"
                  />
                </div>
              </div>

              {/* Comparison Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* First Word Results */}
                <div>
                  {comparison.loading1 && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center space-x-2 text-gray-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                        <span>Searching...</span>
                      </div>
                    </div>
                  )}

                  {comparison.error1 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{comparison.error1}</span>
                      </div>
                    </div>
                  )}

                  {comparison.data1 && (
                    <WordCard
                      wordData={comparison.data1}
                      onPlayAudio={handlePlayAudio}
                      compact={true}
                    />
                  )}

                  {!comparison.loading1 && !comparison.error1 && !comparison.data1 && comparison.word1 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for "{comparison.word1}"</p>
                    </div>
                  )}
                </div>

                {/* Second Word Results */}
                <div>
                  {comparison.loading2 && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center space-x-2 text-gray-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                        <span>Searching...</span>
                      </div>
                    </div>
                  )}

                  {comparison.error2 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{comparison.error2}</span>
                      </div>
                    </div>
                  )}

                  {comparison.data2 && (
                    <WordCard
                      wordData={comparison.data2}
                      onPlayAudio={handlePlayAudio}
                      compact={true}
                    />
                  )}

                  {!comparison.loading2 && !comparison.error2 && !comparison.data2 && comparison.word2 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for "{comparison.word2}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Insights */}
              {comparison.data1 && comparison.data2 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Comparison Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Phonetics:</span>
                      <div className="mt-1 space-y-1">
                        {comparison.data1.phonetics && comparison.data1.phonetics.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">{comparison.data1.word}:</span>
                            <span className="font-mono text-blue-600">
                              {comparison.data1.phonetics[0].text || 'N/A'}
                            </span>
                            {comparison.data1.phonetics[0].audio && (
                              <button
                                onClick={() => handlePlayAudio(comparison.data1!.phonetics![0].audio!)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                        {comparison.data2.phonetics && comparison.data2.phonetics.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">{comparison.data2.word}:</span>
                            <span className="font-mono text-blue-600">
                              {comparison.data2.phonetics[0].text || 'N/A'}
                            </span>
                            {comparison.data2.phonetics[0].audio && (
                              <button
                                onClick={() => handlePlayAudio(comparison.data2!.phonetics![0].audio!)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Parts of Speech:</span>
                      <div className="mt-1 space-y-1">
                        <div>
                          <span className="text-gray-600">{comparison.data1.word}:</span>
                          <span className="ml-2 text-purple-600">
                            {comparison.data1.meanings?.map(m => m.partOfSpeech).join(', ') || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">{comparison.data2.word}:</span>
                          <span className="ml-2 text-purple-600">
                            {comparison.data2.meanings?.map(m => m.partOfSpeech).join(', ') || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Comparison Button */}
        <div className="text-center mt-8">
          <button
            onClick={addComparison}
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Another Comparison</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Comparison Tips:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Compare English words with their Portuguese translations</li>
            <li>• Look for differences in pronunciation and usage</li>
            <li>• Use the audio buttons to practice pronunciation</li>
            <li>• Try comparing synonyms to understand subtle differences</li>
            <li>• Add multiple comparisons to study related words together</li>
          </ul>
        </div>
      </div>
    </div>
  );
}