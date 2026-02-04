# Contributing to the Technical Blog

Thank you for your interest in contributing! This guide will help you understand the blog management workflow and best practices.

## 📝 Writing Process

### 1. Planning Your Post

Before writing:
- [ ] Choose a specific topic
- [ ] Research if topic has been covered
- [ ] Outline main points
- [ ] Gather code examples and resources

### 2. Creating a Draft

```bash
# Create a new draft
touch _drafts/your-topic-name.md
```

Add front matter:
```yaml
---
layout: post
title: "Your Descriptive Title"
date: 2026-MM-DD HH:MM:SS -0000
categories: [category1, category2]
tags: [tag1, tag2, tag3, tag4]
author: Rakesh Navale
excerpt: "Compelling 1-2 sentence summary"
published: false
---
```

### 3. Writing Your Content

Follow these guidelines:

**Structure:**
- Start with a hook (why should readers care?)
- Include clear sections with h2/h3 headings
- Add practical examples and code snippets
- End with key takeaways and conclusion

**Code Examples:**
```python
# Always use syntax highlighting
def example_function():
    """Include docstrings"""
    return "value"
```

**Images:**
- Store in `assets/images/YYYY/MM/`
- Use descriptive filenames
- Optimize before committing
- Always add alt text

**Links:**
- Link to related posts
- Reference external resources
- Use descriptive link text

### 4. Preview Locally

```bash
# Serve with drafts visible
bundle exec jekyll serve --drafts

# Open http://localhost:4000
```

Check:
- [ ] Formatting looks correct
- [ ] Code blocks render properly
- [ ] Images load correctly
- [ ] Links work
- [ ] Mobile responsive

### 5. Review and Polish

Before publishing:
- [ ] Proofread for typos and grammar
- [ ] Test all code examples
- [ ] Verify technical accuracy
- [ ] Check SEO (title, excerpt, keywords)
- [ ] Ensure proper heading hierarchy
- [ ] Add internal/external links

### 6. Publishing

```bash
# Move draft to posts with date
mv _drafts/your-topic.md _posts/2026-02-02-your-topic.md

# Update front matter: remove published: false

# Commit and push
git add _posts/2026-02-02-your-topic.md
git commit -m "Add post: Your Topic Title"
git push
```

## 🎨 Style Guide

### Writing Style

- **Tone**: Professional but conversational
- **Person**: Use "I" for personal experiences, "we" for shared journey
- **Jargon**: Explain technical terms on first use
- **Length**: 1000-3000 words (10-20 minute read)
- **Examples**: Real-world scenarios over toy examples

### Formatting

**Headers:**
```markdown
# Post Title (h1 - from front matter)
## Main Section (h2)
### Subsection (h3)
#### Detail (h4 - use sparingly)
```

**Emphasis:**
- **Bold** for important terms
- *Italic* for emphasis
- `code` for inline code/commands

**Lists:**
- Use bullets for unordered
- Numbers for sequential steps
- Keep consistent formatting

**Code Blocks:**
```python
# Always specify language
# Add comments for clarity
# Keep examples focused
```

### Categories and Tags

**Categories** (max 2-3 per post):
- `distributed-systems`
- `ai-platforms`
- `machine-learning`
- `software-engineering`
- `architecture`
- `devops`
- `performance`
- `general`

**Tags** (5-10 per post):
- Specific technologies
- Frameworks and tools
- Design patterns
- Concepts covered

## 🔍 Quality Checklist

Before publishing, verify:

### Content
- [ ] Title is clear and specific
- [ ] Excerpt hooks the reader
- [ ] Introduction explains what/why
- [ ] Content delivers on promise
- [ ] Examples are practical
- [ ] Conclusion summarizes key points
- [ ] Call to action included

### Technical
- [ ] Code examples tested
- [ ] Syntax highlighting correct
- [ ] Links verified
- [ ] Images optimized
- [ ] Front matter valid

### SEO
- [ ] Keywords in title
- [ ] Descriptive URL slug
- [ ] Meta description (excerpt)
- [ ] Alt text on images
- [ ] Internal links added

### Style
- [ ] Grammar checked
- [ ] Spelling verified
- [ ] Consistent voice
- [ ] Proper formatting
- [ ] Mobile friendly

## 📊 Version Control

### Branch Strategy

```bash
# Main branch for published content
main (or master)

# Feature branches for new posts
post/topic-name

# Fix branches for corrections
fix/post-title-correction
```

### Commit Messages

Follow conventional commits:

```bash
# New post
Add post: Building Scalable Systems

# Update existing post
Update post: Fix code example in distributed systems

# Fix typos/errors
Fix post: Correct terminology in ML platforms

# Draft work
Draft: Work in progress on Kubernetes post
```

### Pull Request Process

1. Create feature branch
2. Write/update content
3. Test locally
4. Create PR with description
5. Review (self or peer)
6. Merge to main
7. Verify deployment

## 🚀 Deployment

### Automatic

GitHub Pages automatically:
1. Detects push to main
2. Runs Jekyll build
3. Deploys to ranavale.github.io
4. Usually completes in 1-3 minutes

### Manual Verification

```bash
# Build locally
bundle exec jekyll build

# Check for errors
echo $?  # Should be 0

# Inspect output
ls -la _site/
```

## 🐛 Troubleshooting

### Build Failures

**Check GitHub Actions logs:**
1. Go to repository Actions tab
2. Click on failed workflow
3. Review build logs

**Common issues:**
- Invalid YAML front matter
- Future date on post
- Missing dependencies
- Liquid syntax errors

**Local debugging:**
```bash
# Verbose build
bundle exec jekyll build --verbose

# Check config
bundle exec jekyll doctor
```

### Content Issues

**Posts not appearing:**
- Verify date is not future
- Check filename format
- Ensure `published: false` removed
- Validate front matter YAML

**Images not loading:**
- Use absolute paths: `/assets/images/file.png`
- Check file exists and committed
- Verify image path spelling

## 📚 Resources

### Jekyll
- [Official Documentation](https://jekyllrb.com/docs/)
- [Liquid Syntax](https://shopify.github.io/liquid/)
- [Front Matter](https://jekyllrb.com/docs/front-matter/)

### Writing
- [Technical Writing Guide](https://developers.google.com/tech-writing)
- [Markdown Guide](https://www.markdownguide.org/)
- [Hemingway Editor](http://www.hemingwayapp.com/)

### SEO
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)

## 💡 Tips for Success

1. **Write regularly**: Set a publishing schedule
2. **Start small**: Short posts are fine
3. **Iterate**: Update posts with new insights
4. **Engage**: Respond to feedback
5. **Track**: Monitor what resonates
6. **Learn**: Study successful technical blogs
7. **Back up**: Git is your version control

## 🎯 Post Ideas

Keep a backlog of topics:
- Pain points you've solved
- Tools you've discovered
- Concepts you've learned
- Questions you've answered
- Projects you've built

## 📧 Questions?

Open an issue or reach out directly for:
- Topic suggestions
- Technical help
- Collaboration opportunities
- Feedback

---

**Happy writing! Your insights matter. 🚀**
