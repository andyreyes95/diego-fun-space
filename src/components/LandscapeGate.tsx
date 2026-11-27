import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowsOutSimple, DeviceTablet } from '@phosphor-icons/react'

const portraitQuery = '(max-aspect-ratio: 1/1)'
const touchQuery = '(hover: none) and (pointer: coarse)'

export function LandscapeGate({ children }: { children: ReactNode }) {
  const [blocked, setBlocked] = useState(() => window.matchMedia(portraitQuery).matches)
  const [touchDevice, setTouchDevice] = useState(() => window.matchMedia(touchQuery).matches)

  useEffect(() => {
    const portrait = window.matchMedia(portraitQuery)
    const touch = window.matchMedia(touchQuery)
    const update = () => {
      setBlocked(portrait.matches)
      setTouchDevice(touch.matches)
    }
    portrait.addEventListener('change', update)
    touch.addEventListener('change', update)
    update()
    return () => {
      portrait.removeEventListener('change', update)
      touch.removeEventListener('change', update)
    }
  }, [])

  return (
    <>
      <div className="landscape-content" hidden={blocked} inert={blocked}>
        {children}
      </div>
      {blocked && (
        <main className="landscape-gate" aria-labelledby="landscape-heading">
          <div className="landscape-card" role="alert">
            <span className="landscape-icon" aria-hidden="true">
              {touchDevice
                ? <DeviceTablet size={72} weight="duotone" />
                : <ArrowsOutSimple size={72} weight="duotone" />}
            </span>
            <p className="eyebrow">Starcrest Dragons</p>
            <h1 id="landscape-heading">
              {touchDevice ? 'Rotate to landscape' : 'Make your window wider'}
            </h1>
            <p>
              {touchDevice
                ? 'Turn your device sideways to play. If it does not rotate, turn off portrait orientation lock.'
                : 'Resize your browser window so it is wider than it is tall to play.'}
            </p>
            <p className="landscape-hint">
              {touchDevice
                ? 'Using a split-screen window? Make the game window wider.'
                : 'On a phone or tablet? Rotate your device to landscape.'}
            </p>
          </div>
        </main>
      )}
    </>
  )
}
