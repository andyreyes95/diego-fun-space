import { speciesById, typeColors, typeNames } from '../../data'
import { DragonIcon } from '../DragonIcon'

export type Celebration =
  | { kind: 'evolution'; beforeId: string; afterId: string }
  | { kind: 'badge'; badge: 'Ember' | 'Bloom' }
  | { kind: 'catch'; speciesId: string; joinedParty: boolean }

interface CelebrationScreenProps {
  celebration: Celebration
  onDismiss: () => void
}

export function CelebrationScreen({ celebration, onDismiss }: CelebrationScreenProps) {
  if (celebration.kind === 'evolution') {
    const before = speciesById[celebration.beforeId]
    const after = speciesById[celebration.afterId]
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

  if (celebration.kind === 'catch') {
    const caughtSpecies = speciesById[celebration.speciesId]
    return (
      <main className="celebration-screen catch-celebration">
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
            <span>{celebration.joinedParty ? 'Added to party' : 'Saved to the Dragon Dex'}</span>
          </div>
          <p>{caughtSpecies.description}</p>
          <button className="primary-button" type="button" onClick={onDismiss}>
            {celebration.joinedParty ? 'Welcome aboard!' : 'See my team'}
          </button>
        </section>
      </main>
    )
  }

  const badgeName = celebration.badge === 'Ember' ? 'Ember Badge' : 'Bloom Badge'
  const badgeType = celebration.badge === 'Ember' ? 'fire' : 'grass'
  return (
    <main className="celebration-screen badge-celebration">
      <div className="celebration-rays" aria-hidden="true" />
      <section className="celebration-card badge-card" role="dialog" aria-modal="true" aria-labelledby="badge-title">
        <p className="eyebrow">Gym Victory</p>
        <h1 id="badge-title">You defeated {celebration.badge === 'Ember' ? 'Sol' : 'Moss'}!</h1>
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
