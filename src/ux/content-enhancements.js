export function initContentEnhancements() {
  const contentRoot = document.querySelector('.post-content, .blog-main, .home-page')
  if (!contentRoot) return

  enhanceCallouts(contentRoot)
  enhanceCodeBlocks(contentRoot)
}

function enhanceCallouts(root) {
  const calloutMap = {
    '[!NOTE]': 'note',
    '[!TIP]': 'tip',
    '[!WARNING]': 'warning',
    '[!IMPORTANT]': 'important'
  }

  const blockquotes = root.querySelectorAll('blockquote')
  blockquotes.forEach((blockquote) => {
    const firstParagraph = blockquote.querySelector('p')
    if (!firstParagraph) return

    const text = firstParagraph.textContent || ''
    for (const marker in calloutMap) {
      if (text.trim().startsWith(marker)) {
        const type = calloutMap[marker]
        blockquote.classList.add('callout', `callout-${type}`)

        // Remove marker from visible text
        firstParagraph.textContent = text.replace(marker, '').trimStart()
        break
      }
    }
  })
}

function enhanceCodeBlocks(root) {
  const blocks = root.querySelectorAll('pre > code')
  blocks.forEach((code) => {
    const pre = code.parentElement
    if (!pre || pre.dataset.enhanced === 'true') return

    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'

    const toolbar = document.createElement('div')
    toolbar.className = 'code-block-toolbar'

    const langMatch = (code.className || '').match(/language-([a-z0-9+#]+)/i)
    const langLabel = document.createElement('span')
    langLabel.className = 'code-lang-label'
    langLabel.textContent = langMatch ? langMatch[1].toUpperCase() : 'CODE'

    const copyButton = document.createElement('button')
    copyButton.type = 'button'
    copyButton.className = 'code-copy-button'
    copyButton.textContent = 'Copy'

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || '')
        const original = copyButton.textContent
        copyButton.textContent = 'Copied'
        copyButton.classList.add('copied')
        setTimeout(() => {
          copyButton.textContent = original
          copyButton.classList.remove('copied')
        }, 1500)
      } catch (e) {
        // Fallback: select text so user can copy manually
        const range = document.createRange()
        range.selectNodeContents(code)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }
    })

    toolbar.appendChild(langLabel)
    toolbar.appendChild(copyButton)

    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.appendChild(toolbar)
    wrapper.appendChild(pre)

    pre.dataset.enhanced = 'true'
  })
}
