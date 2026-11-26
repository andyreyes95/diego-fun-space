import { useEffect, useMemo, useState } from 'react'
import type { DragonInstance, GameSave } from '../../types'
import { sortTeamCopies, type SortDirection, type TeamSortKey } from '../../game/sorting'
import { TeamPartyTile } from '../team/TeamPartyTile'
import { TeamTile } from '../team/TeamTile'
import { TeamDetailsPane } from '../team/TeamDetailsPane'

interface TeamScreenProps {
  save: GameSave
  onNickname: (instanceId: string, nickname: string) => void
  onMove: (instanceId: string, destination: 'party' | 'reserve') => void
}

export function TeamScreen({ save, onNickname, onMove }: TeamScreenProps) {
  const allCopies: Array<{ dragon: DragonInstance; location: 'Party' | 'Reserve' }> = [
    ...save.party.map((dragon) => ({ dragon, location: 'Party' as const })),
    ...save.reserve.map((dragon) => ({ dragon, location: 'Reserve' as const })),
  ]
  const [teamSort, setTeamSort] = useState<TeamSortKey>('dexNo')
  const [teamSortDirection, setTeamSortDirection] = useState<SortDirection>('asc')
  const sortedCopies = useMemo(
    () => sortTeamCopies(allCopies, teamSort, teamSortDirection),
    [save.party, save.reserve, teamSort, teamSortDirection],
  )
  const [selectedInstanceId, setSelectedInstanceId] = useState(
    save.party[0]?.instanceId ?? allCopies[0]?.dragon.instanceId ?? '',
  )

  useEffect(() => {
    if (!allCopies.some((copy) => copy.dragon.instanceId === selectedInstanceId)) {
      setSelectedInstanceId(save.party[0]?.instanceId ?? allCopies[0]?.dragon.instanceId ?? '')
    }
  }, [save.party, save.reserve, selectedInstanceId])

  const selectedCopy = allCopies.find((copy) => copy.dragon.instanceId === selectedInstanceId)
  const selectedDragon = selectedCopy?.dragon

  const selectPartyCopy = (instanceId: string) => setSelectedInstanceId(instanceId)

  return (
    <section className="team-screen team-screen-three">
      <div className="team-heading">
        <div>
          <p className="eyebrow">Dragon Team</p>
          <h1>Owned Dragons</h1>
        </div>
        <span>{save.party.length}/4 in Party</span>
      </div>

      <div className="team-three-layout">
        <aside className="party-panel">
          <h2>Party</h2>
          {save.party.length === 0 ? <p className="team-empty">No dragons in Party.</p> : null}
          <div className="party-list">
            {save.party.map((dragon) => (
              <TeamPartyTile
                key={dragon.instanceId}
                dragon={dragon}
                active={dragon.instanceId === selectedInstanceId}
                onSelect={selectPartyCopy}
              />
            ))}
          </div>
        </aside>

        <section className="owned-grid-panel">
          <div className="owned-grid-heading">
            <div>
              <h2>All Caught Dragons</h2>
              <span>{allCopies.length} owned</span>
            </div>
            <div className="tile-sort-controls team-tile-sort">
              <label htmlFor="team-sort">Sort</label>
              <select
                id="team-sort"
                value={teamSort}
                onChange={(event) => setTeamSort(event.target.value as TeamSortKey)}
                aria-label="Sort Team tiles"
              >
                <option value="dexNo">Dex number</option>
                <option value="name">Species name</option>
                <option value="nickname">Nickname</option>
                <option value="level">Level</option>
                <option value="type">Type</option>
                <option value="stage">Stage</option>
                <option value="location">Location</option>
                <option value="hp">HP</option>
                <option value="xp">XP</option>
                <option value="attack">Attack</option>
                <option value="defense">Defense</option>
              </select>
              <button
                type="button"
                className="tile-sort-button"
                onClick={() => setTeamSortDirection((current) => current === 'asc' ? 'desc' : 'asc')}
                aria-label={`Sort ${teamSortDirection === 'asc' ? 'descending' : 'ascending'}`}
                title={teamSortDirection === 'asc' ? 'Ascending' : 'Descending'}
              >
                {teamSortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          <div className="owned-grid">
            {sortedCopies.map(({ dragon, location }) => (
              <TeamTile
                key={dragon.instanceId}
                dragon={dragon}
                location={location}
                active={dragon.instanceId === selectedInstanceId}
                onSelect={setSelectedInstanceId}
              />
            ))}
          </div>
          {allCopies.length === 0 ? <p className="team-empty">No dragons caught yet.</p> : null}
        </section>

        <TeamDetailsPane
          dragon={selectedDragon}
          location={selectedCopy?.location}
          onNickname={onNickname}
          onMove={onMove}
        />
      </div>
    </section>
  )
}

