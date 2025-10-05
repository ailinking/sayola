'use client';

import { useState } from 'react';
import { Search, BookOpen, Brain, Network } from 'lucide-react';
import DependencyVisualization from '@/components/DependencyVisualization';
import GrammarNetworkVisualization from '@/components/GrammarNetwork';
import { CEFRFilterCompact } from '@/components/CEFRFilter';
import { CEFRBadge, CEFRLegend } from '@/components/CEFRBadge';
import { CEFRLevel } from '@/lib/cefrService';
import { ApiConfig } from '@/components/ApiConfig';

export default function DemoPage() {
  const [sentence, setSentence] = useState('O menino inteligente leu um livro interessante na biblioteca.');
  const [selectedLevels, setSelectedLevels] = useState<CEFRLevel[]>([]);
  const [networkWord, setNetworkWord] = useState('casa');
  
  const exampleSentences = [
    'O menino inteligente leu um livro interessante na biblioteca.',
    'Maria trabalha como professora na escola primária.',
    'Os estudantes brasileiros aprendem português e matemática.',
    'A complexa estrutura gramatical da língua portuguesa fascina os linguistas.',
    'Embora seja difícil, a análise sintática ajuda na compreensão textual.',
    'O paradigma epistemológico contemporâneo influencia a hermenêutica filosófica.'
  ];
  
  const demoWords = [
    'casa', 'trabalho', 'experiência', 'consequência', 'epistemologia', 'heurística'
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sayola Advanced Features Demo</h1>
              <p className="text-gray-600 mt-1">
                Explore CEFR proficiency levels, dependency visualization, and grammar networks
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* CEFR Demo Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">CEFR Proficiency Levels</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Words are automatically classified according to the Common European Framework of Reference (CEFR) levels A1-C2.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Example Words by Level:</h3>
                  <div className="flex flex-wrap gap-3">
                    {demoWords.map((word, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-gray-900 font-medium">{word}</span>
                        <CEFRBadge word={word} size="sm" showTooltip={true} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Level:</h3>
                  <CEFRFilterCompact
                    selectedLevels={selectedLevels}
                    onLevelsChange={setSelectedLevels}
                  />
                </div>
              </div>
            </section>
            
            {/* Dependency Visualization Demo */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Network className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Dependency Visualization</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Analyze Portuguese sentence structure with interactive dependency trees showing grammatical relationships.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter a Portuguese sentence:
                  </label>
                  <textarea
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Type a Portuguese sentence to analyze..."
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {exampleSentences.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setSentence(example)}
                        className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Dependency Visualization */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <DependencyVisualization
                sentence={sentence}
                showCEFR={true}
                showPOS={true}
                interactive={true}
              />
            </section>
            
            {/* Grammar Network Demo */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Network className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Rede Gramatical (Grammar Network)</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Explore grammatical relationships and word connections in an interactive network visualization.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter a Portuguese word:
                  </label>
                  <input
                    type="text"
                    value={networkWord}
                    onChange={(e) => setNetworkWord(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Type a Portuguese word..."
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h3>
                  <div className="flex flex-wrap gap-2">
                    {demoWords.map((word, index) => (
                      <button
                        key={index}
                        onClick={() => setNetworkWord(word)}
                        className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded border border-green-200 hover:border-green-300 transition-colors"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Grammar Network Visualization */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <GrammarNetworkVisualization
                word={networkWord}
                depth={2}
                width={800}
                height={600}
                interactive={true}
                showControls={true}
                showLegend={true}
              />
            </section>
          </div>
          
          {/* API Configuration Demo */}
          <section className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Configuration</h2>
            <p className="text-gray-600 mb-6">
              Configure and test external Portuguese NLP API providers for enhanced dependency parsing.
            </p>
            
            <ApiConfig 
              onConfigChange={(config) => console.log('API Config updated:', config)}
              className="mb-4"
            />
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Available Features:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Multiple API provider support (spaCy, Stanza, nlpnet)</li>
                <li>• Automatic fallback to local parsing</li>
                <li>• Connection testing and latency monitoring</li>
                <li>• Configurable timeout and retry settings</li>
                <li>• Secure API key management</li>
              </ul>
            </div>
          </section>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* CEFR Legend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <CEFRLegend />
            </div>
            
            {/* Features Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">CEFR Classification</h4>
                    <p className="text-sm text-gray-600">
                      Automatic proficiency level assessment for Portuguese words
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Dependency Parsing</h4>
                    <p className="text-sm text-gray-600">
                      Visual analysis of sentence structure and grammatical relationships
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Interactive Learning</h4>
                    <p className="text-sm text-gray-600">
                      Click on words and dependencies to explore detailed information
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Grammar Network</h4>
                    <p className="text-sm text-gray-600">
                      Rede Gramatical for comprehensive grammar visualization and word relationships
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">API Integration</h4>
                    <p className="text-sm text-gray-600">
                      Enhanced Portuguese NLP processing with external API providers
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-2">
                <a
                  href="/search"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Dictionary Search</span>
                </a>
                
                <a
                  href="/collection"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Word Collection</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}