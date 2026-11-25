import type { View } from '../types'

interface GameHeaderProps {
  caughtCount: number
  seenCount: number
  badgeNames: string[]
  badges: string[]
  onTown: () => void
}

export function GameHeader({ caughtCount, seenCount, badgeNames, badges, onTown }: GameHeaderProps) {
  const badgeSymbols = ['◆', '♧', '❉', 'Ϟ', '☀', '☁', '◐', '✦']

  return (
    <header className="game-header">
      <button className="brand-button" type="button" onClick={onTown}>
        <span className="brand-mark">✦</span>
        <span><strong>STARCREST</strong><small>DRAGONS</small></span>
      </button>
      <div className="header-progress">
        <span><strong>{caughtCount}</strong> caught</span>
        <span><strong>{seenCount}</strong> seen</span>
        <span className="badge-dots" aria-label={`${badges.length} gym badges`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <span
              key={index}
              className={badges.includes(badgeNames[index]) ? `header-badge earned badge-${index}` : `header-badge badge-${index}`}
              title={badges.includes(badgeNames[index]) ? `${badgeNames[index]} Badge earned` : `${badgeNames[index]} Badge locked`}
              aria-label={badges.includes(badgeNames[index]) ? `${badgeNames[index]} Badge earned` : `${badgeNames[index]} Badge locked`}
            >
              {badgeSymbols[index]}
            </span>
          ))}
        </span>
      </div>
    </header>
  )
}

interface BottomNavProps {
  view: View
  currentPlanet: 1 | 2
  setView: (view: View) => void
  onReset: () => void
}

export function BottomNav({ view, currentPlanet, setView, onReset }: BottomNavProps) {
  const navButton = (target: View, label: string, icon: string) => (
    <button className={view === target ? 'nav-button active' : 'nav-button'} onClick={() => setView(target)} type="button">
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  )

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navButton('town', 'Town', '⌂')}
      <button
        className={view === 'planet1' || view === 'planet2' ? 'nav-button active' : 'nav-button'}
        type="button"
        onClick={() => setView(currentPlanet === 2 ? 'planet2' : 'planet1')}
      >
        <span aria-hidden="true">✦</span>
        <span>{currentPlanet === 2 ? 'Mossgrove' : 'Emberfall'}</span>
      </button>
      {navButton('map', 'Planet Map', '◎')}
      {navButton('dex', 'Dragon Dex', '◎')}
      <button className="nav-button" type="button" onClick={onReset}>Reset</button>
    </nav>
  )
}
