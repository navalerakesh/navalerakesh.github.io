export function initReadingProgress() {
  // Only add progress indicator on blog post pages
  const postElement = document.body.classList.contains('post') || document.querySelector('.post-content')
  if (!postElement) return
  
  // Create progress bar
  const progressBar = document.createElement('div')
  progressBar.className = 'reading-progress'
  progressBar.innerHTML = '<div class="reading-progress-bar"></div>'
  document.body.prepend(progressBar)
  
  const bar = progressBar.querySelector('.reading-progress-bar')
  
  // Update progress on scroll
  function updateProgress() {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY
    
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100
    const clampedPercentage = Math.min(Math.max(scrollPercentage, 0), 100)
    
    bar.style.width = `${clampedPercentage}%`
  }
  
  // Throttle scroll event for performance
  let ticking = false
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress()
        ticking = false
      })
      ticking = true
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true })
  updateProgress() // Initial update
}
