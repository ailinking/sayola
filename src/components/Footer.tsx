import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Sayola</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Master Portuguese with AI-powered dictionary, pronunciation guides, and daily learning content. 
              Your journey to fluency starts here.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/ailinking/sayola" 
                target="_blank"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Learning
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-gray-600 hover:text-green-600 transition-colors">
                  Dictionary
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-600 hover:text-green-600 transition-colors">
                  Word Comparison
                </Link>
              </li>
              <li>
                <Link href="/daily" className="text-gray-600 hover:text-green-600 transition-colors">
                  Daily Content
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Sayola. Made with <Heart className="w-4 h-4 inline text-red-500" /> for Portuguese learners.
            </p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0">
              Powered by Free Dictionary API & Google Cloud TTS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}