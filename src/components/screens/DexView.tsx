import type { DragonType, GameSave } from '../../types'
import { dragonSpecies, speciesById, typeColors, typeNames } from '../../data'
import { DragonIcon } from '../DragonIcon'

interface DexViewProps {
  save: GameSave
  dexFilter: 'all' | DragonType
  dexStatus: 'all' | 'seen' | 'caught'
  selectedDexId: string
  filteredDex: typeof dragonSpecies
  selectedPartyIndex: number
  selectedCaught: boolean
  onFilterChange: (filter: 'all' | DragonType) => void
  onStatusChange: (status: 'all' | 'seen' | 'caught') => void
  onSelect: (speciesId: string) => void
  onToggleTeam: (speciesId: string) => void
}

export function DexView({
  save,
  dexFilter,
  dexStatus,
  selectedDexId,
  filteredDex,
  selectedPartyIndex,
  selectedCaught,
  onFilterChange,
  onStatusChange,
  onSelect,
  onToggleTeam,
}: DexViewProps) {
  const caughtCount = save.caught.length
  const selectedSpecies = speciesById[selectedDexId]

  return (
    <section className="dex-view">
      <div className="dex-heading">
        <div>
          <p className="eyebrow">Dragon Dex</p>
          <h1>Dragon Collection</h1>
        </div>
        <div className="dex-progress">
          <strong>{caughtCount} / 24</strong>
          <span>Caught</span>
        </div>
      </div>
      <div className="dex-controls">
        <div className="filter-row" aria-label="Filter by type">
          {(['all', 'fire', 'water', 'grass', 'ice', 'electric', 'light', 'cloud', 'dark'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              className={dexFilter === filter ? 'filter-button active' : 'filter-button'}
              onClick={() => onFilterChange(filter)}
            >
              {filter === 'all' ? 'All' : typeNames[filter]}
            </button>
          ))}
        </div>
        <select value={dexStatus} onChange={(event) => onStatusChange(event.target.value as 'all' | 'seen' | 'caught')} aria-label="Filter by discovery status">
          <option value="all">All dragons</option>
          <option value="seen">Seen</option>
          <option value="caught">Caught</option>
        </select>
      </div>
      <div className="dex-layout">
        <div className="dex-grid">
          {filteredDex.map((species) => {
            const seen = save.seen.includes(species.id)
            const caught = save.caught.includes(species.id)
            return (
              <button
                type="button"
                key={species.id}
                className={[
                  'dex-card',
                  selectedDexId === species.id ? 'selected' : '',
                  seen ? '' : 'undiscovered',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelect(species.id)}
                aria-label={seen ? `${species.name}, Dex number ${species.dexNo}` : `Undiscovered dragon, Dex number ${species.dexNo}`}
              >
                <span className="dex-number">#{String(species.dexNo).padStart(3, '0')}</span>
                {seen ? <DragonIcon species={species} size={100} /> : <DragonIcon species={species} size={100} silhouette />}
                <strong>{seen ? species.name : 'Unknown'}</strong>
                {seen && <small style={{ color: typeColors[species.type] }}>{caught ? 'Caught' : 'Seen'}</small>}
              </button>
            )
          })}
        </div>
        <aside className="dex-detail">
          {save.seen.includes(selectedDexId) ? (
            <>
              <DragonIcon species={selectedSpecies} size={220} />
              <div className="dex-detail-title">
                <span>#{String(selectedSpecies.dexNo).padStart(3, '0')}</span>
                <h2>{selectedSpecies.name}</h2>
              </div>
              <div className="detail-pills">
                <span style={{ background: typeColors[selectedSpecies.type] }}>{typeNames[selectedSpecies.type]}</span>
                <span>Stage {selectedSpecies.stage}</span>
              </div>
              <div className="dex-party-control">
                <div className="party-slots" aria-label="Battle team slots">
                  {[0, 1, 2, 3].map((slot) => {
                    const dragon = save.party[slot]
                    return (
                      <span key={slot} className={dragon ? 'party-slot filled' : 'party-slot'}>
                        {dragon ? String(speciesById[dragon.speciesId].name).slice(0, 1) : slot + 1}
                      </span>
                    )
                  })}
                </div>
                {selectedCaught && (
                  <button
                    type="button"
                    className={selectedPartyIndex >= 0 ? 'party-toggle remove' : 'party-toggle'}
                    onClick={() => onToggleTeam(selectedDexId)}
                  >
                    {selectedPartyIndex >= 0 ? 'Remove from team' : save.party.length >= 4 ? 'Team full' : 'Add to team'}
                  </button>
                )}
              </div>
              <p>{selectedSpecies.description}</p>
              <dl>
                <div><dt>Habitat</dt><dd>{selectedSpecies.habitat}</dd></div>
                <div><dt>Height</dt><dd>{selectedSpecies.height}</dd></div>
                {selectedSpecies.evolvesTo && (
                  <div><dt>Evolution</dt><dd>Level {selectedSpecies.evolvesAt} · {speciesById[selectedSpecies.evolvesTo].name}</dd></div>
                )}
              </dl>
            </>
          ) : (
            <div className="unknown-detail">
              <DragonIcon species={selectedSpecies} size={220} silhouette />
              <h2>Undiscovered</h2>
              <p>Explore planets and meet wild dragons to reveal this entry.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
