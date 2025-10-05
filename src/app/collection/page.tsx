'use client';

import { useState, useEffect } from 'react';
import { Heart, BookOpen, Clock, TrendingUp, Play, BarChart3, Download, Upload, Trash2 } from 'lucide-react';
import { SRSEngine, SRSCard, SRSStorage, ReviewResult } from '@/lib/srsEngine';
import { DictionaryService } from '@/lib/dictionaryApi';
import WordCard from '@/components/WordCard';

export default function CollectionPage() {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [currentReviewCard, setCurrentReviewCard] = useState<SRSCard | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewStartTime, setReviewStartTime] = useState<number>(0);
  const [stats, setStats] = useState({
    total: 0,
    due: 0,
    new: 0,
    learning: 0,
    mature: 0,
    averageDifficulty: 0,
    totalReviews: 0
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'review' | 'manage'>('overview');
  const [wordData, setWordData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allCards = SRSStorage.loadCards();
    const due = SRSEngine.getDueCards(allCards);
    const statistics = SRSEngine.getStudyStats(allCards);
    
    setCards(allCards);
    setDueCards(due);
    setStats(statistics);
  };

  const startReview = async () => {
    if (dueCards.length === 0) return;
    
    const nextCard = dueCards[0];
    setCurrentReviewCard(nextCard);
    setReviewMode(true);
    setReviewStartTime(Date.now());
    
    // Load word data for the card
    setLoading(true);
    try {
      const result = await DictionaryService.searchWord(nextCard.word);
      if (result.success && result.data) {
        setWordData(result.data[0]);
      }
    } catch (error) {
      console.error('Error loading word data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = (quality: number) => {
    if (!currentReviewCard) return;
    
    const timeSpent = Date.now() - reviewStartTime;
    const reviewResult: ReviewResult = {
      quality,
      timeSpent
    };
    
    const updatedCard = SRSEngine.updateCard(currentReviewCard, reviewResult);
    SRSStorage.updateCard(updatedCard);
    
    // Move to next card or end review
    const remainingCards = dueCards.slice(1);
    if (remainingCards.length > 0) {
      setDueCards(remainingCards);
      startReview();
    } else {
      setReviewMode(false);
      setCurrentReviewCard(null);
      setWordData(null);
      loadData(); // Refresh data
    }
  };

  const removeCard = (word: string) => {
    SRSStorage.removeCard(word);
    loadData();
  };

  const exportData = () => {
    const data = SRSEngine.exportCards(cards);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portuguese-collection-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const importedCards = SRSEngine.importCards(data);
        SRSStorage.saveCards(importedCards);
        loadData();
        alert(`Successfully imported ${importedCards.length} words!`);
      } catch (error) {
        alert('Import failed: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return 'bg-green-100 text-green-800';
    if (difficulty <= 2) return 'bg-yellow-100 text-yellow-800';
    if (difficulty <= 3) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 1) return 'Easy';
    if (difficulty <= 2) return 'Normal';
    if (difficulty <= 3) return 'Hard';
    return 'Very Hard';
  };

  if (reviewMode && currentReviewCard) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Review Mode
            </h1>
            <p className="text-gray-600">
              {dueCards.length} words remaining to review
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span>Loading...</span>
              </div>
            </div>
          ) : wordData ? (
            <div className="space-y-6">
              <WordCard wordData={wordData} />
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">How well do you know this word?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => submitReview(0)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 p-3 rounded-lg text-sm font-medium"
                  >
                    Don't remember (0)
                  </button>
                  <button
                    onClick={() => submitReview(1)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium"
                  >
                    Barely remember (1)
                  </button>
                  <button
                    onClick={() => submitReview(2)}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-3 rounded-lg text-sm font-medium"
                  >
                    Some recall (2)
                  </button>
                  <button
                    onClick={() => submitReview(3)}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-3 rounded-lg text-sm font-medium"
                  >
                    Good recall (3)
                  </button>
                  <button
                    onClick={() => submitReview(4)}
                    className="bg-green-100 hover:bg-green-200 text-green-800 p-3 rounded-lg text-sm font-medium"
                  >
                    Clear memory (4)
                  </button>
                  <button
                    onClick={() => submitReview(5)}
                    className="bg-green-200 hover:bg-green-300 text-green-900 p-3 rounded-lg text-sm font-medium"
                  >
                    Perfect recall (5)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load word data</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Word Collection
          </h1>
          <p className="text-gray-600">
            Smart review of your collected Portuguese words using spaced repetition system
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('review')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'review'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Review
          </button>
          <button
            onClick={() => setSelectedTab('manage')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'manage'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-600">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">Due</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.due}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Learning</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.learning}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Mastered</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.mature}</p>
              </div>
            </div>

            {/* Start Review Button */}
            {stats.due > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Start Today's Review</h3>
                    <p className="text-green-100">
                      You have {stats.due} words to review. Recommended session: {SRSEngine.getOptimalSessionSize(cards)} words
                    </p>
                  </div>
                  <button
                    onClick={startReview}
                    className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Review</span>
                  </button>
                </div>
              </div>
            )}

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Learning Progress</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Average Difficulty</span>
                    <span>{stats.averageDifficulty.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                      style={{ width: `${(stats.averageDifficulty / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                    <p className="text-sm text-gray-600">New</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{stats.learning}</p>
                    <p className="text-sm text-gray-600">Learning</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.mature}</p>
                    <p className="text-sm text-gray-600">Mastered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Tab */}
        {selectedTab === 'review' && (
          <div className="space-y-6">
            {dueCards.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Words Due for Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dueCards.slice(0, 12).map((card) => (
                    <div key={card.word} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{card.word}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                          {getDifficultyLabel(card.difficulty)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Reviews: {card.reviewCount}</p>
                        <p>Streak: {card.streak}</p>
                        <p>Interval: {card.interval} days</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={startReview}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Review</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Words Due for Review</h3>
                <p className="text-gray-600">All words have been reviewed for today, come back tomorrow!</p>
              </div>
            )}
          </div>
        )}

        {/* Manage Tab */}
        {selectedTab === 'manage' && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Data Management</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={exportData}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
                
                <label className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Import Data</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all collected words? This action cannot be undone.')) {
                      SRSStorage.clearAll();
                      setCards([]);
                    }
                  }}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Collection</span>
                </button>
              </div>
            </div>

            {/* All Cards */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">All Collected Words</h3>
              {cards.length > 0 ? (
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div key={card.word} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{card.word}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                            {getDifficultyLabel(card.difficulty)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Reviewed {card.reviewCount} times • Interval {card.interval} days • Streak {card.streak} times
                        </div>
                      </div>
                      <button
                        onClick={() => removeCard(card.word)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove word"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No words collected yet, go to the search page to collect some words!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}