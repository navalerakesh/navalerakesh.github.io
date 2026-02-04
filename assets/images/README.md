# Blog Images

Store your blog post images here with this structure:

```
assets/images/
  └── YYYY/          # Year
      └── MM/        # Month
          └── image-name.png
```

## Example

```
assets/images/
  └── 2026/
      └── 02/
          ├── distributed-systems-diagram.png
          ├── architecture-overview.jpg
          └── code-screenshot.png
```

## Best Practices

1. **Organize by date**: Use YYYY/MM/ structure
2. **Descriptive names**: Use kebab-case (my-image-name.png)
3. **Optimize**: Compress images before adding
4. **Format**: Prefer PNG for diagrams, JPG for photos
5. **Size**: Keep under 500KB when possible
6. **Alt text**: Always add in Markdown

## Usage in Posts

```markdown
![Descriptive alt text](/assets/images/2026/02/my-diagram.png)
```

## Image Optimization Tools

- [TinyPNG](https://tinypng.com/) - Online compression
- [ImageOptim](https://imageoptim.com/) - Mac app
- [Squoosh](https://squoosh.app/) - Web app
- CLI: `imagemagick`, `optipng`, `jpegoptim`

## Tips

- Use version control for images too
- Don't commit huge files (> 1MB)
- Consider external hosting for very large images
- Reference images with absolute paths from site root
