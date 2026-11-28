import type { View } from '../types'
import type { ReactNode } from 'react'
import { CoinVertical, Planet, ScanSmiley, Strategy } from '@phosphor-icons/react'
import { BadgeIcon } from './BadgeIcon'
import { normalizeCoins } from '../game/economy'

interface GameHeaderProps {
  badgeNames: string[]
  badges: string[]
  coins: number
  onHome: () => void
}

export function GameHeader({ badgeNames, badges, coins, onHome }: GameHeaderProps) {
  const badgeTypes = ['fire', 'grass', 'electric', 'cloud', 'water', 'ice', 'dark', 'light'] as const
  const safeCoins = normalizeCoins(coins)

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
        <span className="coin-count" aria-label={`${safeCoins} Coins`}>
          <CoinVertical size={20} weight="fill" aria-hidden="true" />
          <strong>{safeCoins}</strong>
          <span>Coins</span>
        </span>
        <span className="badge-dots" aria-label={`${badges.length} gym badges`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            (() => {
              const earned = badges.includes(badgeNames[index])
              return (
                <span
                  key={index}
                  className={earned ? `header-badge earned badge-${index}` : `header-badge badge-${index}`}
                  title={earned ? `${badgeNames[index]} Badge earned` : 'Undiscovered badge'}
                  aria-label={earned ? `${badgeNames[index]} Badge earned` : 'Undiscovered badge'}
                >
                  {earned ? <BadgeIcon type={badgeTypes[index]} size={15} /> : '?'}
                </span>
              )
            })()
          ))}
        </span>
      </div>
    </header>
  )
}

interface BottomNavProps {
  view: View
  currentPlanet: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
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
        className={view === 'town' || view === 'planet1' || view === 'planet2' || view === 'planet3' || view === 'planet4' || view === 'planet5' || view === 'planet6' || view === 'planet7' || view === 'planet8' ? 'nav-button active' : 'nav-button'}
        type="button"
        onClick={() => setView(currentPlanet === 0 ? 'town' : currentPlanet === 1 ? 'planet1' : currentPlanet === 2 ? 'planet2' : currentPlanet === 3 ? 'planet3' : currentPlanet === 4 ? 'planet4' : currentPlanet === 5 ? 'planet5' : currentPlanet === 6 ? 'planet6' : currentPlanet === 7 ? 'planet7' : 'planet8')}
      >
        <span className="nav-icon" aria-hidden="true"><Planet size={35} weight="fill" /></span>
        <span>{currentPlanet === 0 ? 'Willowvale' : currentPlanet === 1 ? 'Emberfall' : currentPlanet === 2 ? 'Mossgrove' : currentPlanet === 3 ? 'Voltspire' : currentPlanet === 4 ? 'Cloudrest' : currentPlanet === 5 ? 'Tidehaven' : currentPlanet === 6 ? 'Frostveil' : currentPlanet === 7 ? 'Umbralis' : 'Luminara'}</span>
      </button>
      {navButton('dex', 'Dragon Dex', <ScanSmiley size={35} weight="fill" />)}
      {navButton('team', 'Team', <Strategy size={35} weight="fill" />)}
      <button className="nav-button" type="button" onClick={onReset}>Reset</button>
      {/* Temporary localhost debug cheat; the controller omits this action on other hosts. */}
      {onUnlockAll && <button className="nav-button" type="button" onClick={onUnlockAll}>Unlock</button>}
    </nav>
  )
}
