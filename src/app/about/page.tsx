'use client';

import { BookOpen, Brain, Heart, Search, Calendar, Network, Database, Code, User } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Sayola</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive platform for mastering European Portuguese through innovative technology and proven learning methodologies.
          </p>
        </div>

        {/* Our Learning Methodology */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Brain className="w-8 h-8 text-green-600" />
              <span>Our Learning Methodology</span>
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Why Sayola Can Help You Learn European Portuguese
            </p>
            
            {/* Learning Methodology Roadmap SVG */}
            <div className="mb-8">
              <svg viewBox="0 0 800 300" className="w-full h-auto max-w-4xl mx-auto">
                <defs>
                  <linearGradient id="methodologyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                
                {/* Background */}
                <rect width="800" height="300" fill="#f9fafb" rx="10" />
                
                {/* Connection Lines */}
                <path d="M 120 150 Q 200 100 280 150" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                <path d="M 320 150 Q 400 100 480 150" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                <path d="M 520 150 Q 600 100 680 150" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                
                {/* Step 1: Input */}
                <circle cx="80" cy="150" r="40" fill="url(#methodologyGradient)" />
                <text x="80" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">INPUT</text>
                <text x="80" y="210" textAnchor="middle" fill="#374151" fontSize="12">Authentic Content</text>
                <text x="80" y="225" textAnchor="middle" fill="#374151" fontSize="12">Real Examples</text>
                
                {/* Step 2: Process */}
                <circle cx="280" cy="150" r="40" fill="url(#methodologyGradient)" />
                <text x="280" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">PROCESS</text>
                <text x="280" y="210" textAnchor="middle" fill="#374151" fontSize="12">AI Analysis</text>
                <text x="280" y="225" textAnchor="middle" fill="#374151" fontSize="12">Pattern Recognition</text>
                
                {/* Step 3: Practice */}
                <circle cx="480" cy="150" r="40" fill="url(#methodologyGradient)" />
                <text x="480" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">PRACTICE</text>
                <text x="480" y="210" textAnchor="middle" fill="#374151" fontSize="12">Spaced Repetition</text>
                <text x="480" y="225" textAnchor="middle" fill="#374151" fontSize="12">Active Recall</text>
                
                {/* Step 4: Master */}
                <circle cx="680" cy="150" r="40" fill="url(#methodologyGradient)" />
                <text x="680" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">MASTER</text>
                <text x="680" y="210" textAnchor="middle" fill="#374151" fontSize="12">Fluent Usage</text>
                <text x="680" y="225" textAnchor="middle" fill="#374151" fontSize="12">Natural Expression</text>
                
                {/* Title */}
                <text x="400" y="40" textAnchor="middle" fill="#1f2937" fontSize="18" fontWeight="bold">Learning Methodology Roadmap</text>
              </svg>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Evidence-Based Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Spaced Repetition System (SRS) for optimal retention</li>
                  <li>• CEFR-aligned proficiency assessment</li>
                  <li>• Contextual learning through real examples</li>
                  <li>• Multi-modal input (visual, auditory, kinesthetic)</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Personalized Learning</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Adaptive difficulty based on performance</li>
                  <li>• Individual progress tracking</li>
                  <li>• Customizable learning goals</li>
                  <li>• AI-powered content recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Website Features */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span>Website Features</span>
            </h2>
            
            {/* Features Roadmap SVG */}
            <div className="mb-8">
              <svg viewBox="0 0 900 400" className="w-full h-auto max-w-5xl mx-auto">
                <defs>
                  <linearGradient id="featuresGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                
                {/* Background */}
                <rect width="900" height="400" fill="#f8fafc" rx="10" />
                
                {/* Central Hub */}
                <circle cx="450" cy="200" r="60" fill="url(#featuresGradient)" />
                <text x="450" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SAYOLA</text>
                <text x="450" y="210" textAnchor="middle" fill="white" fontSize="12">Platform</text>
                
                {/* Feature Nodes */}
                <g>
                  {/* Dictionary */}
                  <circle cx="200" cy="100" r="45" fill="#10b981" />
                  <text x="200" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Dictionary</text>
                  <line x1="390" y1="200" x2="245" y2="100" stroke="#e5e7eb" strokeWidth="2" />
                  
                  {/* Grammar Network */}
                  <circle cx="700" cy="100" r="45" fill="#f59e0b" />
                  <text x="700" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Grammar</text>
                  <line x1="510" y1="200" x2="655" y2="100" stroke="#e5e7eb" strokeWidth="2" />
                  
                  {/* CEFR Assessment */}
                  <circle cx="150" cy="300" r="45" fill="#8b5cf6" />
                  <text x="150" y="305" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CEFR</text>
                  <line x1="390" y1="200" x2="195" y2="300" stroke="#e5e7eb" strokeWidth="2" />
                  
                  {/* API Integration */}
                  <circle cx="750" cy="300" r="45" fill="#ef4444" />
                  <text x="750" y="305" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">API</text>
                  <line x1="510" y1="200" x2="705" y2="300" stroke="#e5e7eb" strokeWidth="2" />
                  
                  {/* Daily Content */}
                  <circle cx="450" cy="50" r="45" fill="#06b6d4" />
                  <text x="450" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Daily</text>
                  <line x1="450" y1="140" x2="450" y2="95" stroke="#e5e7eb" strokeWidth="2" />
                  
                  {/* Collection */}
                  <circle cx="450" cy="350" r="45" fill="#ec4899" />
                  <text x="450" y="355" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Collection</text>
                  <line x1="450" y1="260" x2="450" y2="305" stroke="#e5e7eb" strokeWidth="2" />
                </g>
                
                {/* Title */}
                <text x="450" y="25" textAnchor="middle" fill="#1f2937" fontSize="18" fontWeight="bold">Integrated Learning Ecosystem</text>
              </svg>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Smart Dictionary</h3>
                </div>
                <p className="text-gray-700">AI-powered word lookup with pronunciation, etymology, and contextual examples.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Grammar Network</h3>
                </div>
                <p className="text-gray-700">Interactive visualization of grammatical relationships and dependency parsing.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">CEFR Assessment</h3>
                </div>
                <p className="text-gray-700">Automatic proficiency level assessment based on European standards.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Daily Content</h3>
                </div>
                <p className="text-gray-700">Curated daily lessons, vocabulary, and cultural insights.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Collection</h3>
                </div>
                <p className="text-gray-700">Spaced repetition system for vocabulary retention and review.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">API Integration</h3>
                </div>
                <p className="text-gray-700">External NLP services for enhanced linguistic analysis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Data Sources */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Database className="w-8 h-8 text-indigo-600" />
              <span>Our Data Sources</span>
            </h2>
            
            {/* Data Sources Roadmap SVG */}
            <div className="mb-8">
              <svg viewBox="0 0 800 350" className="w-full h-auto max-w-4xl mx-auto">
                <defs>
                  <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                </defs>
                
                {/* Background */}
                <rect width="800" height="350" fill="#fafafa" rx="10" />
                
                {/* Data Flow */}
                <path d="M 100 175 L 200 175 L 300 175 L 400 175 L 500 175 L 600 175 L 700 175" 
                      stroke="url(#dataGradient)" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)" />
                
                {/* Arrow marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#4338ca" />
                  </marker>
                </defs>
                
                {/* Data Source Boxes */}
                <g>
                  {/* Raw Data */}
                  <rect x="50" y="125" width="100" height="100" fill="#e0e7ff" rx="8" />
                  <text x="100" y="145" textAnchor="middle" fill="#4338ca" fontSize="12" fontWeight="bold">Raw Data</text>
                  <text x="100" y="165" textAnchor="middle" fill="#374151" fontSize="10">Dictionaries</text>
                  <text x="100" y="180" textAnchor="middle" fill="#374151" fontSize="10">Corpora</text>
                  <text x="100" y="195" textAnchor="middle" fill="#374151" fontSize="10">Grammar Rules</text>
                  <text x="100" y="210" textAnchor="middle" fill="#374151" fontSize="10">Audio Files</text>
                  
                  {/* Processing */}
                  <rect x="200" y="125" width="100" height="100" fill="#ddd6fe" rx="8" />
                  <text x="250" y="145" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="bold">Processing</text>
                  <text x="250" y="165" textAnchor="middle" fill="#374151" fontSize="10">NLP Analysis</text>
                  <text x="250" y="180" textAnchor="middle" fill="#374151" fontSize="10">Data Cleaning</text>
                  <text x="250" y="195" textAnchor="middle" fill="#374151" fontSize="10">Validation</text>
                  <text x="250" y="210" textAnchor="middle" fill="#374151" fontSize="10">Enrichment</text>
                  
                  {/* API Layer */}
                  <rect x="350" y="125" width="100" height="100" fill="#fecaca" rx="8" />
                  <text x="400" y="145" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">API Layer</text>
                  <text x="400" y="165" textAnchor="middle" fill="#374151" fontSize="10">REST APIs</text>
                  <text x="400" y="180" textAnchor="middle" fill="#374151" fontSize="10">Rate Limiting</text>
                  <text x="400" y="195" textAnchor="middle" fill="#374151" fontSize="10">Caching</text>
                  <text x="400" y="210" textAnchor="middle" fill="#374151" fontSize="10">Authentication</text>
                  
                  {/* Application */}
                  <rect x="500" y="125" width="100" height="100" fill="#bbf7d0" rx="8" />
                  <text x="550" y="145" textAnchor="middle" fill="#059669" fontSize="12" fontWeight="bold">Application</text>
                  <text x="550" y="165" textAnchor="middle" fill="#374151" fontSize="10">React Frontend</text>
                  <text x="550" y="180" textAnchor="middle" fill="#374151" fontSize="10">State Management</text>
                  <text x="550" y="195" textAnchor="middle" fill="#374151" fontSize="10">User Interface</text>
                  <text x="550" y="210" textAnchor="middle" fill="#374151" fontSize="10">Interactions</text>
                  
                  {/* User Experience */}
                  <rect x="650" y="125" width="100" height="100" fill="#fed7aa" rx="8" />
                  <text x="700" y="145" textAnchor="middle" fill="#ea580c" fontSize="12" fontWeight="bold">User Experience</text>
                  <text x="700" y="165" textAnchor="middle" fill="#374151" fontSize="10">Learning</text>
                  <text x="700" y="180" textAnchor="middle" fill="#374151" fontSize="10">Practice</text>
                  <text x="700" y="195" textAnchor="middle" fill="#374151" fontSize="10">Progress</text>
                  <text x="700" y="210" textAnchor="middle" fill="#374151" fontSize="10">Mastery</text>
                </g>
                
                {/* Title */}
                <text x="400" y="30" textAnchor="middle" fill="#1f2937" fontSize="18" fontWeight="bold">Data Processing Pipeline</text>
              </svg>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Data Sources</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Linguistic Databases</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Portuguese language corpora</li>
                      <li>• Academic dictionaries and lexicons</li>
                      <li>• Phonetic transcription databases</li>
                      <li>• Etymology and word origin data</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">External APIs</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• spaCy NLP processing</li>
                      <li>• Stanza linguistic analysis</li>
                      <li>• Text-to-Speech services</li>
                      <li>• Translation APIs</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Implementation Approach</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Data Validation</h4>
                    <p className="text-sm text-gray-700">Multi-source verification and quality assurance processes.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Real-time Processing</h4>
                    <p className="text-sm text-gray-700">Dynamic content generation and adaptive learning algorithms.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Continuous Updates</h4>
                    <p className="text-sm text-gray-700">Regular data refreshes and model improvements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About the Developer */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <User className="w-8 h-8 text-gray-600" />
              <span>About the Developer</span>
            </h2>
            
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">JW</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Sayola was created by <strong>JW</strong>, a passionate learner of European Portuguese currently living in Lisbon, Portugal. 
                  As someone navigating the beautiful complexities of the Portuguese language firsthand, JW understands the unique challenges 
                  that learners face when trying to master European Portuguese.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  This platform was born from a personal need for better learning tools. While studying Portuguese, JW found existing 
                  resources often focused on Brazilian Portuguese or lacked the depth needed for serious language acquisition. 
                  Combining a background in technology with the lived experience of language learning, JW built Sayola to bridge 
                  this gap and create the comprehensive tool that was missing from the learning landscape.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  What started as a personal project to enhance individual study sessions has evolved into a platform designed to 
                  help fellow learners on the same journey. Sayola represents the intersection of practical language learning needs 
                  and modern technology, created by someone who truly understands what it means to learn Portuguese as a second language.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Important Note:</strong> This website is designed for personal study use. As a fellow learner, 
                        I may make mistakes in the content or implementation. If you find any errors or have suggestions for improvement, 
                        please don't hesitate to contact me. Your feedback helps make Sayola better for everyone in our learning community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}