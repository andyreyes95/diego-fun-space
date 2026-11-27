import type { GameSave, View } from '../../types'
import { MapLocationCard } from '../MapLocationCard'
import { QuestCard } from '../QuestCard'

interface TownScreenProps {
  save: GameSave
  onTravel: () => void
}

export function TownScreen({ save, onTravel }: TownScreenProps) {
  return (
    <section className="world-view town-view">
      <div className="world-copy">
        <p className="eyebrow">Home planet · Willowvale</p>
        <h1>Welcome home, {save.playerName}.</h1>
        <p>Your dream begins here. Choose a route, meet other tamers, and prepare for Planet Emberfall.</p>
      </div>
      <div className="town-map" aria-label="Willowvale town map">
        <div className="house house-left"><span>Lab</span></div>
        <div className="house house-right"><span>Dragon Center</span></div>
        <div className="town-portal" />
        <MapLocationCard
          className="portal-location"
          eyebrow="Travel to Planet 1"
          title="Emberfall"
          onClick={onTravel}
        />
      </div>
      <QuestCard save={save} />
    </section>
  )
}

interface PlanetScreenProps {
  save: GameSave
  planet: 1 | 2
  onViewChange: (view: View) => void
  onWildBattle: (planet: 1 | 2) => void
  onTrainerBattle: (kind: 'fireGym' | 'grassGym' | 'gang') => void
  onHeal: () => void
  onToast: (message: string) => void
}

export function PlanetScreen({ save, planet, onViewChange, onWildBattle, onTrainerBattle, onHeal, onToast }: PlanetScreenProps) {
  if (planet === 1) {
    return (
      <section className="world-view planet-view emberfall layered-planet">
        <div className="world-copy">
          <p className="eyebrow">Planet 01 · Emberfall</p>
          <h1>Cinderwood Trail</h1>
          <p>Warm winds carry Fire, Grass, and Electric dragons between the crater flowers.</p>
        </div>
        <div className="planet-map layered-planet-map" aria-label="Emberfall locations">
          <MapLocationCard
            className="planet-location-card wild-location"
            artSrc="/assets/map-locations/emberfall/wild.png"
            artAlt="Ember trees, crystals, and a wild trail"
            eyebrow="Explore"
            title="Wild dragons"
            onClick={() => onWildBattle(1)}
          />
          <MapLocationCard
            className="planet-location-card gym-location"
            artSrc="/assets/map-locations/emberfall/gym.png"
            artAlt="Emberfall Fire Gym"
            eyebrow={save.badges.includes('Ember') ? 'Badge earned' : `Fire Gym · ${save.gymProgress.fire + 1} / 3`}
            title={save.gymProgress.fire === 2 ? 'Challenge Sol' : `Battle Trainer ${save.gymProgress.fire + 1}`}
            onClick={() => onTrainerBattle('fireGym')}
          />
          <MapLocationCard
            className="planet-location-card healing-location"
            artSrc="/assets/map-locations/emberfall/healing.png"
            artAlt="Emberfall healing center"
            eyebrow="Healing Center"
            title="Rest your team"
            onClick={onHeal}
          />
          <MapLocationCard
            className="planet-location-card market-location"
            artSrc="/assets/map-locations/emberfall/market.png"
            artAlt="Emberfall market"
            eyebrow="Market"
            title="Coming soon"
            onClick={() => onToast('The Emberfall market is not open yet.')}
          />
          <MapLocationCard
            className="planet-location-card portal-location"
            artSrc="/assets/map-locations/emberfall/portal.png"
            artAlt="Portal to other planets"
            eyebrow="Travel"
            title="Planet Map"
            onClick={() => onViewChange('map')}
          />
        </div>
        <QuestCard save={save} />
      </section>
    )
  }

  return (
    <section className="world-view planet-view mossgrove layered-planet">
      <div className="world-copy">
        <p className="eyebrow">Planet 02 · Mossgrove</p>
        <h1>The Whispering Canopy</h1>
        <p>Track bright Light dragons while keeping watch for the Dark Gang.</p>
      </div>
      <div className="planet-map layered-planet-map" aria-label="Mossgrove locations">
        <MapLocationCard
          className="planet-location-card wild-location"
          artSrc="/assets/map-locations/mossgrove/wild.png"
          artAlt="Mossgrove forest wild trail"
          eyebrow="Explore"
          title="Wild dragons"
          onClick={() => onWildBattle(2)}
        />
        <MapLocationCard
          className="planet-location-card gym-location"
          artSrc="/assets/map-locations/mossgrove/gym.png"
          artAlt="Mossgrove Grass Gym"
          eyebrow={save.badges.includes('Bloom') ? 'Badge earned' : `Grass Gym · ${save.gymProgress.grass + 1} / 3`}
          title={save.gymProgress.grass === 2 ? 'Challenge Moss' : `Battle Trainer ${save.gymProgress.grass + 1}`}
          onClick={() => onTrainerBattle('grassGym')}
        />
        <MapLocationCard
          className="planet-location-card healing-location"
          artSrc="/assets/map-locations/mossgrove/healing.png"
          artAlt="Mossgrove healing center"
          eyebrow="Healing Center"
          title="Rest your team"
          onClick={onHeal}
        />
        <MapLocationCard
          className="planet-location-card market-location"
          artSrc="/assets/map-locations/mossgrove/market.png"
          artAlt="Mossgrove market"
          eyebrow="Market"
          title="Coming soon"
          onClick={() => onToast('The Mossgrove market is not open yet.')}
        />
        <MapLocationCard
          className="planet-location-card portal-location"
          artSrc="/assets/map-locations/mossgrove/portal.png"
          artAlt="Portal to other planets"
          eyebrow="Travel"
          title="Planet Map"
          onClick={() => onViewChange('map')}
        />
      </div>
      <QuestCard save={save} />
    </section>
  )
}
