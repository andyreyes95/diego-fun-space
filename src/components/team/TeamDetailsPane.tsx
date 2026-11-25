import type { DragonInstance } from '../../types'
import { speciesById } from '../../data'
import { DragonIcon } from '../DragonIcon'
import { DragonName } from '../DragonName'

interface TeamDetailsPaneProps {
  dragon: DragonInstance | undefined
  location: 'Party' | 'Reserve' | undefined
  onNickname: (instanceId: string, nickname: string) => void
  onMove: (instanceId: string, destination: 'party' | 'reserve') => void
}

export function TeamDetailsPane({ dragon, location, onNickname, onMove }: TeamDetailsPaneProps) {
  if (!dragon || !location) {
    return <aside className="selected-copy-panel"><p className="team-empty">Select a dragon to view details.</p></aside>
  }

  const species = speciesById[dragon.speciesId]
  return (
    <aside className="selected-copy-panel">
      <DragonIcon species={species} size={210} battleMode />
      <div className="selected-copy-heading">
        <div>
          <span className="eyebrow">Selected Dragon</span>
          <h2><DragonName species={species} nickname={dragon.nickname} /></h2>
        </div>
      </div>
      <label className="nickname-field">
        Nickname
        <input
          value={dragon.nickname ?? ''}
          maxLength={16}
          placeholder={species.name}
          onChange={(event) => onNickname(dragon.instanceId, event.target.value)}
        />
      </label>
      <dl className="selected-copy-stats">
        <div><dt>Species</dt><dd>{species.name}</dd></div>
        <div><dt>Location</dt><dd>{location}</dd></div>
        <div><dt>Level</dt><dd>{dragon.level}</dd></div>
        <div><dt>XP</dt><dd>{dragon.xp}</dd></div>
        <div><dt>HP</dt><dd>{dragon.hp}/{dragon.maxHp}</dd></div>
        <div><dt>Attack</dt><dd>{dragon.attack}</dd></div>
        <div><dt>Defense</dt><dd>{dragon.defense}</dd></div>
        <div><dt>Moves</dt><dd>{dragon.moves.map((move) => move.name).join(', ')}</dd></div>
      </dl>
      <button
        type="button"
        className="team-copy-action full"
        onClick={() => onMove(dragon.instanceId, location === 'Party' ? 'reserve' : 'party')}
      >
        {location === 'Party' ? 'Remove from Party' : 'Move to Party'}
      </button>
    </aside>
  )
}

