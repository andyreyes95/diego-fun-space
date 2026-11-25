import type { DragonSpecies, GameSave } from '../../types'
import { typeColors, typeNames } from '../../data'
import { getEvolutionChain } from '../../game/dex'
import { DragonIcon } from '../DragonIcon'

interface DexDetailsPaneProps {
  species: DragonSpecies
  save: GameSave
}

export function DexDetailsPane({ species, save }: DexDetailsPaneProps) {
  const seen = save.seen.includes(species.id)
  const caught = save.caught.includes(species.id)

  if (!seen) {
    return (
      <aside className="dex-detail">
        <DragonIcon species={species} size={220} silhouette />
        <h2>Unknown</h2>
        <p>Explore planets and meet wild dragons to reveal this entry.</p>
      </aside>
    )
  }

  if (!caught) {
    return (
      <aside className="dex-detail">
        <DragonIcon species={species} size={220} silhouette />
        <div className="dex-detail-title">
          <span>#{String(species.dexNo).padStart(3, '0')}</span>
          <h2>{species.name}</h2>
        </div>
        <div className="detail-pills"><span>Seen</span></div>
        <p>You've seen this dragon, but haven't caught it yet. Keep exploring!</p>
      </aside>
    )
  }

  const chain = getEvolutionChain(species.id)

  return (
    <aside className="dex-detail">
      <DragonIcon species={species} size={220} />
      <div className="dex-detail-title">
        <span>#{String(species.dexNo).padStart(3, '0')}</span>
        <h2>{species.name}</h2>
      </div>
      <div className="detail-pills">
        <span style={{ background: typeColors[species.type] }}>{typeNames[species.type]}</span>
        <span>Stage {species.stage}</span>
      </div>
      <p>{species.description}</p>
      <dl>
        <div><dt>Habitat</dt><dd>{species.habitat}</dd></div>
        <div><dt>Height</dt><dd>{species.height}</dd></div>
        <div><dt>Weight</dt><dd>{species.weight}</dd></div>
      </dl>
      <div className="evolution-chain">
        <h3>Evolution chain</h3>
        <div className="evolution-chain-row">
          {chain.map((chainSpecies) => (
            <span
              key={chainSpecies.id}
              className={save.caught.includes(chainSpecies.id) ? 'chain-stage registered' : 'chain-stage'}
            >
              #{chainSpecies.dexNo} · {chainSpecies.name}
              {chainSpecies.evolvesAt ? ` · Lv ${chainSpecies.evolvesAt}` : ''}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
