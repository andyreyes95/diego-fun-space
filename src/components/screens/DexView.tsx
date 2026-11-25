import type { DragonType, GameSave } from '../../types'
import { dragonSpecies, speciesById, typeNames } from '../../data'
import { DexTile } from '../dex/DexTile'
import { DexDetailsPane } from '../dex/DexDetailsPane'

interface DexViewProps {
  save: GameSave
  dexFilter: 'all' | DragonType
  dexStatus: 'all' | 'seen' | 'caught'
  selectedDexId: string
  filteredDex: typeof dragonSpecies
  onFilterChange: (filter: 'all' | DragonType) => void
  onStatusChange: (status: 'all' | 'seen' | 'caught') => void
  onSelect: (speciesId: string) => void
}

export function DexView({
  save,
  dexFilter,
  dexStatus,
  selectedDexId,
  filteredDex,
  onFilterChange,
  onStatusChange,
  onSelect,
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
          <option value="seen">Seen only</option>
          <option value="caught">Caught / registered</option>
        </select>
      </div>
      <div className="dex-layout">
        <div className="dex-grid">
          {filteredDex.map((species) => {
            const seen = save.seen.includes(species.id)
            const caught = save.caught.includes(species.id)
            if (!seen) return null
            return (
              <DexTile
                key={species.id}
                species={species}
                seen={seen}
                caught={caught}
                selected={selectedDexId === species.id}
                onSelect={onSelect}
              />
            )
          })}
        </div>
        <DexDetailsPane species={selectedSpecies} save={save} />
      </div>
    </section>
  )
}
