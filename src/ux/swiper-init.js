export function initSwiper() {
  const container = document.querySelector('.posts-grid.swiper')
  if (!container) return

  const wrapper = container.querySelector('.swiper-wrapper')
  if (!wrapper) return

  const slides = Array.from(wrapper.children)
  if (!slides.length) return

  const prevButton = container.querySelector('.posts-swiper-prev')
  const nextButton = container.querySelector('.posts-swiper-next')

  const getScrollAmount = () => {
    const firstSlide = slides[0]
    if (!firstSlide) return 300

    const slideWidth = firstSlide.offsetWidth || 300
    const styles = getComputedStyle(wrapper)
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0

    return slideWidth + gap
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      wrapper.scrollBy({ left: getScrollAmount(), behavior: 'smooth' })
    })
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      wrapper.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' })
    })
  }
}
