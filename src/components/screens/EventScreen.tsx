import { speciesById, typeColors, typeNames } from '../../data'
import { DragonIcon } from '../DragonIcon'
import type { BattleEvent } from '../../types'

interface EventScreenProps {
  event: BattleEvent
  currentPlanet: 0 | 1 | 2
  onDismiss: () => void
}

export function EventScreen({ event, currentPlanet, onDismiss }: EventScreenProps) {
  const planetClass = `event-planet-${currentPlanet}`

  if (event.kind === 'evolution') {
    const before = speciesById[event.beforeId]
    const after = speciesById[event.afterId]
    return (
      <main className="celebration-screen evolution-celebration">
        <div className="celebration-rays" aria-hidden="true" />
        <section className="celebration-card" role="dialog" aria-modal="true" aria-labelledby="evolution-title">
          <p className="eyebrow">What a glow-up!</p>
          <h1 id="evolution-title">{before.name} evolved!</h1>
          <div className="evolution-reveal">
            <div className="evolution-before">
              <DragonIcon species={before} size={170} battleMode />
              <strong>{before.name}</strong>
            </div>
            <span className="evolution-arrow" aria-hidden="true">➜</span>
            <div className="evolution-after">
              <DragonIcon species={after} size={210} battleMode />
              <strong>{after.name}</strong>
              <span className="type-pill" style={{ background: typeColors[after.type] }}>{typeNames[after.type]}</span>
            </div>
          </div>
          <p>{after.description}</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Amazing!</button>
        </section>
      </main>
    )
  }

  if (event.kind === 'catch') {
    const caughtSpecies = speciesById[event.speciesId]
    return (
      <main className={`celebration-screen catch-celebration ${planetClass}`}>
        <div className="celebration-rays" aria-hidden="true" />
        <section className="celebration-card catch-card" role="dialog" aria-modal="true" aria-labelledby="catch-title">
          <p className="eyebrow">Gotcha!</p>
          <h1 id="catch-title">{caughtSpecies.name} joined your team!</h1>
          <div className="catch-reveal">
            <div className="catch-sparkles" aria-hidden="true">
              <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
            </div>
            <div className="capture-star" aria-hidden="true">★</div>
            <DragonIcon species={caughtSpecies} size={230} battleMode />
          </div>
          <div className="detail-pills">
            <span style={{ background: typeColors[caughtSpecies.type] }}>{typeNames[caughtSpecies.type]}</span>
            <span>{event.joinedParty ? 'Added to party' : 'Saved to the Dragon Dex'}</span>
          </div>
          <p>{caughtSpecies.description}</p>
          <button className="primary-button" type="button" onClick={onDismiss}>
            {event.joinedParty ? 'Welcome aboard!' : 'See my team'}
          </button>
        </section>
      </main>
    )
  }

  if (event.kind === 'escape') {
    const escapedSpecies = speciesById[event.speciesId]
    return (
      <main className={`celebration-screen escape-event ${planetClass}`}>
        <section className="celebration-card escape-card" role="dialog" aria-modal="true" aria-labelledby="escape-title">
          <p className="eyebrow">It got away!</p>
          <h1 id="escape-title">{escapedSpecies.name} escaped</h1>
          <div className="catch-reveal escape-reveal">
            <span className="escape-motion" aria-hidden="true">···</span>
            <DragonIcon species={escapedSpecies} size={230} battleMode />
          </div>
          <div className="detail-pills">
            <span style={{ background: typeColors[escapedSpecies.type] }}>{typeNames[escapedSpecies.type]}</span>
            <span>{event.attempts} {event.attempts === 1 ? 'catch try' : 'catch tries'}</span>
          </div>
          <p>{escapedSpecies.name} found an opening and darted out of sight. A fresh encounter could give you another chance.</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Back to exploring</button>
        </section>
      </main>
    )
  }

  if (event.kind === 'ambush') {
    return (
      <main className="celebration-screen ambush-event event-planet-dark">
        <div className="ambush-warning" aria-hidden="true">!</div>
        <section className="celebration-card ambush-card" role="dialog" aria-modal="true" aria-labelledby="ambush-title">
          <p className="eyebrow">Dark Gang Ambush</p>
          <h1 id="ambush-title">You've been ambushed!</h1>
          <div className="ambush-emblem" aria-hidden="true">
            <span />
            <strong>✦</strong>
            <span />
          </div>
          <p>{event.captainName} has cornered you during your wild exploration. Defeat the Gang's team to escape safely.</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Face the Dark Gang</button>
        </section>
      </main>
    )
  }

  const badgeName = event.badge === 'Ember' ? 'Ember Badge' : 'Bloom Badge'
  const badgeType = event.badge === 'Ember' ? 'fire' : 'grass'
  return (
    <main className={`celebration-screen badge-celebration ${planetClass}`}>
      <div className="celebration-rays" aria-hidden="true" />
      <section className="celebration-card badge-card" role="dialog" aria-modal="true" aria-labelledby="badge-title">
        <p className="eyebrow">Gym Victory</p>
        <h1 id="badge-title">You defeated {event.badge === 'Ember' ? 'Sol' : 'Moss'}!</h1>
        <div className={`earned-badge ${badgeType}`} aria-label={badgeName}>
          {badgeType === 'fire' ? (
            <>
              <span className="badge-wing left" />
              <span className="badge-gem">✦</span>
              <span className="badge-wing right" />
            </>
          ) : (
            <>
              <span className="badge-leaf left" />
              <span className="badge-gem">♧</span>
              <span className="badge-leaf right" />
            </>
          )}
        </div>
        <h2>{badgeName}</h2>
        <p>{badgeType === 'fire'
          ? 'Emberfall recognizes your courage. Fire dragons will remember your brave start.'
          : 'Mossgrove recognizes your teamwork. The path to the Light dragons is now open.'}</p>
        <button className="primary-button" type="button" onClick={onDismiss}>Add to my badges</button>
      </section>
    </main>
  )
}
