import type { GameSave } from '../../types'
import { captureOrbs, normalizeCoins, type CaptureOrbId } from '../../game/economy'
import { CoinVertical, CompassRose } from '@phosphor-icons/react'

interface MarketScreenProps {
  save: GameSave
  planet: number
  planetName: string
  onBuy: (orbId: CaptureOrbId) => void
  onClose: () => void
}

const marketArtwork: Partial<Record<number, string>> = {
  1: 'emberfall',
  2: 'mossgrove',
  3: 'voltspire',
  4: 'cloudrest',
  5: 'tidehaven',
  6: 'frostveil',
  7: 'umbralis',
  8: 'luminara',
}

export function MarketScreen({ save, planet, planetName, onBuy, onClose }: MarketScreenProps) {
  const coins = normalizeCoins(save.coins)
  const artwork = marketArtwork[planet] ?? marketArtwork[1]

  return (
    <section
      className="market-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="market-title"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(20, 31, 35, 0.9), rgba(15, 22, 29, 0.68)), url('/assets/map-locations/${artwork}/market.png')`,
      }}
    >
      <button className="market-close icon-button" type="button" onClick={onClose} aria-label="Leave market">×</button>
      <div className="market-shell">
        <p className="eyebrow">{planetName} Market</p>
        <div className="market-heading">
          <div>
            <h1 id="market-title">Starcrest Supply Stall</h1>
            <p>Trade Coins for useful adventuring supplies.</p>
          </div>
          <strong className="coin-balance"><CoinVertical size={20} weight="fill" aria-hidden="true" /> {coins} Coins</strong>
        </div>
        <div className="market-items">
          {captureOrbs.map((orb) => {
            const owned = save.inventory[orb.id] ?? 0
            const affordable = coins >= orb.price
            const catchBonus = Math.round((orb.multiplier - 1) * 100)
            return (
              <article key={orb.id} className={`market-item ${orb.id}`}>
                <div className="market-orb" aria-hidden="true">
                  <i className="orb-orbit orb-orbit-back" />
                  <span><CompassRose size={25} weight="regular" /></span>
                  <i className="orb-orbit orb-orbit-front" />
                </div>
                <div>
                  <h2>{orb.name}</h2>
                  <p>{orb.description}</p>
                  <span className="market-catch-power">Catch power {catchBonus > 0 ? `+${catchBonus}%` : '0%'}</span>
                </div>
                <footer>
                  <span>{owned} owned</span>
                  <button
                    type="button"
                    className="primary-button"
                    disabled={!affordable}
                    onClick={() => onBuy(orb.id)}
                  >
                    {affordable ? `Buy · ${orb.price} Coins` : `Need ${orb.price - coins} more`}
                  </button>
                </footer>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
