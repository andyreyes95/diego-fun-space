import type { DragonInstance } from '../../types'
import { speciesById, typeColors } from '../../data'
import { DragonIcon } from '../DragonIcon'
import { DragonName } from '../DragonName'

interface TeamTileProps {
  dragon: DragonInstance
  location: 'Party' | 'Reserve'
  active: boolean
  onSelect: (instanceId: string) => void
}

export function TeamTile({ dragon, location, active, onSelect }: TeamTileProps) {
  const species = speciesById[dragon.speciesId]
  return (
    <button
      type="button"
      className={active ? 'owned-copy-tile active' : 'owned-copy-tile'}
      onClick={() => onSelect(dragon.instanceId)}
    >
      {location === 'Party'
        ? <span className="owned-location">Party</span>
        : <span className="owned-location-spacer" aria-hidden="true" />}
      <DragonIcon species={species} size={112} battleMode />
      <strong><DragonName species={species} nickname={dragon.nickname} /></strong>
      <span style={{ color: typeColors[species.type] }}>Lv {dragon.level}</span>
    </button>
  )
}

