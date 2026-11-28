import { CoinVertical, FirstAidIcon, PlanetIcon } from '@phosphor-icons/react'
import type { DragonType } from '../types'
import { typeColors } from '../data'
import { BadgeIcon } from './BadgeIcon'
import { useState } from 'react'
import type { DragonInstance } from '../types'
import { speciesById } from '../data'
import { DragonName } from './DragonName'
import { HEALING_COST_PER_DRAGON } from '../game/economy'

interface CostConfirmDialogProps {
  kind: 'heal' | 'gym' | 'travel'
  battleKind?: 'fireGym' | 'grassGym' | 'electricGym' | 'cloudGym' | 'waterGym' | 'iceGym' | 'darkGym' | 'lightGym'
  cost: number
  balance: number
  party?: DragonInstance[]
  onConfirm: (selectedHealingIds?: string[]) => void
  onCancel: () => void
}

const gymTypes: Record<NonNullable<CostConfirmDialogProps['battleKind']>, DragonType> = {
  fireGym: 'fire',
  grassGym: 'grass',
  electricGym: 'electric',
  cloudGym: 'cloud',
  waterGym: 'water',
  iceGym: 'ice',
  darkGym: 'dark',
  lightGym: 'light',
}

export function CostConfirmDialog({ kind, battleKind, cost, balance, party = [], onConfirm, onCancel }: CostConfirmDialogProps) {
  const isHealing = kind === 'heal'
  const isTravel = kind === 'travel'
  const [selectedHealingIds, setSelectedHealingIds] = useState<string[]>(
    party.filter((dragon) => dragon.hp < dragon.maxHp).map((dragon) => dragon.instanceId),
  )
  const effectiveCost = isHealing ? selectedHealingIds.length * HEALING_COST_PER_DRAGON : cost
  const affordable = isHealing ? selectedHealingIds.length > 0 : balance >= cost
  const balanceAfter = balance - effectiveCost

  return (
    <div className="cost-dialog-overlay">
      <section className="cost-dialog celebration-card" role="dialog" aria-modal="true" aria-labelledby="cost-dialog-title">
        <div
          className={`cost-dialog-icon ${isHealing ? 'healing' : isTravel ? 'travel' : `badge-${battleKind ? gymTypes[battleKind] : 'fire'}`}`}
          style={!isHealing && !isTravel && battleKind ? { '--badge-dialog-color': typeColors[gymTypes[battleKind]] } as React.CSSProperties : undefined}
          aria-hidden="true"
        >
          {          isHealing
            ? <FirstAidIcon size={42} weight="duotone" />
            : isTravel
              ? <PlanetIcon size={42} weight="duotone" />
              : battleKind && <BadgeIcon type={gymTypes[battleKind]} size={42} />}
        </div>
        <p className="eyebrow">{isHealing ? 'Healing Center' : isTravel ? 'Planet Portal' : 'Gym Entrance'}</p>
        <h2 id="cost-dialog-title">{isHealing ? 'Rest your team?' : isTravel ? 'Travel to this planet?' : 'Enter the gym battle?'}</h2>
        <p>
          {isHealing
            ? 'Choose injured Party members to restore to full health.'
            : isTravel
              ? 'The portal fare is paid once before traveling.'
              : 'The entry fee is paid before this battle begins.'}
        </p>
        {isHealing && (
          <div className="healing-party-list">
            {party.map((dragon) => {
              const injured = dragon.hp < dragon.maxHp
              const selected = selectedHealingIds.includes(dragon.instanceId)
              return (
                <button
                  key={dragon.instanceId}
                  type="button"
                  className={selected ? 'healing-party-option selected' : 'healing-party-option'}
                  onClick={() => setSelectedHealingIds((current) => current.includes(dragon.instanceId)
                    ? current.filter((id) => id !== dragon.instanceId)
                    : [...current, dragon.instanceId])}
                  disabled={!injured}
                  aria-pressed={selected}
                >
                  <span className="healing-party-name">
                    <strong><DragonName species={speciesById[dragon.speciesId]} nickname={dragon.nickname} /></strong>
                    <small>{dragon.hp}/{dragon.maxHp} HP</small>
                  </span>
                  <span>{injured ? `${HEALING_COST_PER_DRAGON} Coins` : 'Full health'}</span>
                </button>
              )
            })}
          </div>
        )}
        <div className="cost-dialog-price">
          <span><CoinVertical size={20} weight="fill" aria-hidden="true" /> {effectiveCost} Coins</span>
          <small>{balance} Coins available</small>
        </div>
        {isHealing && balanceAfter < 0 && (
          <p className="cost-dialog-warning">Emergency loan: your balance will be {balanceAfter} Coins. Earn Coins before making purchases or entering a gym.</p>
        )}
        {!affordable && <p className="cost-dialog-warning">You need {cost - balance} more Coins.</p>}
        <div className="cost-dialog-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>Not now</button>
          <button type="button" className="primary-button" onClick={() => onConfirm(isHealing ? selectedHealingIds : undefined)} disabled={!affordable}>
            {isHealing ? 'Heal team' : isTravel ? 'Use portal' : 'Enter battle'}
          </button>
        </div>
      </section>
    </div>
  )
}
