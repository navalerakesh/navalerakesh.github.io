import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

export function initScroll() {
  // For long-form reading pages (blog index and posts), avoid
  // hiding content behind scroll-triggered reveals so users
  // see the text immediately without needing to scroll.
  // Check this FIRST before any other operations to ensure robustness.
  const isReadingPage = document.querySelector('.post-page, .blog-layout')
  if (isReadingPage) {
    // Make all .reveal elements immediately visible on reading pages
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  // For non-reading pages, setup smooth scroll and animations
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReduced) {
    try {
      const lenis = new Lenis({ duration: 1.2, smooth: true, lerp: 0.08 })
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)

      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) { return arguments.length ? lenis.scrollTo(value) : window.scrollY },
        getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight } }
      })
    } catch (e) {
      console.warn('Smooth scroll initialization failed:', e)
    }
  }

  const animateIn = (el) => {
    gsap.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out', stagger: 0.06 })
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { animateIn(entry.target); io.unobserve(entry.target) } })
  }, { threshold: 0.15 })

  document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 0; io.observe(el) })
}
