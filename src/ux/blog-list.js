export function initBlogList() {
  const container = document.querySelector('.posts-list')
  const controls = document.querySelector('[data-blog-controls]')
  if (!container || !controls) return

  const items = Array.from(container.querySelectorAll('.blog-post-item'))
  if (!items.length) return

  const filterSelect = document.getElementById('blog-filter-topic')
  const sortSelect = document.getElementById('blog-sort')
  if (!filterSelect || !sortSelect) return

  // Keep a stable copy of the items so we can sort and re-append
  const originalItems = items.slice()

  function applyFromHash() {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash
    if (!hash) return

    // Only handle category hashes (tags could be supported later)
    const categoryValue = hash.startsWith('tag-') ? null : hash
    if (!categoryValue) return

    const option = Array.from(filterSelect.options).find(o => o.value === categoryValue)
    if (option) {
      filterSelect.value = categoryValue
    }
  }

  function apply() {
    const filterValue = filterSelect.value
    const sortValue = sortSelect.value

    const sorted = originalItems.slice().sort((a, b) => {
      const aDate = a.dataset.date || ''
      const bDate = b.dataset.date || ''
      const aTitle = (a.dataset.title || '').toLowerCase()
      const bTitle = (b.dataset.title || '').toLowerCase()

      if (sortValue === 'oldest') {
        return aDate.localeCompare(bDate)
      }
      if (sortValue === 'title') {
        return aTitle.localeCompare(bTitle)
      }
      // default: newest first
      return bDate.localeCompare(aDate)
    })

    container.innerHTML = ''

    sorted.forEach((item) => {
      const category = item.dataset.category || ''
      const matchesFilter = filterValue === 'all' || category === filterValue
      item.style.display = matchesFilter ? '' : 'none'
      container.appendChild(item)
    })
  }

  filterSelect.addEventListener('change', apply)
  sortSelect.addEventListener('change', apply)

  window.addEventListener('hashchange', () => {
    applyFromHash()
    apply()
  })

  // Initial application keeps default order for "newest" while
  // making sure filter state is honored.
  applyFromHash()
  apply()
}
