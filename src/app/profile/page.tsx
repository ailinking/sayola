'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  BookOpen, 
  TrendingUp, 
  Volume2, 
  Globe, 
  Save,
  RotateCcw,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';

interface UserStats {
  wordsSearched: number;
  comparisonsCreated: number;
  audioPlayed: number;
  daysActive: number;
  favoriteWords: string[];
  searchHistory: string[];
}

interface UserSettings {
  language: 'en' | 'pt';
  autoPlayAudio: boolean;
  saveSearchHistory: boolean;
  dailyGoal: number;
  theme: 'light' | 'dark';
  notifications: boolean;
}

export default function ProfilePage() {
  const [userStats, setUserStats] = useState<UserStats>({
    wordsSearched: 0,
    comparisonsCreated: 0,
    audioPlayed: 0,
    daysActive: 0,
    favoriteWords: [],
    searchHistory: [],
  });

  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    autoPlayAudio: false,
    saveSearchHistory: true,
    dailyGoal: 10,
    theme: 'light',
    notifications: true,
  });

  const [userName, setUserName] = useState('Portuguese Learner');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      // Load stats from localStorage
      const savedStats = localStorage.getItem('userStats');
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }

      // Load settings from localStorage
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Load user name
      const savedName = localStorage.getItem('userName');
      if (savedName) {
        setUserName(savedName);
        setTempName(savedName);
      }

      // Load search history for stats
      const searchHistory = localStorage.getItem('searchHistory');
      if (searchHistory) {
        const history = JSON.parse(searchHistory);
        setUserStats(prev => ({
          ...prev,
          searchHistory: history,
          wordsSearched: history.length,
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      localStorage.setItem('userName', userName);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  const resetStats = () => {
    if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      const resetStats: UserStats = {
        wordsSearched: 0,
        comparisonsCreated: 0,
        audioPlayed: 0,
        daysActive: 0,
        favoriteWords: [],
        searchHistory: [],
      };
      setUserStats(resetStats);
      localStorage.setItem('userStats', JSON.stringify(resetStats));
      localStorage.removeItem('searchHistory');
    }
  };

  const handleNameEdit = () => {
    if (isEditing) {
      setUserName(tempName);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const achievements = [
    {
      id: 'first_search',
      title: 'First Steps',
      description: 'Searched your first word',
      icon: BookOpen,
      unlocked: userStats.wordsSearched > 0,
    },
    {
      id: 'explorer',
      title: 'Word Explorer',
      description: 'Searched 50 words',
      icon: Globe,
      unlocked: userStats.wordsSearched >= 50,
    },
    {
      id: 'comparator',
      title: 'Comparator',
      description: 'Created your first comparison',
      icon: BarChart3,
      unlocked: userStats.comparisonsCreated > 0,
    },
    {
      id: 'audio_lover',
      title: 'Audio Enthusiast',
      description: 'Played audio 25 times',
      icon: Volume2,
      unlocked: userStats.audioPlayed >= 25,
    },
    {
      id: 'consistent',
      title: 'Consistent Learner',
      description: 'Active for 7 days',
      icon: Calendar,
      unlocked: userStats.daysActive >= 7,
    },
    {
      id: 'dedicated',
      title: 'Dedicated Student',
      description: 'Searched 100 words',
      icon: Award,
      unlocked: userStats.wordsSearched >= 100,
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressToNext = Math.min((userStats.wordsSearched / settings.dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Track your progress and customize your learning experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                
                {isEditing ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-xl font-semibold text-gray-900 text-center border-b-2 border-green-500 bg-transparent focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleNameEdit()}
                    />
                  </div>
                ) : (
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{userName}</h2>
                )}
                
                <button
                  onClick={handleNameEdit}
                  className="text-sm text-green-600 hover:text-green-700 mb-4"
                >
                  {isEditing ? 'Save Name' : 'Edit Name'}
                </button>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Learning streak:</span>
                    <span className="font-medium">{userStats.daysActive} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily goal:</span>
                    <span className="font-medium">{settings.dailyGoal} words</span>
                  </div>
                </div>

                {/* Daily Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Today's Progress</span>
                    <span className="font-medium">{Math.round(progressToNext)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressToNext}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Quick Stats</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.wordsSearched}</div>
                  <div className="text-xs text-gray-600">Words Searched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.comparisonsCreated}</div>
                  <div className="text-xs text-gray-600">Comparisons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.audioPlayed}</div>
                  <div className="text-xs text-gray-600">Audio Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{userStats.daysActive}</div>
                  <div className="text-xs text-gray-600">Days Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievements ({unlockedAchievements.length}/{achievements.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.unlocked
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            achievement.unlocked ? 'text-green-900' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.unlocked ? 'text-green-700' : 'text-gray-400'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </h3>
              
              <div className="space-y-6">
                {/* Language Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interface Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as 'en' | 'pt' }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                {/* Daily Goal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Word Goal
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.dailyGoal}
                    onChange={(e) => setSettings(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 10 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Toggle Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Auto-play Audio</label>
                      <p className="text-xs text-gray-500">Automatically play pronunciation when available</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, autoPlayAudio: !prev.autoPlayAudio }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.autoPlayAudio ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.autoPlayAudio ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Save Search History</label>
                      <p className="text-xs text-gray-500">Keep track of your searched words</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, saveSearchHistory: !prev.saveSearchHistory }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.saveSearchHistory ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.saveSearchHistory ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Notifications</label>
                      <p className="text-xs text-gray-500">Receive learning reminders and tips</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={saveSettings}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                  
                  <button
                    onClick={resetStats}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Stats</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}