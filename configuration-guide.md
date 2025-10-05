# Sayola Portuguese Learning Platform - Configuration Guide

## 🎯 Project Status
✅ **Completed**: Code development, GitHub push
🔄 **Pending**: API keys, production deployment

## 📋 Essential Configuration Checklist

### 1. 🔑 Google Cloud Text-to-Speech API Configuration

#### Step 1: Create Google Cloud Project
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in to your Google account
3. Click "Select Project" → "New Project"
4. Project name: `sayola-tts` or your preferred name
5. Click "Create"

#### Step 2: Enable Text-to-Speech API
1. In the project, go to "APIs & Services" → "Library"
2. Search for "Cloud Text-to-Speech API"
3. Click to enter and click "Enable"

#### Step 3: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. **Important**: Click "Restrict Key" to set security restrictions
   - Application restrictions: Select "HTTP referrers"
   - Add your domain (e.g., `https://your-app.vercel.app/*`)
   - API restrictions: Select "Cloud Text-to-Speech API"

#### Step 4: Local Environment Configuration
Create `.env.local` file in project root:

```bash
# Run in sayola directory
touch .env.local
```

Add to `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLOUD_TTS_API_KEY=your_api_key_here
```

### 2. 🚀 Vercel Deployment Configuration

#### Step 1: Register Vercel Account
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Authorize Vercel to access your GitHub repositories

#### Step 2: Import Project
1. In Vercel dashboard click "New Project"
2. Find `ailinking/sayola` repository
3. Click "Import"
4. Project settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

#### Step 3: Configure Environment Variables
In Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add the following variables:

```env
NEXT_PUBLIC_GOOGLE_CLOUD_TTS_API_KEY = your_api_key_here
```

3. Click "Save"

#### Step 4: Deploy
1. Click "Deploy" to start deployment
2. Wait for build completion (usually 2-3 minutes)
3. Get your app URL: `https://sayola-xxx.vercel.app`

### 3. 🔧 Optional Configuration

#### Custom Domain (Optional)
1. In Vercel project settings go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

#### Google Analytics (Optional)
Add to `.env.local` and Vercel environment variables:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id_here
```

## 🧪 Testing Configuration

### Local Testing
1. Ensure `.env.local` file is configured correctly
2. Restart development server:

```bash
npm run dev
```

3. Visit `http://localhost:3000`
4. Test audio functionality:
   - Search for a Portuguese word
   - Click play button to test TTS

### Production Environment Testing
1. After deployment, visit the Vercel-provided URL
2. Test all features:
   - ✅ Search functionality
   - ✅ Audio playback
   - ✅ Word comparison
   - ✅ Daily content
   - ✅ User settings

## 🛠️ Troubleshooting

### Common Issues

#### 1. Invalid API Key
**Symptoms**: Audio playback fails, console shows 403 error
**Solutions**:
- Check if API key is correctly copied
- Confirm Text-to-Speech API is enabled
- Check API key restriction settings

#### 2. Audio Cannot Play
**Symptoms**: No response when clicking play button
**Solutions**:
- Check browser console for error messages
- Confirm environment variables are configured correctly
- Test network connection

#### 3. Deployment Failure
**Symptoms**: Vercel build fails
**Solutions**:
- Check if GitHub code is up to date
- Confirm package.json dependencies are complete
- View Vercel build logs

### Debug Commands

```bash
# Check environment variables
npm run env

# Rebuild
npm run build

# Check lint errors
npm run lint
```

## 📊 Cost Estimation

### Google Cloud TTS Fees
- **Free tier**: 1 million characters per month
- **Paid pricing**: $16.00 / 1 million characters
- **Estimated usage**: Personal learning projects usually within free tier

### Vercel Hosting Fees
- **Hobby plan**: Free
- **Included features**:
  - 100GB bandwidth/month
  - Unlimited static websites
  - Automatic HTTPS
  - Global CDN

## 🎉 Features After Configuration

After configuration, your Sayola platform will have:

### 🔍 Core Features
- **Smart Search**: Portuguese word query support
- **Audio Pronunciation**: Google TTS high-quality voice
- **Word Comparison**: Side-by-side learning comparison
- **Daily Content**: Personalized learning materials

### 🎨 User Experience
- **Responsive Design**: Mobile, tablet, desktop support
- **Theme Switching**: Light/dark mode toggle
- **Progress Tracking**: Local learning history
- **Fast Loading**: Optimized performance

### 🌐 Production Features
- **SEO Optimized**: Search engine friendly
- **PWA Ready**: Installable as app
- **Internationalization**: Multi-language support framework
- **Security**: Secure API key management

## 📞 Support and Help

If you encounter issues during configuration:

1. **Check documentation**: Re-read relevant steps
2. **View logs**: Browser console and Vercel logs
3. **Test environment**: Confirm local environment is normal
4. **Community support**: GitHub Issues or relevant tech communities

## 🚀 Next Steps

After configuration, you can consider:

1. **Feature Enhancement**:
   - Add more voice options
   - Implement user account system
   - Add learning statistics

2. **Performance Optimization**:
   - Implement audio caching
   - Add offline support
   - Optimize loading speed

3. **Promotion and Sharing**:
   - Share on social media
   - Add to personal portfolio
   - Collect user feedback

**Wishing you a smooth configuration! 🎊**