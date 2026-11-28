import { speciesById, typeColors, typeNames } from '../../data'
import { DragonIcon } from '../DragonIcon'
import { BadgeIcon } from '../BadgeIcon'
import type { BattleEvent } from '../../types'

interface EventScreenProps {
  event: BattleEvent
  currentPlanet: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  onDismiss: () => void
}

export function EventScreen({ event, currentPlanet, onDismiss }: EventScreenProps) {
  const planetClass = `event-planet-${currentPlanet}`

  if (event.kind === 'legendaryReveal') {
    return (
      <main className="celebration-screen legendary-reveal-screen event-planet-8">
        <div className="celebration-rays" aria-hidden="true" />
        <section className="celebration-card legendary-reveal-card" role="dialog" aria-modal="true" aria-labelledby="legendary-reveal-title">
          <p className="eyebrow">One final quest</p>
          <h1 id="legendary-reveal-title">Four legends await</h1>
          <div className="legendary-silhouettes" aria-hidden="true">
            <span>?</span><span>?</span><span>?</span><span>?</span>
          </div>
          <p>Auriel reveals a final truth: Champion Mark will face you only after you capture the four legendary Dragons. Their names and hiding places remain unknown—continue exploring the Starcrest System.</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Begin the legendary quest</button>
        </section>
      </main>
    )
  }

  if (event.kind === 'legendaryEncounter') {
    const species = speciesById[event.speciesId]
    return (
      <main className={`celebration-screen legendary-encounter-screen ${planetClass}`}>
        <div className="celebration-rays" aria-hidden="true" />
        <section className="celebration-card" role="dialog" aria-modal="true" aria-labelledby="legendary-encounter-title">
          <p className="eyebrow">Legendary Dragon discovered</p>
          <h1 id="legendary-encounter-title">{species.name}</h1>
          <div className="catch-reveal">
            <DragonIcon species={species} size={240} battleMode />
          </div>
          <div className="detail-pills">
            <span style={{ background: typeColors[species.type] }}>{typeNames[species.type]}</span>
            <span>Legendary</span>
          </div>
          <p>{species.description} It will not faint, but it may escape if the capture fails.</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Face the legend</button>
        </section>
      </main>
    )
  }

  if (event.kind === 'lightEncounter') {
    const species = speciesById[event.speciesId]
    return (
      <main className={`celebration-screen catch-celebration ${planetClass}`}>
        <div className="celebration-rays" aria-hidden="true" />
        <section className="celebration-card catch-card" role="dialog" aria-modal="true" aria-labelledby="light-encounter-title">
          <p className="eyebrow">A rare Light Dragon appears</p>
          <h1 id="light-encounter-title">A radiant presence emerges…</h1>
          <div className="catch-reveal">
            <div className="catch-sparkles" aria-hidden="true">
              <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
            </div>
            <DragonIcon species={species} size={230} battleMode />
          </div>
          <div className="detail-pills">
            <span style={{ background: typeColors.light }}>{typeNames.light}</span>
            <span>Story encounter</span>
          </div>
          <p>{species.name}, a mysterious Light dragon rarely seen on this planet, has chosen to reveal itself. It will not faint—earn its trust by weakening it, then catch it.</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Face {species.name}</button>
        </section>
      </main>
    )
  }

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

  if (event.kind === 'jakeVictory') {
    return (
      <main className="celebration-screen jake-victory-celebration event-planet-7">
        <div className="jake-victory-rays" aria-hidden="true" />
        <section className="celebration-card jake-victory-card" role="dialog" aria-modal="true" aria-labelledby="jake-victory-title">
          <p className="eyebrow">Dark Gang defeated</p>
          <h1 id="jake-victory-title">Jake's shadow has fallen!</h1>
          <div className="jake-victory-reveal">
            <img src="/assets/map-locations/umbralis/jake-fortress.png" alt="" />
            <span className="jake-victory-seal"><BadgeIcon type="dark" size={64} /></span>
          </div>
          <h2>The Dark Gang is over</h2>
          <p>Jake's strongest dragons could not stop you. Umbralis is free from the gang at last—and one major obstacle between you and Champion Mark is gone.</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Restore peace to Umbralis</button>
        </section>
      </main>
    )
  }

  if (event.kind === 'jakeReveal') {
    return (
      <main className="celebration-screen jake-reveal-celebration event-planet-7">
        <section className="celebration-card ambush-card jake-reveal-card" role="dialog" aria-modal="true" aria-labelledby="jake-reveal-title">
          <p className="eyebrow">A hidden threat</p>
          <h1 id="jake-reveal-title">The fortress awakens</h1>
          <div className="jake-reveal-art">
            <img src="/assets/map-locations/umbralis/jake-fortress.png" alt="" />
          </div>
          <p>The Eclipse Badge opens the way, but your journey is not finished on Umbralis. Jake, leader of the Dark Gang, is waiting in the fortress above. Defeat him before continuing toward Luminara.</p>
          <button className="primary-button" type="button" onClick={onDismiss}>Find Jake's fortress</button>
        </section>
      </main>
    )
  }

  if (event.kind === 'ambush') {
    return (
      <main className="celebration-screen ambush-event event-planet-dark">
        <div className="ambush-warning" aria-hidden="true">!</div>
        <section className="celebration-card ambush-card" role="dialog" aria-modal="true" aria-labelledby="ambush-title">
          <p className="eyebrow">{event.fortress ? 'Dark Gang Fortress' : 'Dark Gang Ambush'}</p>
          <h1 id="ambush-title">{event.fortress ? 'Jake awaits inside' : "You've been ambushed!"}</h1>
          <div className="ambush-emblem" aria-hidden="true">
            <span />
            <strong>✦</strong>
            <span />
          </div>
          <p>{event.fortress
            ? 'With the Eclipse Badge earned, the fortress gates open. Defeat Jake and end the Dark Gang’s threat to Umbralis.'
            : `${event.captainName} has cornered you during your wild exploration. Defeat the Gang's team to escape safely.`}</p>
          <button className="primary-button" type="button" onClick={onDismiss}>{event.fortress ? 'Challenge Jake' : 'Face the Dark Gang'}</button>
        </section>
      </main>
    )
  }

  const badgeName = event.badge === 'Ember' ? 'Ember Badge' : event.badge === 'Bloom' ? 'Bloom Badge' : event.badge === 'Spark' ? 'Spark Badge' : event.badge === 'Breeze' ? 'Breeze Badge' : event.badge === 'Tide' ? 'Tide Badge' : event.badge === 'Frost' ? 'Frost Badge' : event.badge === 'Eclipse' ? 'Eclipse Badge' : 'Radiant Badge'
  const badgeType = event.badge === 'Ember' ? 'fire' : event.badge === 'Bloom' ? 'grass' : event.badge === 'Spark' ? 'electric' : event.badge === 'Breeze' ? 'cloud' : event.badge === 'Tide' ? 'water' : event.badge === 'Frost' ? 'ice' : event.badge === 'Eclipse' ? 'dark' : 'light'
  return (
    <main className={`celebration-screen badge-celebration ${planetClass}`}>
      <div className="celebration-rays" aria-hidden="true" />
      <section className="celebration-card badge-card" role="dialog" aria-modal="true" aria-labelledby="badge-title">
        <p className="eyebrow">Gym Victory</p>
        <h1 id="badge-title">You defeated {event.badge === 'Ember' ? 'Sol' : event.badge === 'Bloom' ? 'Moss' : event.badge === 'Spark' ? 'Volt' : event.badge === 'Breeze' ? 'Cirrus' : event.badge === 'Tide' ? 'Marina' : event.badge === 'Frost' ? 'Glacia' : event.badge === 'Eclipse' ? 'Nyx' : 'Auriel'}!</h1>
        <div className={`earned-badge ${badgeType}`} aria-label={badgeName}>
          {badgeType === 'fire' ? (
            <>
              <span className="badge-wing left" />
              <span className="badge-gem"><BadgeIcon type="fire" size={46} /></span>
              <span className="badge-wing right" />
            </>
          ) : badgeType === 'grass' ? (
            <>
              <span className="badge-leaf left" />
              <span className="badge-gem"><BadgeIcon type="grass" size={42} /></span>
              <span className="badge-leaf right" />
            </>
          ) : badgeType === 'electric' ? (
            <span className="badge-bolt"><BadgeIcon type="electric" size={48} /></span>
          ) : badgeType === 'cloud' ? (
            <span className="badge-cloud"><BadgeIcon type="cloud" size={50} /></span>
          ) : badgeType === 'water' ? (
            <span className="badge-wave"><BadgeIcon type="water" size={47} /></span>
          ) : badgeType === 'ice' ? (
            <span className="badge-snowflake"><BadgeIcon type="ice" size={48} /></span>
          ) : badgeType === 'dark' ? (
            <span className="badge-eclipse"><BadgeIcon type="dark" size={46} /></span>
          ) : (
            <span className="badge-radiant"><BadgeIcon type="light" size={48} /></span>
          )}
        </div>
        <h2>{badgeName}</h2>
        <p>{badgeType === 'fire'
          ? 'Emberfall recognizes your courage. Fire dragons will remember your brave start.'
          : badgeType === 'grass'
            ? 'Mossgrove recognizes your teamwork. Voltspire is now visible in the Starcrest System.'
            : badgeType === 'electric'
              ? 'Voltspire recognizes your precision. Cloudrest now rises into view.'
              : badgeType === 'cloud'
                ? 'Cloudrest recognizes your adaptability. Tidehaven is now visible in the Starcrest System.'
                : badgeType === 'water'
                  ? 'Tidehaven recognizes your resolve. Frostveil now glows beneath the aurora.'
                  : badgeType === 'ice'
                    ? 'Frostveil recognizes your calm under pressure. Umbralis now appears beyond the moonlit route.'
                    : badgeType === 'dark'
                      ? 'Umbralis recognizes your courage in the dark. Luminara now shines in the Starcrest System.'
                      : 'Luminara recognizes your compassion. The path to the champion can finally begin.'}</p>
        <button className="primary-button" type="button" onClick={onDismiss}>Add to my badges</button>
      </section>
    </main>
  )
}
