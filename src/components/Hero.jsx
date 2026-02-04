import React, { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'framer-motion'
gsap.registerPlugin(ScrollTrigger)

export default function Hero({ lottiePath = '/_inputs/hero-lottie.json' }) {
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const reduceMotion = useReducedMotion()
  const canMotion = !prefersReduced && !reduceMotion

  useEffect(() => {
    if (!containerRef.current) return

    const initLottie = () => {
      if (animRef.current || prefersReduced) return
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: lottiePath
      })
    }

    if (!prefersReduced) {
      const onFirstInteract = () => { initLottie(); window.removeEventListener('pointerdown', onFirstInteract) }
      window.addEventListener('pointerdown', onFirstInteract, { once: true })

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { initLottie(); io.disconnect() }
        })
      }, { threshold: 0.25 })
      io.observe(containerRef.current)
    } else {
      containerRef.current.classList.add('reduced-motion')
    }

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        const tl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power2.out' } })
        tl.from('.hero-title', { y: 24, autoAlpha: 0, stagger: 0.06 })
          .from('.hero-tagline', { y: 18, autoAlpha: 0 }, '-=0.4')
          .from('.hero-cta > *', { y: 10, autoAlpha: 0, stagger: 0.06 }, '-=0.4')
      }
    }, containerRef)

    return () => {
      ctx.revert()
      if (animRef.current) { animRef.current.destroy(); animRef.current = null }
    }
  }, [lottiePath, prefersReduced])

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-content">
          <h1 id="hero-title" className="hero-title">Rakesh Navale — Engineering Leader</h1>
          <p className="hero-tagline">Building scalable distributed systems and delightful developer experiences.</p>
          <div className="hero-description">Passionate about system design, performance optimization, and engineering excellence.</div>
          <div className="hero-cta">
            <motion.a
              href="/_inputs/Rakesh_Navale_Resume_2025.pdf"
              className="btn btn-primary"
              aria-label="Open resume"
              whileHover={canMotion ? { scale: 1.04, boxShadow: '0 10px 24px rgba(37,99,235,0.22)' } : undefined}
              whileFocus={canMotion ? { scale: 1.03 } : undefined}
              whileTap={canMotion ? { scale: 0.98 } : undefined}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              Resume
            </motion.a>
            <motion.a
              href="/_inputs/Rakesh_Navale_LinkedIn_2025.pdf"
              className="btn btn-secondary"
              aria-label="View LinkedIn"
              whileHover={canMotion ? { scale: 1.04, boxShadow: '0 10px 24px rgba(15,23,42,0.18)' } : undefined}
              whileFocus={canMotion ? { scale: 1.03 } : undefined}
              whileTap={canMotion ? { scale: 0.98 } : undefined}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              LinkedIn
            </motion.a>
          </div>
        </div>

        <div className="hero-visual" ref={containerRef} role="img" aria-label="Hero illustration">
          <noscript>
            <img src="/assets/images/hero-poster.jpg" alt="Hero illustration" />
          </noscript>
        </div>
      </div>
    </section>
  )
}
