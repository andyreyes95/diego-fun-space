import type { BattleState, DragonInstance, GameSave } from '../../types'
import { useEffect, useRef } from 'react'
import { speciesById, typeColors, typeNames } from '../../data'
import type { Move } from '../../types'
import { DragonIcon } from '../DragonIcon'
import { DragonName } from '../DragonName'
import { HealthBar, XpBar } from '../StatusBars'

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
}: BattleScreenProps) {
  const logRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [battle.log.length])

  const activeSpecies = speciesById[active.speciesId]
  const enemySpecies = speciesById[battle.enemy.speciesId]
  const fixedBattleVariant = battle.kind === 'gang'
    ? 'fixed-gang-dark'
    : battle.kind === 'fireGym'
      ? 'fixed-gym-emberfall'
      : battle.kind === 'grassGym'
        ? 'fixed-gym-mossgrove'
        : save.currentPlanet === 2
          ? 'fixed-wild-mossgrove'
          : 'fixed-wild-emberfall'
  const battleBackgroundClass = battle.kind === 'gang'
    ? 'battle-gang-dark'
    : battle.kind === 'fireGym'
      ? 'battle-gym-emberfall'
      : battle.kind === 'grassGym'
        ? 'battle-gym-mossgrove'
        : save.currentPlanet === 2
          ? 'battle-wild-mossgrove'
          : 'battle-wild-emberfall'

  return (
    <main className={`${screenShake ? 'battle-screen shake' : 'battle-screen'} ${battleBackgroundClass} fixed-battle`}>
      <header className="battle-header">
        <button className="icon-button" type="button" onClick={onRun} aria-label="Leave battle">×</button>
        <div>
          <span>{battle.enemyName} Battle</span>
          {battle.kind !== 'wild' && <strong>{battle.kind === 'gang' ? 'Dark Gang' : battle.trainerPhase === 2 ? 'Gym Leader' : `Gym Trainer ${(battle.trainerPhase ?? 0) + 1}`}</strong>}
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
              {battle.kind === 'wild' && (
                <button type="button" className="capture-button" onClick={onTryCapture} disabled={busy}>Catch</button>
              )}
              <button type="button" className="run-button" onClick={onRun} disabled={busy}>Run</button>
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
    </main>
  )
}
