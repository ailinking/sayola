'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Volume2, TrendingUp, Star, ArrowRight } from 'lucide-react';
import SearchBox from '@/components/SearchBox';

export default function Home() {
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    // Redirect to search page with query
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const featuredWords = [
    { word: 'obrigado', translation: 'thank you', category: 'common' },
    { word: 'saudade', translation: 'longing/nostalgia', category: 'cultural' },
    { word: 'família', translation: 'family', category: 'common' },
    { word: 'felicidade', translation: 'happiness', category: 'emotion' },
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8 text-green-600" />,
      title: 'Smart Dictionary',
      description: 'Look up Portuguese words with detailed definitions, examples, and pronunciation guides.'
    },
    {
      icon: <Volume2 className="w-8 h-8 text-blue-600" />,
      title: 'Audio Pronunciation',
      description: 'Listen to native pronunciation with Google Cloud Text-to-Speech technology.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Daily Learning',
      description: 'Discover new words and phrases with our curated daily content system.'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-orange-600" />,
      title: 'Word Comparison',
      description: 'Compare similar words to understand subtle differences in meaning and usage.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Master <span className="text-green-600">Portuguese</span>
            <br />
            with AI-Powered Learning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the beauty of Portuguese language with our intelligent dictionary, 
            pronunciation guides, and personalized learning experience.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBox 
              onSearch={handleSearch}
              loading={searchLoading}
              placeholder="Search for Portuguese words... (e.g., 'obrigado', 'saudade')"
              className="w-full"
            />
          </div>

          {/* Quick Start */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {featuredWords.map((item, index) => (
              <Link
                key={index}
                href={`/search?q=${encodeURIComponent(item.word)}`}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 transition-colors group"
              >
                <span className="font-medium text-gray-900 group-hover:text-green-600">
                  {item.word}
                </span>
                <span className="text-gray-500 ml-2">({item.translation})</span>
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/daily"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>Daily Content</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Learn Portuguese
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines modern technology with proven language learning methods 
              to help you achieve fluency faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">260M+</div>
              <div className="text-green-100">Portuguese Speakers Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">9</div>
              <div className="text-green-100">Countries with Portuguese as Official Language</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Free</div>
              <div className="text-green-100">Always Free to Use</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
