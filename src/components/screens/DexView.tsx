import { useMemo, useState } from 'react'
import type { DragonType, GameSave } from '../../types'
import { dragonSpecies, speciesById, typeNames } from '../../data'
import { sortDexSpecies, type DexSortKey, type SortDirection } from '../../game/sorting'
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
  const [dexSort, setDexSort] = useState<DexSortKey>('dexNo')
  const [dexSortDirection, setDexSortDirection] = useState<SortDirection>('asc')
  const sortedDex = useMemo(
    () => sortDexSpecies(filteredDex, dexSort, dexSortDirection),
    [filteredDex, dexSort, dexSortDirection],
  )

  return (
    <section className="dex-view">
      <div className="dex-heading">
        <div>
          <p className="eyebrow">Dragon Dex</p>
          <h1>Dragon Collection</h1>
        </div>
        <div className="dex-progress">
          <strong>{caughtCount} / 120</strong>
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
        <div className="tile-sort-controls">
          <label htmlFor="dex-sort">Sort</label>
          <select
            id="dex-sort"
            value={dexSort}
            onChange={(event) => setDexSort(event.target.value as DexSortKey)}
            aria-label="Sort Dex tiles"
          >
            <option value="dexNo">Dex number</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="stage">Stage</option>
            <option value="habitat">Habitat</option>
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>
          <button
            type="button"
            className="tile-sort-button"
            onClick={() => setDexSortDirection((current) => current === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${dexSortDirection === 'asc' ? 'descending' : 'ascending'}`}
            title={dexSortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {dexSortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <div className="dex-layout">
        <div className="dex-grid">
          {sortedDex.map((species) => {
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
