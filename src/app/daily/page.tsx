'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, BookOpen, Globe, Lightbulb, Trophy, Volume2, Clock } from 'lucide-react';
import { dailyContentService, DailyContent } from '@/lib/dailyContent';
import { ttsService } from '@/lib/ttsService';

export default function DailyPage() {
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weeklyContent, setWeeklyContent] = useState<DailyContent[]>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);
  const [showChallengeResult, setShowChallengeResult] = useState(false);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);

  const loadDailyContent = useCallback(() => {
    const content = dailyContentService.getDailyContent(selectedDate);
    setDailyContent(content);
  }, [selectedDate]);

  useEffect(() => {
    loadDailyContent();
    loadWeeklyContent();
  }, [selectedDate, loadDailyContent]);

  const loadWeeklyContent = () => {
    const content = dailyContentService.getWeeklyContent();
    setWeeklyContent(content);
  };

  const handlePlayAudio = async (text: string, type: string) => {
    setAudioLoading(type);
    try {
      if (ttsService.isConfigured()) {
        const audioResult = await ttsService.generateAudio(text);
        if (audioResult.audioUrl) {
          const audio = new Audio(audioResult.audioUrl);
          await audio.play();
        }
      } else {
        await ttsService.generateFallbackAudio(text);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setAudioLoading(null);
    }
  };

  const handleChallengeSubmit = () => {
    setShowChallengeResult(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!dailyContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading daily content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Portuguese</h1>
          <p className="text-xl text-gray-600">Your daily dose of Portuguese learning</p>
          <div className="flex items-center justify-center mt-4 text-gray-500">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{formatDate(dailyContent.date)}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Word of the Day */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-green-600" />
                Word of the Day
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                dailyContent.wordOfTheDay.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                dailyContent.wordOfTheDay.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {dailyContent.wordOfTheDay.difficulty}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-green-700">{dailyContent.wordOfTheDay.word}</h3>
                  <p className="text-gray-600">/{dailyContent.wordOfTheDay.pronunciation}/</p>
                  <p className="text-lg text-gray-800 mt-1">{dailyContent.wordOfTheDay.translation}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(dailyContent.wordOfTheDay.word, 'word')}
                  disabled={audioLoading === 'word'}
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-full transition-colors disabled:opacity-50"
                >
                  <Volume2 className={`w-6 h-6 ${audioLoading === 'word' ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-gray-700 mb-2">{dailyContent.wordOfTheDay.definition}</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium text-gray-900">{dailyContent.wordOfTheDay.example}</p>
                  <p className="text-gray-600 text-sm mt-1">{dailyContent.wordOfTheDay.exampleTranslation}</p>
                </div>
                {dailyContent.wordOfTheDay.etymology && (
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Etymology:</strong> {dailyContent.wordOfTheDay.etymology}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phrase of the Day */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-blue-600" />
                Phrase of the Day
              </h2>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  dailyContent.phraseOfTheDay.formality === 'formal' ? 'bg-purple-100 text-purple-800' :
                  dailyContent.phraseOfTheDay.formality === 'informal' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {dailyContent.phraseOfTheDay.formality}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {dailyContent.phraseOfTheDay.region}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">{dailyContent.phraseOfTheDay.phrase}</h3>
                  <p className="text-gray-600">/{dailyContent.phraseOfTheDay.pronunciation}/</p>
                  <p className="text-lg text-gray-800 mt-1">{dailyContent.phraseOfTheDay.translation}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(dailyContent.phraseOfTheDay.phrase, 'phrase')}
                  disabled={audioLoading === 'phrase'}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition-colors disabled:opacity-50"
                >
                  <Volume2 className={`w-6 h-6 ${audioLoading === 'phrase' ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-gray-700 mb-2">{dailyContent.phraseOfTheDay.context}</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium text-gray-900">{dailyContent.phraseOfTheDay.usage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Tip and Learning Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cultural Tip */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
              <Globe className="w-6 h-6 mr-2 text-purple-600" />
              Cultural Insight
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-purple-700">{dailyContent.culturalTip.title}</h3>
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {dailyContent.culturalTip.region}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{dailyContent.culturalTip.content}</p>
            </div>
          </div>

          {/* Learning Tip */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
              <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
              Learning Tip
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-yellow-700">{dailyContent.learningTip.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  dailyContent.learningTip.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  dailyContent.learningTip.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {dailyContent.learningTip.difficulty}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{dailyContent.learningTip.content}</p>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyContent.challenge && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
              <Trophy className="w-6 h-6 mr-2 text-orange-600" />
              Daily Challenge
            </h2>
            
            {!showChallenge ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Test your Portuguese knowledge with today's challenge!</p>
                <button
                  onClick={() => setShowChallenge(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Challenge
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">{dailyContent.challenge.question}</h3>
                <div className="space-y-2">
                  {dailyContent.challenge.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setChallengeAnswer(index)}
                      disabled={showChallengeResult}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        challengeAnswer === index
                          ? showChallengeResult
                            ? index === dailyContent.challenge!.correctAnswer
                              ? 'bg-green-100 border-green-500 text-green-800'
                              : 'bg-red-100 border-red-500 text-red-800'
                            : 'bg-blue-100 border-blue-500 text-blue-800'
                          : showChallengeResult && index === dailyContent.challenge!.correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {!showChallengeResult && challengeAnswer !== null && (
                  <button
                    onClick={handleChallengeSubmit}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Submit Answer
                  </button>
                )}
                
                {showChallengeResult && (
                  <div className={`p-4 rounded-lg ${
                    challengeAnswer === dailyContent.challenge.correctAnswer
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="font-medium mb-2">
                      {challengeAnswer === dailyContent.challenge.correctAnswer ? 'Correct!' : 'Incorrect!'}
                    </p>
                    <p>{dailyContent.challenge.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Weekly Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
            <Clock className="w-6 h-6 mr-2 text-gray-600" />
            This Week's Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {weeklyContent.map((content) => (
              <div
                key={content.date}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  content.date === dailyContent.date
                    ? 'bg-green-100 border-green-500'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedDate(new Date(content.date))}
              >
                <div className="text-sm text-gray-600 mb-2">
                  {new Date(content.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="font-medium text-gray-900 mb-1">{content.wordOfTheDay.word}</div>
                <div className="text-sm text-gray-600">{content.wordOfTheDay.translation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}