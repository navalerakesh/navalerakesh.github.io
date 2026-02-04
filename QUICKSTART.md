# Quick Start Guide

Get your blog up and running in 5 minutes!

## Prerequisites

- Git installed
- Ruby 2.7+ installed
- Text editor (VS Code, Sublime, etc.)

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/ranavale/rakeshnavale.github.io.git
cd rakeshnavale.github.io

# 2. Install dependencies
gem install bundler
bundle install

# 3. Start local server
bundle exec jekyll serve

# 4. Open browser
# Navigate to http://localhost:4000
```

## Write Your First Post

### Step 1: Create a new file

```bash
# Use today's date
touch _posts/$(date +%Y-%m-%d)-my-first-post.md
```

### Step 2: Add front matter

Copy this template to your new file:

```yaml
---
layout: post
title: "My First Technical Post"
date: 2026-02-02 10:00:00 -0000
categories: [general]
tags: [introduction, getting-started]
author: Rakesh Navale
excerpt: "An introduction to my technical blog journey"
---
```

### Step 3: Write content

```markdown
# My First Technical Post

Hello world! This is my first post.

## What I'll Write About

- Distributed systems
- AI platforms
- Software engineering

## Code Example

```python
def hello_blog():
    print("Hello from my technical blog!")
```

## Conclusion

Excited to share more technical insights!
```

### Step 4: Preview locally

Your local server should auto-reload. Check http://localhost:4000

### Step 5: Publish

```bash
git add _posts/2026-02-02-my-first-post.md
git commit -m "Add post: My First Technical Post"
git push
```

Wait 1-3 minutes for GitHub Pages to build and deploy!

## Common Commands

```bash
# Start server
bundle exec jekyll serve

# Start with drafts visible
bundle exec jekyll serve --drafts

# Start with live reload
bundle exec jekyll serve --livereload

# Build site
bundle exec jekyll build

# Check for issues
bundle exec jekyll doctor
```

## Directory Quick Reference

- `_posts/` - Published posts (YYYY-MM-DD-title.md)
- `_drafts/` - Work in progress posts (no date needed)
- `assets/images/` - Images for posts
- `_config.yml` - Site configuration
- `blog.md` - Blog listing page

## Next Steps

1. ✅ Read the full [README.md](README.md)
2. ✅ Review [CONTRIBUTING.md](CONTRIBUTING.md) for best practices
3. ✅ Check out example posts in `_posts/`
4. ✅ Customize `_config.yml` with your info
5. ✅ Write your first real post!

## Need Help?

- Check [Jekyll Documentation](https://jekyllrb.com/docs/)
- Review example posts
- Open an issue on GitHub

---

**You're all set! Happy blogging! 🚀**
