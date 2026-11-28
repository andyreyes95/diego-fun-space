import type { BattleState, DragonInstance, GameSave } from '../../types'
import { useEffect, useRef, useState } from 'react'
import { speciesById, typeColors, typeNames } from '../../data'
import type { Move } from '../../types'
import { DragonIcon } from '../DragonIcon'
import { DragonName } from '../DragonName'
import { HealthBar, XpBar } from '../StatusBars'
import { captureOrbs, type CaptureOrbId } from '../../game/economy'
import { CompassRose } from '@phosphor-icons/react'

function GenericDragonIcon() {
  return (
    <img
      className="generic-dragon-icon"
      src={`${import.meta.env.BASE_URL}assets/dragons/dragon-001.png`}
      width={28}
      height={28}
      alt=""
    />
  )
}

interface BattleScreenProps {
  save: GameSave
  battle: BattleState
  active: DragonInstance
  activePartyIndex: number
  screenShake: boolean
  busy: boolean
  onUseMove: (move: Move) => void
  onTryCapture: () => void
  onRun: () => void
  onSwitch: (index: number) => void
  selectedOrb: CaptureOrbId | ''
  onSelectOrb: (orbId: CaptureOrbId | '') => void
  toast: string
}

export function BattleScreen({
  save,
  battle,
  active,
  activePartyIndex,
  screenShake,
  busy,
  onUseMove,
  onTryCapture,
  onRun,
  onSwitch,
  selectedOrb,
  onSelectOrb,
  toast,
}: BattleScreenProps) {
  const [orbPickerOpen, setOrbPickerOpen] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [battle.log.length])

  const activeSpecies = speciesById[active.speciesId]
  const enemySpecies = speciesById[battle.enemy.speciesId]
  const fixedBattleVariant = battle.kind === 'gang' || battle.kind === 'jakeBoss'
    ? 'fixed-gang-dark'
    : battle.kind === 'fireGym'
      ? 'fixed-gym-emberfall'
      : battle.kind === 'grassGym'
        ? 'fixed-gym-mossgrove'
        : battle.kind === 'electricGym'
          ? 'fixed-gym-voltspire'
            : battle.kind === 'cloudGym'
              ? 'fixed-gym-cloudrest'
              : battle.kind === 'waterGym'
                ? 'fixed-gym-tidehaven'
                : battle.kind === 'iceGym'
                  ? 'fixed-gym-frostveil'
                  : battle.kind === 'darkGym'
                    ? 'fixed-gym-umbralis'
                    : battle.kind === 'lightGym'
                      ? 'fixed-gym-luminara'
              : save.currentPlanet === 1
                ? 'fixed-wild-emberfall'
                : save.currentPlanet === 2
                  ? 'fixed-wild-mossgrove'
                  : save.currentPlanet === 3
                    ? 'fixed-wild-voltspire'
                    : save.currentPlanet === 4
                      ? 'fixed-wild-cloudrest'
                      : save.currentPlanet === 5
                        ? 'fixed-wild-tidehaven'
                        : save.currentPlanet === 6
                          ? 'fixed-wild-frostveil'
                          : save.currentPlanet === 7
                            ? 'fixed-wild-umbralis'
                            : 'fixed-wild-luminara'
  const battleBackgroundClass = battle.kind === 'gang' || battle.kind === 'jakeBoss'
    ? 'battle-gang-dark'
    : battle.kind === 'fireGym'
      ? 'battle-gym-emberfall'
      : battle.kind === 'grassGym'
        ? 'battle-gym-mossgrove'
        : battle.kind === 'electricGym'
          ? 'battle-gym-voltspire'
            : battle.kind === 'cloudGym'
              ? 'battle-gym-cloudrest'
              : battle.kind === 'waterGym'
                ? 'battle-gym-tidehaven'
                : battle.kind === 'iceGym'
                  ? 'battle-gym-frostveil'
                  : battle.kind === 'darkGym'
                    ? 'battle-gym-umbralis'
                    : battle.kind === 'lightGym'
                      ? 'battle-gym-luminara'
              : save.currentPlanet === 1
                ? 'battle-wild-emberfall'
                : save.currentPlanet === 2
                  ? 'battle-wild-mossgrove'
                  : save.currentPlanet === 3
                    ? 'battle-wild-voltspire'
                    : save.currentPlanet === 4
                      ? 'battle-wild-cloudrest'
                      : save.currentPlanet === 5
                        ? 'battle-wild-tidehaven'
                        : save.currentPlanet === 6
                          ? 'battle-wild-frostveil'
                          : save.currentPlanet === 7
                            ? 'battle-wild-umbralis'
                            : 'battle-wild-luminara'

  return (
    <main className={`${screenShake ? 'battle-screen shake' : 'battle-screen'} ${battleBackgroundClass} fixed-battle`}>
      <header className="battle-header">
        {battle.kind !== 'gang' && (
          <button className="icon-button" type="button" onClick={onRun} aria-label="Leave battle">×</button>
        )}
        <div>
          <span>{battle.kind === 'legendaryEncounter' ? 'Legendary Dragon Encounter' : battle.kind === 'lightEncounter' ? 'Rare Light Encounter' : `${battle.enemyName} Battle`}</span>
          {battle.kind !== 'wild' && battle.kind !== 'lightEncounter' && battle.kind !== 'legendaryEncounter' && <strong>{battle.kind === 'jakeBoss' ? 'Dark Gang Fortress' : battle.kind === 'gang' ? 'Dark Gang' : battle.trainerPhase === 2 ? 'Gym Leader' : `Gym Trainer ${(battle.trainerPhase ?? 0) + 1}`}</strong>}
        </div>
      </header>
      <section className="battle-arena fixed-battle-arena">
        <div className={`battle-stage fixed-battle-stage ${fixedBattleVariant}`}>
          <span className="battle-platform enemy-platform" aria-hidden="true" />
          <span className="battle-platform player-platform" aria-hidden="true" />
          <div className="enemy-side">
            <div className="battle-status enemy-status">
              <strong>{enemySpecies.name}</strong>
              <span>Lv. {battle.enemy.level}</span>
              <HealthBar current={battle.enemy.hp} max={battle.enemy.maxHp} />
              {battle.kind !== 'wild' && battle.enemyTeam.length > 1 ? (
                <div className="enemy-team-strip" aria-label="Opponent team">
                  {battle.enemyTeam
                    .map((dragon, index) => ({ dragon, index }))
                    .filter(({ dragon }) => dragon.hp > 0)
                    .map(({ dragon, index }) => {
                      return (
                        <span
                          key={`${dragon.instanceId}-${index}`}
                          className={index === battle.enemyActiveIndex ? 'enemy-team-slot active' : 'enemy-team-slot'}
                        >
                          <GenericDragonIcon />
                        </span>
                      )
                    })}
                </div>
              ) : null}
            </div>
            <DragonIcon species={enemySpecies} size={210} battleMode />
          </div>
          <div className="player-side">
            <DragonIcon species={activeSpecies} size={210} battleMode />
            <div className="battle-status player-status">
              <strong>
                <DragonName species={activeSpecies} nickname={active.nickname} />
              </strong>
              <span>Lv. {active.level}</span>
              <HealthBar current={active.hp} max={active.maxHp} />
              <XpBar xp={active.xp} level={active.level} />
            </div>
          </div>
        </div>
      </section>
      <section className="battle-console">
        <div ref={logRef} className="battle-log" aria-live="polite">
          {battle.log.map((entry, index) => (
            <p key={`${entry.text}-${index}`} className={`log-entry log-${entry.side}`}>
              <span className="log-side-label">
                {entry.side === 'player' ? 'You' : entry.side === 'opponent' ? 'Opponent' : 'Battle'}
              </span>
              {entry.text}
            </p>
          ))}
        </div>
        {battle.finished ? (
          <div className="battle-actions">
            <button className="primary-button" type="button" onClick={onRun}>
              {battle.won ? 'Continue' : 'Return'}
            </button>
          </div>
        ) : (
          <div className="battle-controls">
            <div className="battle-actions">
              {active.moves.map((move) => (
                <button key={move.name} type="button" className="move-button" onClick={() => onUseMove(move)} disabled={busy}>
                  <span>{move.name}</span>
                  <small style={{ color: typeColors[move.type] }}>{typeNames[move.type]} · {move.power} power</small>
                </button>
              ))}
              {(battle.kind === 'wild' || battle.kind === 'lightEncounter' || battle.kind === 'legendaryEncounter') && (
                <div className="capture-controls">
                  <button
                    className="capture-orb-button"
                    type="button"
                    onClick={() => setOrbPickerOpen(true)}
                    disabled={busy}
                    aria-haspopup="dialog"
                  >
                    <span>{selectedOrb ? captureOrbs.find((orb) => orb.id === selectedOrb)?.name : 'Choose an orb'}</span>
                    <small>{selectedOrb ? `${save.inventory[selectedOrb] ?? 0} owned` : 'Open orb bag'}</small>
                  </button>
                  <button
                    type="button"
                    className="capture-button"
                    onClick={onTryCapture}
                    disabled={busy || (battle.kind === 'wild' && battle.catchAttempts >= 3)}
                    aria-disabled={selectedOrb === '' || !save.inventory[selectedOrb]}
                  >
                    {battle.kind === 'lightEncounter' ? 'Catch' : `Catch · ${3 - battle.catchAttempts} left`}
                  </button>
                </div>
              )}
              {battle.kind !== 'jakeBoss' && (
                <button type="button" className="run-button" onClick={onRun} disabled={busy}>
                  {battle.kind === 'gang' ? 'Run · 10 Coins' : 'Run'}
                </button>
              )}
            </div>
            <div className="team-switcher" aria-label="Switch active dragon">
              {save.party.map((dragon, index) => {
                const species = speciesById[dragon.speciesId]
                return (
                  <button
                    key={`${dragon.speciesId}-${index}`}
                    type="button"
                    className={index === activePartyIndex ? 'team-slot active' : dragon.hp <= 0 ? 'team-slot fainted' : 'team-slot'}
                    onClick={() => onSwitch(index)}
                    disabled={battle.finished || dragon.hp <= 0 || busy}
                  >
                    <span className="team-slot-dot" style={{ background: typeColors[species.type] }} />
                    <strong>
                      <DragonName species={species} nickname={dragon.nickname} />
                    </strong>
                    <small>{dragon.hp}/{dragon.maxHp}</small>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </section>
      {orbPickerOpen && (
        <div className="orb-picker-overlay">
          <section className="orb-picker-dialog celebration-card" role="dialog" aria-modal="true" aria-labelledby="orb-picker-title">
            <button className="orb-picker-close icon-button" type="button" onClick={() => setOrbPickerOpen(false)} aria-label="Close orb bag">×</button>
            <p className="eyebrow">Orb Bag</p>
            <h2 id="orb-picker-title">Choose a capture orb</h2>
            <div className="orb-picker-list">
              {captureOrbs.filter((orb) => (save.inventory[orb.id] ?? 0) > 0).map((orb) => (
                <button
                  key={orb.id}
                  type="button"
                  className={`market-item orb-picker-option ${orb.id} ${selectedOrb === orb.id ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectOrb(orb.id)
                    setOrbPickerOpen(false)
                  }}
                >
                  <div className="market-orb" aria-hidden="true">
                    <i className="orb-orbit orb-orbit-back" />
                    <span className="orb-picker-compass"><CompassRose size={16} weight="regular" /></span>
                    <i className="orb-orbit orb-orbit-front" />
                  </div>
                  <span className="orb-picker-copy">
                    <strong>{orb.name}</strong>
                    <small>{orb.multiplier === 1 ? 'Standard catch power' : `+${Math.round((orb.multiplier - 1) * 100)}% catch power`}</small>
                  </span>
                  <b>{save.inventory[orb.id]} owned</b>
                </button>
              ))}
              {captureOrbs.every((orb) => !save.inventory[orb.id]) && (
                <p className="orb-picker-empty">Your orb bag is empty. Visit a market to buy more.</p>
              )}
            </div>
          </section>
        </div>
      )}
      {toast && <div className="toast battle-toast" role="status">{toast}</div>}
    </main>
  )
}
