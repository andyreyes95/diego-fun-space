import type { GameSave, View } from '../../types'
import { MapLocationCard } from '../MapLocationCard'

interface PlanetMapProps {
  save: GameSave
  onNavigate: (view: View) => void
  onToast: (message: string) => void
}

export function PlanetMap({ save, onNavigate, onToast }: PlanetMapProps) {
  const mossgroveUnlocked = save.badges.includes('Ember')
  const voltspireUnlocked = save.badges.includes('Bloom')
  const cloudrestUnlocked = save.badges.includes('Spark')
  const tidehavenUnlocked = save.badges.includes('Breeze')
  const frostveilUnlocked = save.badges.includes('Tide')
  const umbralisUnlocked = save.badges.includes('Frost')

  return (
    <section className="planet-map-view">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Starlane Map</p>
          <h1>Choose a planet</h1>
        </div>
        <span>{save.currentPlanet === 0 ? 'Willowvale route' : save.currentPlanet === 1 ? 'Emberfall route' : save.currentPlanet === 2 ? 'Mossgrove route' : save.currentPlanet === 3 ? 'Voltspire route' : save.currentPlanet === 4 ? 'Cloudrest route' : save.currentPlanet === 5 ? 'Tidehaven route' : save.currentPlanet === 6 ? 'Frostveil route' : 'Umbralis route'}</span>
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
        <span className={voltspireUnlocked ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 3 ? 'active' : voltspireUnlocked ? '' : 'locked'}
          onClick={() => {
            if (!voltspireUnlocked) {
              onToast('Voltspire unlocks after you earn the Bloom Badge.')
              return
            }
            onNavigate('planet3')
          }}
          previewClass={voltspireUnlocked ? 'volt-preview' : 'mystery-preview'}
          title={voltspireUnlocked ? 'Voltspire' : 'Unknown planet'}
          detail={voltspireUnlocked ? 'Planet 3 · Electric Gym' : 'Charged destination'}
          status={voltspireUnlocked ? 'Available' : 'Locked · Bloom Badge'}
        />
        <span className={cloudrestUnlocked ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 4 ? 'active' : cloudrestUnlocked ? '' : 'locked'}
          onClick={() => {
            if (!cloudrestUnlocked) {
              onToast('Cloudrest unlocks after you earn the Spark Badge.')
              return
            }
            onNavigate('planet4')
          }}
          previewClass={cloudrestUnlocked ? 'cloud-preview' : 'mystery-preview'}
          title={cloudrestUnlocked ? 'Cloudrest' : 'Unknown planet'}
          detail={cloudrestUnlocked ? 'Planet 4 · Cloud Gym' : 'Floating destination'}
          status={cloudrestUnlocked ? 'Available' : 'Locked · Spark Badge'}
        />
        <span className={tidehavenUnlocked ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 5 ? 'active' : tidehavenUnlocked ? '' : 'locked'}
          onClick={() => {
            if (!tidehavenUnlocked) {
              onToast('Tidehaven unlocks after you earn the Breeze Badge.')
              return
            }
            onNavigate('planet5')
          }}
          previewClass={tidehavenUnlocked ? 'tide-preview' : 'mystery-preview'}
          title={tidehavenUnlocked ? 'Tidehaven' : 'Unknown planet'}
          detail={tidehavenUnlocked ? 'Planet 5 · Water Gym' : 'Oceanic destination'}
          status={tidehavenUnlocked ? 'Available' : 'Locked · Breeze Badge'}
        />
        <span className={frostveilUnlocked ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 6 ? 'active' : frostveilUnlocked ? '' : 'locked'}
          onClick={() => {
            if (!frostveilUnlocked) {
              onToast('Frostveil unlocks after you earn the Tide Badge.')
              return
            }
            onNavigate('planet6')
          }}
          previewClass={frostveilUnlocked ? 'frost-preview' : 'mystery-preview'}
          title={frostveilUnlocked ? 'Frostveil' : 'Unknown planet'}
          detail={frostveilUnlocked ? 'Planet 6 · Ice Gym' : 'Frozen destination'}
          status={frostveilUnlocked ? 'Available' : 'Locked · Tide Badge'}
        />
        <span className={umbralisUnlocked ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
        <MapLocationCard
          baseClassName="planet-node"
          className={save.currentPlanet === 7 ? 'active' : umbralisUnlocked ? '' : 'locked'}
          onClick={() => {
            if (!umbralisUnlocked) {
              onToast('Umbralis unlocks after you earn the Frost Badge.')
              return
            }
            onNavigate('planet7')
          }}
          previewClass={umbralisUnlocked ? 'umbra-preview' : 'mystery-preview'}
          title={umbralisUnlocked ? 'Umbralis' : 'Unknown planet'}
          detail={umbralisUnlocked ? 'Planet 7 · Dark Gym' : 'Moonlit destination'}
          status={umbralisUnlocked ? 'Available' : 'Locked · Frost Badge'}
        />
      </div>
    </section>
  )
}
