import { useState } from 'react'
import type { GameSave } from '../types'

export interface UnlockOptions {
  gymProgress: GameSave['gymProgress']
  badges: string[]
  allDragons: boolean
  jakeDefeated: boolean
  lightEncountersCaught: boolean
}

interface UnlockScreenProps {
  save: GameSave
  onApply: (options: UnlockOptions) => void
  onClose: () => void
}

const gymTypes = ['fire', 'grass', 'electric', 'cloud', 'water', 'ice', 'dark', 'light'] as const
const gymNames = ['Emberfall', 'Mossgrove', 'Voltspire', 'Cloudrest', 'Tidehaven', 'Frostveil', 'Umbralis', 'Luminara'] as const
const progressLabels = ['No progress', 'Trainer 1 defeated', 'Trainer 2 defeated', 'Leader defeated'] as const

export function UnlockScreen({ save, onApply, onClose }: UnlockScreenProps) {
  const [options, setOptions] = useState<UnlockOptions>({
    gymProgress: { ...save.gymProgress },
    badges: [...save.badges],
    allDragons: false,
    jakeDefeated: save.darkGangDefeated,
    lightEncountersCaught: (save.lightEncountersCaught?.length ?? 0) === 4,
  })

  const toggle = (key: keyof UnlockOptions) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }))
  }

  const setGymProgress = (type: (typeof gymTypes)[number], value: 0 | 1 | 2 | 3) => {
    const badgeNames = ['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide', 'Frost', 'Eclipse', 'Radiant']
    const badge = badgeNames[gymTypes.indexOf(type)]
    setOptions((current) => ({
      ...current,
      gymProgress: { ...current.gymProgress, [type]: value === 3 ? 2 : value },
      badges: value === 3
        ? [...new Set([...current.badges, badge])]
        : current.badges.filter((currentBadge) => currentBadge !== badge),
    }))
  }

  return (
    <div className="unlock-overlay" role="presentation">
      <section className="unlock-card" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
        <p className="eyebrow">Local debug tools</p>
        <h1 id="unlock-title">Choose what to unlock</h1>
        <p>Only selected progress is changed. Unchecked story state stays exactly as it is.</p>
        <div className="unlock-options">
          <label>
            <input type="checkbox" checked={options.allDragons} onChange={() => toggle('allDragons')} />
            <span><strong>All Dragon species</strong><small>Add every dragon to the Dex and owned reserve.</small></span>
          </label>
          <label>
            <input type="checkbox" checked={options.jakeDefeated} onChange={() => toggle('jakeDefeated')} />
            <span><strong>Jake defeated</strong><small>Toggle off to make Jake's fortress battle available again.</small></span>
          </label>
          <label>
            <input type="checkbox" checked={options.lightEncountersCaught} onChange={() => toggle('lightEncountersCaught')} />
            <span><strong>Complete Light encounters</strong><small>Prevent the four rare encounter checks from appearing.</small></span>
          </label>
        </div>
        <div className="unlock-gym-list">
          {gymTypes.map((type, index) => {
            const progress = options.gymProgress[type]
            const sliderValue = progress === 2
              ? (options.badges.includes(['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide', 'Frost', 'Eclipse', 'Radiant'][index]) ? 3 : 2)
              : progress
            return (
              <label className="unlock-gym-slider" key={type}>
                <span><strong>{gymNames[index]}</strong><small>{progressLabels[sliderValue]}</small></span>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={sliderValue}
                  onChange={(event) => setGymProgress(type, Number(event.target.value) as 0 | 1 | 2 | 3)}
                  aria-label={`${gymNames[index]} gym progress`}
                />
              </label>
            )
          })}
        </div>
        <div className="unlock-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="button" onClick={() => onApply(options)}>Apply selected</button>
        </div>
      </section>
    </div>
  )
}
