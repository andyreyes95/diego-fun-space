import type { DragonSpecies } from '../../types'
import { typeColors } from '../../data'
import { DragonIcon } from '../DragonIcon'

interface DexTileProps {
  species: DragonSpecies
  seen: boolean
  caught: boolean
  selected: boolean
  onSelect: (speciesId: string) => void
}

export function DexTile({ species, seen, caught, selected, onSelect }: DexTileProps) {
  return (
    <button
      type="button"
      className={['dex-card', selected ? 'selected' : ''].filter(Boolean).join(' ')}
      onClick={() => onSelect(species.id)}
      aria-label={`${species.name}, Dex number ${species.dexNo}`}
    >
      <span className="dex-number">#{String(species.dexNo).padStart(3, '0')}</span>
      {caught ? <DragonIcon species={species} size={100} /> : <DragonIcon species={species} size={100} silhouette />}
      <strong>{species.name}</strong>
      {seen && (
        <small
          className={caught ? 'dex-status-caught' : 'dex-status-seen'}
          style={caught ? { color: typeColors[species.type] } : undefined}
        >
          {caught ? 'Caught' : 'Seen'}
        </small>
      )}
    </button>
  )
}
