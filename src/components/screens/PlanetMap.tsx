import type { Dispatch, SetStateAction } from 'react'
import type { GameSave, View } from '../../types'

interface PlanetMapProps {
  save: GameSave
  setSave: Dispatch<SetStateAction<GameSave | null>>
  setView: (view: View) => void
  onToast: (message: string) => void
}

export function PlanetMap({ save, setSave, setView, onToast }: PlanetMapProps) {
  return (
    <section className="planet-map-view">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Starlane Map</p>
          <h1>Choose a planet</h1>
        </div>
        <span>{save.currentPlanet === 1 ? 'Emberfall route' : 'Mossgrove route'}</span>
      </div>
      <div className="planet-route" aria-label="Planet route">
        <button
          type="button"
          className={save.currentPlanet === 1 ? 'planet-node active' : 'planet-node'}
          onClick={() => setView('town')}
        >
          <span className="planet-preview willow-preview" />
          <strong>Willowvale</strong>
          <small>Home planet · Town</small>
          <i>Available</i>
        </button>
        <span className="route-line" aria-hidden="true" />
        <button
          type="button"
          className={save.currentPlanet === 1 ? 'planet-node active' : 'planet-node'}
          onClick={() => {
            setSave((current) => current ? { ...current, currentPlanet: 1 } : current)
            setView('planet1')
          }}
        >
          <span className="planet-preview ember-preview" />
          <strong>Emberfall</strong>
          <small>Planet 1 · Fire Gym</small>
          <i>Available</i>
        </button>
        <span className={save.badges.includes('Ember') ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
        <button
          type="button"
          className={save.currentPlanet === 2 ? 'planet-node active' : save.badges.includes('Ember') ? 'planet-node' : 'planet-node locked'}
          onClick={() => {
            if (!save.badges.includes('Ember')) {
              onToast('Beat Gym Leader Sol to unlock Mossgrove!')
              return
            }
            setSave((current) => current ? { ...current, currentPlanet: 2 } : current)
            setView('planet2')
          }}
        >
          <span className="planet-preview moss-preview" />
          <strong>Mossgrove</strong>
          <small>Planet 2 · Grass Gym</small>
          <i>{save.badges.includes('Ember') ? 'Available' : 'Locked: Ember Badge'}</i>
        </button>
      </div>
    </section>
  )
}
