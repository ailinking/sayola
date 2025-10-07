# Contributing to Sayola

Thank you for your interest in contributing to Sayola! We welcome contributions from everyone, whether you're fixing a bug, adding a feature, improving documentation, or helping with translations.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of TypeScript/React
- Familiarity with Next.js (helpful but not required)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/sayola.git
   cd sayola
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env.local
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### 1. Create a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style and conventions
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

- Test your changes thoroughly in the browser
- Ensure the development server runs without errors
- Check that existing functionality still works

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add pronunciation comparison feature"
# or
git commit -m "fix: resolve audio playback issue on Safari"
```

### 5. Push and Create a Pull Request

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub with:
- A clear title and description
- Screenshots/GIFs for UI changes
- Reference to any related issues

## 📖 Contributing Blog Posts

We welcome high-quality blog posts about Portuguese language learning! Blog posts are a great way to share knowledge and help the Portuguese learning community.

### Quick Start for Blog Contributors

1. **Read the [Blog Contribution Guide](./BLOG_CONTRIBUTION_GUIDE.md)** for detailed requirements
2. **Use the [Blog Post Template](./blog-post-template.json)** as a starting point
3. **Submit via [GitHub Issue](https://github.com/your-username/sayola/issues/new?template=blog_post_submission.md)** (recommended)

### 🤖 AI-Assisted Auto Publishing
For authorized contributors, we offer an automated publishing system that bypasses manual review:

**How it works:**
- Use the [Auto Publish Issue Template](https://github.com/ailinking/sayola/issues/new?template=auto_publish_blog.md)
- Follow the [AI Blog Generation Guide](AI_BLOG_GENERATION_GUIDE.md) for detailed instructions
- Include the required verification code in your submission
- Articles are automatically published upon successful verification

**Benefits:**
- Instant publication without waiting for manual review
- Perfect for AI-generated content with proper verification
- Streamlined workflow for frequent contributors

### Blog Post Requirements

- **Original content** about Portuguese language learning
- **Accurate information** - preferably reviewed by native speakers
- **Practical value** for Portuguese learners
- **Clear structure** with headings, lists, and examples
- **800-2000 words** (2-8 minute read time)
- **Chinese language** with European Portuguese examples

### Submission Methods

1. **GitHub Issue** (Recommended): Use our [blog post submission template](https://github.com/your-username/sayola/issues/new?template=blog_post_submission.md)
2. **Pull Request**: Add JSON file to `content/blog/` directory
3. **Email**: Send to blog@sayola.com with template format

### Content Topics

- Portuguese grammar and language rules
- Portuguese culture and traditions
- Practical conversations and daily phrases
- Language learning tips and methods
- Portuguese history and geography
- Portuguese cuisine and lifestyle
- Language learning experience sharing

### Review Process

1. **Format Review** (1-2 business days)
2. **Content Review** (3-5 business days) 
3. **Technical Review** (1-2 business days)
4. **Publication** (1 business day after approval)

For detailed guidelines, see our [Blog Contribution Guide](./BLOG_CONTRIBUTION_GUIDE.md).

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Prefer `const` over `let` when possible
- Use arrow functions for short functions

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types for props
- Follow the existing component structure

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistency with existing styles
- Use semantic class names when custom CSS is needed

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Browser/device information**
6. **Console errors** if any

## 💡 Suggesting Features

For feature requests:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** your feature would solve
3. **Explain your proposed solution**
4. **Consider alternative solutions**
5. **Provide mockups** for UI features (if applicable)

## 🌍 Translation Contributions

We welcome translations for:

- UI text and labels
- Error messages
- Documentation
- Sample content

Please create an issue first to discuss the language you'd like to add.

## 📚 Documentation

Help improve our documentation by:

- Fixing typos and grammar
- Adding examples and use cases
- Improving clarity and organization
- Translating documentation

## 🔍 Code Review Process

1. All submissions require review before merging
2. We may suggest changes or improvements
3. Please be responsive to feedback
4. Once approved, a maintainer will merge your PR

## 🎯 Areas Where We Need Help

- **Bug fixes** and performance improvements
- **Mobile responsiveness** enhancements
- **Accessibility** improvements
- **Portuguese language content** (native speakers especially welcome)
- **Documentation** and tutorials
- **Testing** and quality assurance

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the README and wiki first

## 🏆 Recognition

Contributors will be:

- Listed in our README
- Mentioned in release notes for significant contributions
- Invited to join our contributors team

## 📋 Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Self-review of your own code completed
- [ ] Comments added for hard-to-understand areas
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers (if UI changes)
- [ ] Screenshots included for visual changes

## 🤝 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## 📄 License

By contributing to Sayola, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Sayola! Your efforts help make Portuguese learning accessible to everyone. 🇵🇹❤️