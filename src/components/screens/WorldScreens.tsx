import type { GameSave, View } from '../../types'
import { MapLocationCard } from '../MapLocationCard'

interface TownScreenProps {
  save: GameSave
  onTravel: () => void
  onHeal: () => void
}

export function TownScreen({ save, onTravel, onHeal }: TownScreenProps) {
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
        <MapLocationCard
          className="center-location"
          eyebrow="Healing Center"
          title="Rest your team"
          onClick={onHeal}
        />
      </div>
      <aside className="quest-card">
        <p>Next objective</p>
        <strong>{save.badges.includes('Ember') ? 'Travel to Mossgrove' : 'Earn the Ember Gym Badge'}</strong>
        <div className="quest-progress"><i style={{ width: save.badges.includes('Ember') ? '50%' : '25%' }} /></div>
      </aside>
    </section>
  )
}

interface PlanetScreenProps {
  save: GameSave
  planet: 1 | 2
  onViewChange: (view: View) => void
  onWildBattle: (planet: 1 | 2) => void
  onTrainerBattle: (kind: 'fireGym' | 'grassGym' | 'gang') => void
  onToast: (message: string) => void
}

export function PlanetScreen({ save, planet, onViewChange, onWildBattle, onTrainerBattle, onToast }: PlanetScreenProps) {
  if (planet === 1) {
    return (
      <section className="world-view planet-view emberfall">
        <div className="world-copy">
          <p className="eyebrow">Planet 01 · Emberfall</p>
          <h1>Cinderwood Trail</h1>
          <p>Warm winds carry Fire, Grass, and Electric dragons between the crater flowers.</p>
        </div>
        <div className="planet-map">
          <span className="planet-sun" />
          <span className="planet-rock rock-one" />
          <span className="planet-rock rock-two" />
          <MapLocationCard className="wild-location" eyebrow="Explore" title="Wild dragons" onClick={() => onWildBattle(1)} />
          <MapLocationCard
            className="gym-location"
            eyebrow={save.badges.includes('Ember') ? 'Badge earned' : 'Fire Gym'}
            title="Challenge Sol"
            onClick={() => onTrainerBattle('fireGym')}
          />
          <MapLocationCard
            className="next-location"
            eyebrow="Next planet"
            title="Mossgrove"
            onClick={() => {
              if (!save.badges.includes('Ember')) {
                onToast('Beat Gym Leader Sol to unlock Mossgrove!')
                return
              }
              onViewChange('planet2')
            }}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="world-view planet-view mossgrove">
      <div className="world-copy">
        <p className="eyebrow">Planet 02 · Mossgrove</p>
        <h1>The Whispering Canopy</h1>
        <p>Track bright Light dragons while keeping watch for the Dark Gang.</p>
      </div>
      <div className="planet-map moss-map">
        <span className="giant-tree tree-one" />
        <span className="giant-tree tree-two" />
        <MapLocationCard className="wild-location" eyebrow="Explore" title="Wild dragons" onClick={() => onWildBattle(2)} />
        <MapLocationCard
          className="gym-location"
          eyebrow={save.badges.includes('Bloom') ? 'Badge earned' : 'Grass Gym'}
          title="Challenge Moss"
          onClick={() => onTrainerBattle('grassGym')}
        />
        <MapLocationCard className="gang-location" eyebrow="Dark Gang" title="Break the ambush" onClick={() => onTrainerBattle('gang')} />
      </div>
    </section>
  )
}
