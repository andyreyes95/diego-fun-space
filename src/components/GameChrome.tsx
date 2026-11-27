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
  const badgeSymbols = ['◆', '♧', 'Ϟ', '☁', '❉', '◐', '✦', '☀']

  return (
    <header className="game-header">
      <button className="brand-button" type="button" onClick={onHome}>
        <img
          className="brand-mark"
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          width={42}
          height={42}
          alt=""
        />
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
  currentPlanet: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  setView: (view: View) => void
  onReset: () => void
  onUnlockAll?: () => void
}

export function BottomNav({ view, currentPlanet, setView, onReset, onUnlockAll }: BottomNavProps) {
  const navButton = (target: View, label: string, icon: ReactNode) => (
    <button className={view === target ? 'nav-button active' : 'nav-button'} onClick={() => setView(target)} type="button">
      <span className="nav-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  )

  return (
    <nav className={onUnlockAll ? 'bottom-nav with-debug' : 'bottom-nav'} aria-label="Main navigation">
      <button
        className={view === 'town' || view === 'planet1' || view === 'planet2' || view === 'planet3' || view === 'planet4' || view === 'planet5' || view === 'planet6' || view === 'planet7' ? 'nav-button active' : 'nav-button'}
        type="button"
        onClick={() => setView(currentPlanet === 0 ? 'town' : currentPlanet === 1 ? 'planet1' : currentPlanet === 2 ? 'planet2' : currentPlanet === 3 ? 'planet3' : currentPlanet === 4 ? 'planet4' : currentPlanet === 5 ? 'planet5' : currentPlanet === 6 ? 'planet6' : 'planet7')}
      >
        <span className="nav-icon" aria-hidden="true"><Planet size={35} weight="fill" /></span>
        <span>{currentPlanet === 0 ? 'Willowvale' : currentPlanet === 1 ? 'Emberfall' : currentPlanet === 2 ? 'Mossgrove' : currentPlanet === 3 ? 'Voltspire' : currentPlanet === 4 ? 'Cloudrest' : currentPlanet === 5 ? 'Tidehaven' : currentPlanet === 6 ? 'Frostveil' : 'Umbralis'}</span>
      </button>
      {navButton('dex', 'Dragon Dex', <ScanSmiley size={35} weight="fill" />)}
      {navButton('team', 'Team', <Strategy size={35} weight="fill" />)}
      <button className="nav-button" type="button" onClick={onReset}>Reset</button>
      {/* Temporary localhost debug cheat; the controller omits this action on other hosts. */}
      {onUnlockAll && <button className="nav-button" type="button" onClick={onUnlockAll}>Unlock all</button>}
    </nav>
  )
}
