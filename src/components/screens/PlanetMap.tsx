import type { GameSave, View } from '../../types'
import { MapLocationCard } from '../MapLocationCard'

interface PlanetMapProps {
  save: GameSave
  onNavigate: (view: View) => void
  onToast: (message: string) => void
}

export function PlanetMap({ save, onNavigate, onToast }: PlanetMapProps) {
  const mossgroveUnlocked = save.badges.includes('Ember')

  return (
    <section className="planet-map-view">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Starlane Map</p>
          <h1>Choose a planet</h1>
        </div>
        <span>{save.currentPlanet === 0 ? 'Willowvale route' : save.currentPlanet === 1 ? 'Emberfall route' : 'Mossgrove route'}</span>
      </div>
      <div className="planet-route" aria-label="Planet route">
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 0 ? 'active' : ''}
          onClick={() => onNavigate('town')}
          previewClass="willow-preview"
          title="Willowvale"
          detail="Home planet · Welcome"
          status="Available"
        />
        <span className="route-line" aria-hidden="true" />
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 1 ? 'active' : ''}
          onClick={() => {
            onNavigate('planet1')
          }}
          previewClass="ember-preview"
          title="Emberfall"
          detail="Planet 1 · Fire Gym"
          status="Available"
        />
        <span className={save.badges.includes('Ember') ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 2 ? 'active' : mossgroveUnlocked ? '' : 'locked'}
          onClick={() => {
            if (!mossgroveUnlocked) {
              onToast('A mysterious planet will unlock after you earn the Ember Badge.')
              return
            }
            onNavigate('planet2')
          }}
          previewClass={mossgroveUnlocked ? 'moss-preview' : 'mystery-preview'}
          title={mossgroveUnlocked ? 'Mossgrove' : 'Unknown planet'}
          detail={mossgroveUnlocked ? 'Planet 2 · Grass Gym' : 'Uncharted destination'}
          status={mossgroveUnlocked ? 'Available' : 'Locked · Ember Badge'}
        />
      </div>
    </section>
  )
}
