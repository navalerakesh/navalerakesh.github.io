// Add js-enabled class for progressive enhancement
document.documentElement.classList.add('js-enabled')

// Initialize scroll animations and swiper on load
document.addEventListener('DOMContentLoaded', async () => {
  // Lazy load scroll, hero, reading progress, and swiper initialization
  const [
    { initScroll },
    { initHeroAnimation },
    { initReadingProgress },
    { initSwiper },
    { initBlogList }
  ] = await Promise.all([
    import('./ux/scroll-init.js'),
    import('./ux/hero-animation.js'),
    import('./ux/reading-progress.js'),
    import('./ux/swiper-init.js'),
    import('./ux/blog-list.js')
  ])
  
  if (typeof initHeroAnimation === 'function') initHeroAnimation()
  if (typeof initScroll === 'function') initScroll()
  if (typeof initReadingProgress === 'function') initReadingProgress()
  if (typeof initSwiper === 'function') initSwiper()
  if (typeof initBlogList === 'function') initBlogList()

  // Enhance content (callouts, copy buttons) after initial render
  const { initContentEnhancements } = await import('./ux/content-enhancements.js')
  if (typeof initContentEnhancements === 'function') initContentEnhancements()
})
