import gsap from 'gsap'

export function initHeroAnimation() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (prefersReduced) {
    // Show all hero elements immediately if user prefers reduced motion
    const heroElements = document.querySelectorAll('.hero-title, .hero-tagline, .hero-description, .hero-cta')
    heroElements.forEach(el => {
      if (el) el.style.opacity = 1
    })
    return
  }

  // GSAP entrance animation for hero section
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
  
  const heroTitle = document.querySelector('.hero-title')
  const heroTagline = document.querySelector('.hero-tagline')
  const heroDescription = document.querySelector('.hero-description')
  const heroButtons = document.querySelectorAll('.hero-cta .btn')
  const heroAvatar = document.querySelector('.hero-avatar')

  // Set initial states
  if (heroAvatar) gsap.set(heroAvatar, { scale: 0.8, autoAlpha: 0 })
  if (heroTitle) gsap.set(heroTitle, { y: 30, autoAlpha: 0 })
  if (heroTagline) gsap.set(heroTagline, { y: 20, autoAlpha: 0 })
  if (heroDescription) gsap.set(heroDescription, { y: 20, autoAlpha: 0 })
  if (heroButtons.length) {
    heroButtons.forEach(btn => gsap.set(btn, { y: 20, autoAlpha: 0 }))
  }

  // Animate in sequence
  timeline
    .to(heroAvatar, { scale: 1, autoAlpha: 1, duration: 0.8 }, 0.1)
    .to(heroTitle, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.3)
    .to(heroTagline, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.5)
    .to(heroDescription, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.7)
  
  // Stagger buttons
  if (heroButtons.length) {
    timeline.to(heroButtons, { 
      y: 0, 
      autoAlpha: 1, 
      duration: 0.6,
      stagger: 0.15 
    }, 0.9)
  }
}
