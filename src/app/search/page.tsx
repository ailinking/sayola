'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, BookOpen, Lightbulb } from 'lucide-react';
import SearchBox from '@/components/SearchBox';
import WordCard from '@/components/WordCard';
import { DictionaryService, WordData } from '@/lib/dictionaryApi';

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Get initial query from URL params
  const initialQuery = searchParams.get('q') || '';

  const addToSearchHistory = useCallback((query: string) => {
    const normalizedQuery = DictionaryService.normalizeWord(query);
    const newHistory = [normalizedQuery, ...searchHistory.filter(item => item !== normalizedQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  }, [searchHistory]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const result = await DictionaryService.searchWord(query);
      
      if (result.success && result.data) {
        setSearchResults(result.data);
        addToSearchHistory(query);
      } else {
        setError(result.error || 'No results found');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [addToSearchHistory]);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    loadSearchHistory();
  }, [initialQuery, handleSearch]);

  const loadSearchHistory = () => {
    try {
      const saved = localStorage.getItem('searchHistory');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
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

  const commonSearches = [
    'hello', 'goodbye', 'thank you', 'please', 'family', 'love', 'happy', 'beautiful',
    'obrigado', 'saudade', 'família', 'felicidade'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portuguese Dictionary
          </h1>
          <p className="text-gray-600">
            Search for words and discover their meanings, pronunciations, and usage examples
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <SearchBox
            onSearch={handleSearch}
            loading={loading}
            placeholder="Enter a word to search... (e.g., 'obrigado', 'saudade', 'família')"
            className="w-full"
          />
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span>Searching...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Search Error</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Search Results</span>
            </h2>
            {searchResults.map((wordData, index) => (
              <WordCard
                key={index}
                wordData={wordData}
                onPlayAudio={handlePlayAudio}
              />
            ))}
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && !loading && searchResults.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span>Recent Searches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Common Searches */}
        {!loading && searchResults.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Searches
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {commonSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Search Tips:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Try searching for both English and Portuguese words</li>
            <li>• Use the audio button to hear correct pronunciation</li>
            <li>• Check different meanings and examples for better understanding</li>
            <li>• Your search history is saved locally for quick access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}