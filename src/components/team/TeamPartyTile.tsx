import type { DragonInstance } from '../../types'
import { speciesById } from '../../data'
import { DragonIcon } from '../DragonIcon'
import { DragonName } from '../DragonName'

interface TeamPartyTileProps {
  dragon: DragonInstance
  active: boolean
  onSelect: (instanceId: string) => void
}

export function TeamPartyTile({ dragon, active, onSelect }: TeamPartyTileProps) {
  const species = speciesById[dragon.speciesId]
  return (
    <button
      type="button"
      className={active ? 'party-list-copy active' : 'party-list-copy'}
      onClick={() => onSelect(dragon.instanceId)}
    >
      <DragonIcon species={species} size={70} battleMode />
      <div>
        <strong><DragonName species={species} nickname={dragon.nickname} /></strong>
        <small>Lv {dragon.level} · HP {dragon.hp}/{dragon.maxHp}</small>
      </div>
    </button>
  )
}
