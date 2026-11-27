import type { View } from '../types'
import type { ReactNode } from 'react'
import { Planet, ScanSmiley, Strategy } from '@phosphor-icons/react'

interface GameHeaderProps {
  caughtCount: number
  seenCount: number
  badgeNames: string[]
  badges: string[]
  onHome: () => void
}

export function GameHeader({ caughtCount, seenCount, badgeNames, badges, onHome }: GameHeaderProps) {
  const badgeSymbols = ['◆', '♧', '❉', 'Ϟ', '☀', '☁', '◐', '✦']

  return (
    <header className="game-header">
      <button className="brand-button" type="button" onClick={onHome}>
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
  currentPlanet: 0 | 1 | 2
  setView: (view: View) => void
  onReset: () => void
  onCatchAll?: () => void
}

export function BottomNav({ view, currentPlanet, setView, onReset, onCatchAll }: BottomNavProps) {
  const navButton = (target: View, label: string, icon: ReactNode) => (
    <button className={view === target ? 'nav-button active' : 'nav-button'} onClick={() => setView(target)} type="button">
      <span className="nav-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  )

  return (
    <nav className={onCatchAll ? 'bottom-nav with-debug' : 'bottom-nav'} aria-label="Main navigation">
      <button
        className={view === 'town' || view === 'planet1' || view === 'planet2' ? 'nav-button active' : 'nav-button'}
        type="button"
        onClick={() => setView(currentPlanet === 0 ? 'town' : currentPlanet === 2 ? 'planet2' : 'planet1')}
      >
        <span className="nav-icon" aria-hidden="true"><Planet size={35} weight="fill" /></span>
        <span>{currentPlanet === 0 ? 'Willowvale' : currentPlanet === 2 ? 'Mossgrove' : 'Emberfall'}</span>
      </button>
      {navButton('dex', 'Dragon Dex', <ScanSmiley size={35} weight="fill" />)}
      {navButton('team', 'Team', <Strategy size={35} weight="fill" />)}
      <button className="nav-button" type="button" onClick={onReset}>Reset</button>
      {/* Temporary localhost debug cheat; the controller omits this action on other hosts. */}
      {onCatchAll && <button className="nav-button" type="button" onClick={onCatchAll}>Catch all</button>}
    </nav>
  )
}
