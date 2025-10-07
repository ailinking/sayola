# AI-Assisted Blog Generation and Auto-Submission Guide

## 🤖 Overview

This guide provides detailed instructions on how to use AI to generate high-quality Portuguese learning blog articles and submit them through the GitHub auto-publishing system to the Sayola platform.

## 🔐 Important Security Information

**Passcode:** `woyaofabu`
- This passcode is used for auto-publishing verification
- Please keep it secure and do not share in public places
- The system uses SHA-256 encryption for verification

## 📋 Complete Operation Steps

### Step 1: Prepare AI Prompt

Use the following prompt template to guide AI in generating blog articles:

```
Please generate a blog article for the Sayola Portuguese learning platform with the following requirements:

Topic: [Specific topic, e.g., Portuguese Verb Conjugation Basics]
Target audience: [Beginner/Intermediate/Advanced]
Article length: 800-1500 words

Content requirements:
1. Include practical Portuguese learning tips
2. Provide specific example sentences and translations
3. Clear structure using headings and lists
4. Include practice suggestions or memory techniques
5. Simple and easy-to-understand language suitable for Chinese readers

Format requirements:
- Use Markdown format
- Include introduction, main content, examples, summary
- Each example sentence must have English translation
- Use appropriate heading levels (##, ###)

Please generate complete article content.
```

### Step 2: Generate Article Content

1. Send the above prompt to AI (such as ChatGPT, Claude, etc.)
2. Check the quality of generated content
3. Ensure Portuguese example sentences are accurate
4. Verify English translations are correct

### Step 3: Prepare Submission Information

Collect the following information for GitHub Issue submission:

**Required Information:**
- Article title (within 60 characters)
- Article category (Beginner/Intermediate/Advanced/Culture)
- Article tags (3-8 tags, comma-separated)
- Article summary (within 150 words)
- Complete article content (Markdown format)
- Author name
- SEO title (within 60 characters)
- SEO description (within 160 characters)
- Keywords (5-15 keywords)
- URL path suggestion (slug)

### Step 4: Create GitHub Issue

1. Visit: `https://github.com/ailinking/sayola/issues/new/choose`
2. Select "Auto Publish Blog Post" template
3. Fill in all information according to the template

**Important: Add the following under the `<!-- PASSCODE: Enter passcode here -->` line:**
```
woyaofabu
```

### Step 5: Submit and Verify

1. Click "Submit new issue" to submit
2. Wait for GitHub Actions automatic processing (usually 1-2 minutes)
3. Check automatic reply in the Issue:
   - ✅ Success: Article published, Issue marked as "published"
   - ❌ Failure: Check error message and make corrections

## 📝 AI Prompt Examples

### Example 1: Grammar Topic

```
Please generate a blog article about "Portuguese Adjective Gender and Number Agreement" for the Sayola Portuguese learning platform.

Target audience: Beginners
Article length: Around 1000 words

Content requirements:
1. Explain basic rules of adjective gender and number agreement
2. Provide at least 10 specific example sentences (Portuguese + English translation)
3. Include common mistakes and avoidance methods
4. Provide practice suggestions
5. Use simple and easy-to-understand language

Format: Use Markdown, include introduction, rule explanation, example sentences, practice suggestions, summary
```

### Example 2: Culture Topic

```
Please generate a blog article about "Brazilian Coffee Culture and Portuguese Expressions" for the Sayola Portuguese learning platform.

Target audience: Intermediate learners
Article length: Around 1200 words

Content requirements:
1. Introduce Brazilian coffee culture background
2. Teach related Portuguese vocabulary and expressions
3. Include dialogue examples
4. Provide cultural learning suggestions
5. Combine language learning with cultural understanding

Format: Use Markdown, include cultural background, vocabulary learning, dialogue practice, cultural tips, summary
```

## ⚠️ Important Notes

### Content Quality Control
- Ensure accuracy of Portuguese content
- Verify grammar and spelling
- Check accuracy of English translations
- Ensure content originality

### Technical Requirements
- Use correct Markdown syntax
- Ensure all required fields are complete
- Enter passcode accurately (case-sensitive)
- Choose appropriate tags and categories

### Security Reminders
- Do not share passcode in public places
- Do not include passcode in Issue title or public content
- Regularly check publishing status

## 🔧 Troubleshooting

### Common Issues

**1. Passcode Verification Failed**
- Check passcode spelling: `woyaofabu`
- Ensure passcode is in correct location
- Check for extra spaces

**2. Content Parsing Failed**
- Check Markdown format
- Ensure all required fields are filled
- Verify special characters are properly escaped

**3. File Generation Failed**
- Check if article title contains special characters
- Ensure slug format is correct (lowercase letters, numbers, hyphens)
- Verify JSON format is valid

### Getting Help

If you encounter problems:
1. Check error information in the Issue
2. Refer to this guide and resubmit
3. Contact project maintainers

## 📊 Best Practices

### Content Creation
1. **Topic Selection**: Choose practical and valuable learning topics
2. **Clear Structure**: Use headings, lists, example sentences to organize content
3. **Rich Examples**: Provide at least 3-5 example sentences for each concept
4. **Strong Practicality**: Include real application scenarios and practice suggestions

### SEO Optimization
1. **Keyword Research**: Choose relevant Portuguese learning keywords
2. **Title Optimization**: Include main keywords, keep concise
3. **Accurate Description**: Accurately describe article content and learning value
4. **Reasonable Tags**: Choose relevant and popular tags

### Submission Efficiency
1. **Batch Preparation**: Prepare information for multiple articles at once
2. **Template Reuse**: Save commonly used prompt templates
3. **Quality Check**: Establish content checking checklist
4. **Regular Publishing**: Maintain stable publishing frequency

---

**Last Updated:** January 2024
**Version:** 1.0
**Maintainer:** Sayola Team