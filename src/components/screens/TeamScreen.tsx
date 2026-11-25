import { useEffect, useState } from 'react'
import type { DragonInstance, GameSave } from '../../types'
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
            <h2>All Caught Dragons</h2>
            <span>{allCopies.length} owned</span>
          </div>
          <div className="owned-grid">
            {allCopies.map(({ dragon, location }) => (
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

