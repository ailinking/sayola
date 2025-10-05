# Sayola - Portuguese Learning Platform

![Sayola Logo](public/favicon.svg)

**Sayola** is a comprehensive Portuguese language learning platform that helps users discover, learn, and master Portuguese vocabulary through interactive features, daily content, and pronunciation tools.

## 🌟 Features

### 📚 Dictionary & Search
- **Comprehensive Dictionary**: Search for Portuguese words with detailed definitions, pronunciations, and examples
- **Real-time Search**: Instant search results as you type
- **Search History**: Keep track of your recent searches
- **Popular Searches**: Discover commonly searched words
- **Search Suggestions**: Get helpful suggestions while searching

### 🔊 Audio Pronunciation
- **Google Cloud TTS Integration**: High-quality Portuguese pronunciation using Google Cloud Text-to-Speech
- **Multiple Portuguese Variants**: Support for both Brazilian Portuguese (pt-BR) and European Portuguese (pt-PT)
- **Fallback Audio**: Web Speech API fallback for development and demo purposes
- **Audio Controls**: Play, pause, and replay pronunciation

### 🆚 Word Comparison
- **Side-by-Side Comparison**: Compare multiple Portuguese words simultaneously
- **Detailed Analysis**: Compare phonetics, parts of speech, and meanings
- **Suggested Pairs**: Get recommendations for commonly compared words
- **Comparison Insights**: Understand differences and similarities between words

### 📅 Daily Learning Content
- **Word of the Day**: Learn a new Portuguese word every day with pronunciation and examples
- **Phrase of the Day**: Master common Portuguese phrases with context and usage
- **Cultural Tips**: Discover Portuguese and Brazilian culture, traditions, and customs
- **Learning Tips**: Get expert advice on grammar, pronunciation, and vocabulary building
- **Daily Challenges**: Test your knowledge with interactive quizzes
- **Weekly Overview**: Track your learning progress throughout the week

### 👤 User Profile & Settings
- **Learning Statistics**: Track words searched, comparisons made, and audio played
- **Personalized Settings**: Customize language preferences, audio settings, and learning goals
- **Achievement System**: Unlock achievements as you progress
- **Search History**: Review your learning journey
- **Favorite Words**: Save and organize your favorite Portuguese words

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) Google Cloud TTS API key for enhanced audio features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sayola.git
   cd sayola
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Cloud TTS API key:
   ```
   NEXT_PUBLIC_GOOGLE_CLOUD_TTS_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### APIs & Services
- **Free Dictionary API** - English dictionary data
- **Google Cloud Text-to-Speech** - High-quality audio pronunciation
- **Web Speech API** - Fallback pronunciation service

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Geist Font** - Modern typography

## 📁 Project Structure

```
sayola/
├── public/                 # Static assets
│   ├── favicon.svg        # Custom Portuguese-themed favicon
│   └── ...
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Home page
│   │   ├── search/        # Dictionary search page
│   │   ├── compare/       # Word comparison page
│   │   ├── daily/         # Daily content page
│   │   ├── profile/       # User profile page
│   │   └── layout.tsx     # Root layout
│   ├── components/        # Reusable React components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Footer.tsx     # Site footer
│   │   ├── SearchBox.tsx  # Search input component
│   │   └── WordCard.tsx   # Word display component
│   └── lib/               # Utility libraries
│       ├── dictionaryApi.ts  # Dictionary API service
│       ├── ttsService.ts     # Text-to-Speech service
│       └── dailyContent.ts   # Daily content generation
├── package.json
└── README.md
```

## 🎯 Usage Examples

### Basic Dictionary Search
```typescript
import { DictionaryService } from '@/lib/dictionaryApi';

const dictionaryService = new DictionaryService();
const results = await dictionaryService.searchWord('obrigado');
```

### Text-to-Speech
```typescript
import { ttsService } from '@/lib/ttsService';

// Generate Portuguese audio
const audioResult = await ttsService.generateAudio('obrigado');

// Play the audio
const audio = new Audio(audioResult.audioUrl);
await audio.play();
```

### Daily Content
```typescript
import { dailyContentService } from '@/lib/dailyContent';

// Get today's content
const dailyContent = dailyContentService.getDailyContent();

// Get content for a specific date
const specificDate = new Date('2024-01-15');
const content = dailyContentService.getDailyContent(specificDate);
```

## 🌍 Internationalization

Sayola supports both Brazilian Portuguese (pt-BR) and European Portuguese (pt-PT):

- **Brazilian Portuguese**: Default variant with Brazilian pronunciation and cultural content
- **European Portuguese**: Alternative pronunciation and Portugal-specific cultural insights
- **Bilingual Content**: Cultural tips and learning materials for both variants

## 🔧 Configuration

### Google Cloud TTS Setup
1. Create a Google Cloud project
2. Enable the Text-to-Speech API
3. Create an API key
4. Add the key to your environment variables

### Customizing Daily Content
The daily content system can be extended by modifying the sample data in `src/lib/dailyContent.ts`:

```typescript
// Add new words
private sampleWords: DailyWord[] = [
  {
    word: "saudade",
    translation: "longing, nostalgia",
    pronunciation: "saw-DAH-jee",
    // ... more properties
  }
];
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Free Dictionary API** - Providing comprehensive dictionary data
- **Google Cloud TTS** - High-quality text-to-speech services
- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Beautiful utility-first CSS framework
- **Lucide** - Clean and consistent icons

## 📞 Support

- **Documentation**: [README](README.md) • [Contributing](CONTRIBUTING.md) • [Configuration Guide](configuration-guide.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/sayola/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/sayola/discussions)
- **Security**: [Security Policy](SECURITY.md)

## 🗺️ Roadmap

- [ ] Mobile app development (React Native)
- [ ] Offline mode support
- [ ] Advanced grammar lessons
- [ ] Community features and forums
- [ ] Spaced repetition system
- [ ] Progress tracking and analytics
- [ ] Integration with language learning APIs
- [ ] Voice recognition for pronunciation practice

---

**Made with ❤️ for Portuguese language learners worldwide**

*Sayola - Your gateway to mastering Portuguese!*
