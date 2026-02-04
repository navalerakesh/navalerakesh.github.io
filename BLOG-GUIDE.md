# Blog Management Guide

Complete guide for writing, managing, and publishing blog posts on this Jekyll-based technical blog.

## ✍️ Writing a New Blog Post

### Quick Start

1. **Create a new file in `_posts/` directory**

   File naming convention: `YYYY-MM-DD-title-with-dashes.md`
   
   Example: `2026-02-02-my-first-blog-post.md`

2. **Add front matter at the top**

```yaml
---
layout: post
title: "Your Post Title"
date: 2026-02-02 10:00:00 -0000
categories: [distributed-systems, architecture]
tags: [kubernetes, microservices, scalability]
author: Rakesh Navale
excerpt: "A brief summary of your post that appears in listings"
---
```

3. **Write your content in Markdown**

4. **Commit and push**

```bash
git add _posts/2026-02-02-your-post.md
git commit -m "Add blog post: Your Post Title"
git push
```

GitHub Pages will automatically build and deploy within minutes!

### Front Matter Fields Explained

- **layout**: Always use `post` for blog posts
- **title**: Your post title (appears in h1 and page title)
- **date**: Publication date and time (YYYY-MM-DD HH:MM:SS timezone)
- **categories**: Broad topics (2-3 max) - used for organization
- **tags**: Specific keywords (5-10 max) - used for discovery
- **author**: Your name (defaults to config if omitted)
- **excerpt**: Short summary (1-2 sentences) for listings and SEO
- **published**: Set to `false` to keep as draft (optional)

## 📝 Working with Drafts

Store work-in-progress posts in `_drafts/` folder:

```bash
# Create draft (no date prefix needed)
touch _drafts/my-draft-post.md

# Preview drafts locally
bundle exec jekyll serve --drafts

# Publish: move to _posts/ with date
mv _drafts/my-draft-post.md _posts/2026-02-02-my-draft-post.md
```

## 🎨 Adding Images

1. **Store images in organized folders**

```bash
assets/images/2026/02/my-image.png
```

2. **Reference in posts**

```markdown
![Alt text](/ranavale/assets/images/2026/02/my-image.png)
```

Note: Use `/ranavale/` prefix for all asset paths since the site is served from that subdirectory.

3. **Optimize images before adding** (use TinyPNG, ImageOptim, etc.)

## 📂 Categories and Tags

### Categories (Broad Topics)

Use for high-level organization:
- `distributed-systems`
- `ai-platforms`
- `machine-learning`
- `software-engineering`
- `architecture`
- `devops`
- `performance`
- `general`

### Tags (Specific Keywords)

Use for detailed topics and technologies:
- Technologies: `kubernetes`, `docker`, `python`, `java`, `go`
- Concepts: `scalability`, `microservices`, `caching`, `monitoring`
- Patterns: `event-driven`, `cqrs`, `saga-pattern`
- Tools: `prometheus`, `grafana`, `kafka`, `redis`

## 💻 Local Development

### Prerequisites

- Ruby 2.7 or higher
- Bundler: `gem install bundler`

### Setup

```bash
# Clone repository
git clone https://github.com/ranavale/ranavale.git
cd ranavale

# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve --livereload

# Serve with drafts visible
bundle exec jekyll serve --drafts

# Build only (output to _site/)
bundle exec jekyll build
```

Visit `http://localhost:4000/ranavale/` to preview your site.

### Troubleshooting

**Bundle install fails:**
```bash
# Update bundler
gem install bundler

# Clean and reinstall
rm -rf vendor/ .bundle/
bundle install
```

**Port 4000 already in use:**
```bash
bundle exec jekyll serve --port 4001
```

## 📊 Blog Management Best Practices

### 1. Version Control Workflow

```bash
# Create feature branch for new post
git checkout -b post/your-topic-name

# Add and commit
git add _posts/2026-02-02-your-post.md
git commit -m "Add post: Your Topic Name"

# Push and create PR for review
git push origin post/your-topic-name
```

### 2. Commit Message Convention

- `Add post: [Title]` - New blog post
- `Update post: [Title]` - Edit existing post
- `Fix post: [Title]` - Fix errors/typos
- `Draft: [Title]` - Work in progress

### 3. File Organization

- **Images**: `assets/images/YYYY/MM/descriptive-name.png`
- **Posts**: Always use date prefix in `_posts/`
- **Drafts**: No date needed in `_drafts/`

### 4. Writing Tips

- **Clear titles**: Be specific and descriptive
- **Strong excerpts**: Hook readers in 1-2 sentences
- **Code examples**: Always specify language for syntax highlighting
- **Headings**: Use proper hierarchy (h2 for main sections, h3 for subsections)
- **Links**: Use descriptive link text, not "click here"
- **SEO**: Include keywords naturally in title, excerpt, and content

### 5. Content Guidelines

✅ **Do:**
- Write for your future self
- Include practical examples
- Share real-world experiences
- Add code snippets with explanations
- Link to related posts and external resources
- Update old posts when needed

❌ **Don't:**
- Publish unfinished content
- Use Lorem Ipsum placeholders
- Skip proofreading
- Forget to test code examples
- Over-optimize for SEO

## 🔍 SEO and Analytics

### Built-in SEO Features

- ✅ SEO-friendly URLs
- ✅ Automatic sitemap (`/sitemap.xml`)
- ✅ RSS feed (`/feed.xml`)
- ✅ Meta tags via jekyll-seo-tag
- ✅ Open Graph tags for social sharing
- ✅ Twitter card support

### Adding Analytics (Optional)

Edit `_config.yml` to add:

```yaml
# Google Analytics
google_analytics: UA-XXXXXXXXX-X

# Or for GA4
google_analytics_4: G-XXXXXXXXXX

# Google Tag Manager (recommended for advanced tracking)
google_tag_manager: GTM-XXXXXXX
```

**Note:** Google Tag Manager (GTM) is recommended for more flexible tracking and tag management. With GTM, you can manage multiple tracking tools (Google Analytics, Facebook Pixel, etc.) from a single interface without modifying code.

## 🚀 Deployment

### Automatic Deployment

GitHub Pages automatically builds and deploys when you push to the main branch:

1. Push changes to GitHub
2. GitHub Actions builds the site
3. Live in 1-3 minutes at `ranavale.github.io/ranavale`

### Manual Build Check

```bash
# Build locally to check for errors
bundle exec jekyll build

# Check the _site/ folder
ls -la _site/
```

## 📋 Publishing Checklist

Before publishing a new post:

- [ ] Proofread content thoroughly
- [ ] Test all code examples
- [ ] Verify all links work
- [ ] Optimize images
- [ ] Write compelling excerpt
- [ ] Add relevant tags and categories
- [ ] Set correct date and time
- [ ] Preview locally
- [ ] Commit with descriptive message
- [ ] Push to GitHub

## 🔗 Useful Commands

```bash
# Create new post quickly
touch _posts/$(date +%Y-%m-%d)-your-post-title.md

# Find broken links
bundle exec jekyll build
grep -r "404" _site/

# Count words in post
wc -w _posts/2026-02-02-your-post.md

# List all posts
ls -1 _posts/

# Search posts
grep -r "keyword" _posts/
```

## 📚 Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)
- [Liquid Template Language](https://shopify.github.io/liquid/)

## 🐛 Common Issues

### Posts Not Showing

- Check date is not in the future
- Verify filename format: `YYYY-MM-DD-title.md`
- Ensure `published: false` is not set
- Check front matter YAML is valid

### Images Not Loading

- Use absolute paths with baseurl: `/ranavale/assets/images/file.png`
- Check file actually exists in repo
- Verify image committed to Git

### Build Failures

- Check Jekyll build logs in GitHub Actions
- Validate YAML front matter
- Test build locally: `bundle exec jekyll build`

---

For general site information, see [README.md](README.md)
