import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LandscapeGate } from './LandscapeGate'

afterEach(() => vi.unstubAllGlobals())

function renderGate(width: number, height: number, touch = false) {
  vi.stubGlobal('window', {
    matchMedia: (query: string) => ({
      matches: query === '(max-aspect-ratio: 1/1)' ? width <= height : touch,
    }),
  })
  return renderToStaticMarkup(
    <LandscapeGate><button type="button">Play</button></LandscapeGate>,
  )
}

describe('LandscapeGate', () => {
  it('blocks portrait touch screens and explains rotation lock', () => {
    const html = renderGate(768, 1024, true)
    expect(html).toContain('hidden="" inert=""')
    expect(html).toContain('Rotate to landscape')
    expect(html).toContain('portrait orientation lock')
    expect(html).toContain('role="alert"')
    expect(html).toContain('>Play</button>')
  })

  it('blocks tall desktop and square windows with resize guidance', () => {
    for (const [width, height] of [[700, 900], [800, 800]]) {
      const html = renderGate(width, height)
      expect(html).toContain('hidden="" inert=""')
      expect(html).toContain('Make your window wider')
      expect(html).toContain('wider than it is tall')
    }
  })

  it('allows landscape play for touch screens and desktops', () => {
    for (const touch of [true, false]) {
      const html = renderGate(1024, 768, touch)
      expect(html).not.toContain('hidden=""')
      expect(html).not.toContain('inert=""')
      expect(html).not.toContain('landscape-gate')
      expect(html).toContain('>Play</button>')
    }
  })
})
