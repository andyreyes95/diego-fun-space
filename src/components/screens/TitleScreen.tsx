import { DragonIcon } from '../DragonIcon'
import { speciesById, typeColors, typeNames } from '../../data'

interface TitleScreenProps {
  playerName: string
  selectedStarter: string
  onNameChange: (name: string) => void
  onStarterChange: (speciesId: string) => void
  onStart: () => void
}

export function TitleScreen({ playerName, selectedStarter, onNameChange, onStarterChange, onStart }: TitleScreenProps) {
  const starterIds = ['embbite', 'puddlefin', 'spriglet']

  return (
    <main className="title-screen">
      <div className="title-sky" aria-hidden="true">
        <span className="cloud cloud-one" />
        <span className="cloud cloud-two" />
        <span className="star star-one">✦</span>
        <span className="star star-two">✦</span>
        <span className="star star-three">✦</span>
      </div>
      <section className="title-card">
        <div className="title-dragons" aria-hidden="true">
          {starterIds.map((id) => (
            <DragonIcon key={id} species={speciesById[id]} size={150} />
          ))}
        </div>
        <p className="eyebrow">A journey beyond the stars</p>
        <h1>Starcrest<br /><span>Dragons</span></h1>
        <label className="name-field">
          Your trainer name
          <input value={playerName} maxLength={14} onChange={(event) => onNameChange(event.target.value)} />
        </label>
        <div className="starter-grid">
          {starterIds.map((id) => {
            const species = speciesById[id]
            return (
              <button
                key={id}
                type="button"
                className={selectedStarter === id ? 'starter-card selected' : 'starter-card'}
                onClick={() => onStarterChange(id)}
              >
                <DragonIcon species={species} size={120} />
                <strong>{species.name}</strong>
                <span className="type-pill" style={{ background: typeColors[species.type] }}>{typeNames[species.type]}</span>
              </button>
            )
          })}
        </div>
        <button className="primary-button" type="button" onClick={onStart}>Begin the adventure</button>
      </section>
    </main>
  )
}
