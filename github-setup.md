# GitHub Repository Setup Commands

## After creating the repository on GitHub, run these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sayola.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative with SSH (if you have SSH keys set up):
```bash
# Add GitHub remote with SSH
git remote add origin git@github.com:YOUR_USERNAME/sayola.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Repository Information:
- **Name**: sayola
- **Description**: Sayola - Portuguese Learning Platform with dictionary search, audio pronunciation, and daily content
- **Visibility**: Public (recommended)
- **Features**: 
  - 🔍 Dictionary search
  - 🔊 Audio pronunciation
  - ⚖️ Word comparison
  - 📚 Daily learning content
  - 👤 User profiles
  - 🎨 Modern responsive UI

## After pushing:
1. Enable GitHub Pages (if desired) in repository settings
2. Set up Vercel deployment for live demo
3. Add environment variables for Google Cloud TTS API

## Live Demo URL (after Vercel deployment):
- Will be available at: `https://sayola-your-username.vercel.app`