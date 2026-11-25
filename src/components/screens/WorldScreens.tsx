import type { Dispatch, SetStateAction } from 'react'
import type { GameSave, View } from '../../types'

interface TownScreenProps {
  save: GameSave
  setView: (view: View) => void
  setSave: Dispatch<SetStateAction<GameSave | null>>
  onHeal: () => void
}

export function TownScreen({ save, setView, setSave, onHeal }: TownScreenProps) {
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
        <button
          className="map-location portal-location"
          type="button"
          onClick={() => {
            setSave((current) => current ? { ...current, currentPlanet: 1 } : current)
            setView('planet1')
          }}
        >
          <span>Travel to Planet 1</span>
          <strong>Emberfall</strong>
        </button>
        <button className="map-location center-location" type="button" onClick={onHeal}>
          <span>Healing Center</span>
          <strong>Rest your team</strong>
        </button>
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
  setView: (view: View) => void
  setSave: Dispatch<SetStateAction<GameSave | null>>
  onWildBattle: (planet: 1 | 2) => void
  onTrainerBattle: (kind: 'fireGym' | 'grassGym' | 'gang') => void
  onToast: (message: string) => void
}

export function PlanetScreen({ save, planet, setView, setSave, onWildBattle, onTrainerBattle, onToast }: PlanetScreenProps) {
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
          <button className="map-location wild-location" type="button" onClick={() => onWildBattle(1)}>
            <span>Explore</span><strong>Wild dragons</strong>
          </button>
          <button className="map-location gym-location" type="button" onClick={() => onTrainerBattle('fireGym')}>
            <span>{save.badges.includes('Ember') ? 'Badge earned' : 'Fire Gym'}</span>
            <strong>Challenge Sol</strong>
          </button>
          <button
            className="map-location next-location"
            type="button"
            onClick={() => {
              if (!save.badges.includes('Ember')) {
                onToast('Beat Gym Leader Sol to unlock Mossgrove!')
                return
              }
              setSave((current) => current ? { ...current, currentPlanet: 2 } : current)
              setView('planet2')
            }}
          >
            <span>Next planet</span><strong>Mossgrove</strong>
          </button>
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
        <button className="map-location wild-location" type="button" onClick={() => onWildBattle(2)}>
          <span>Explore</span><strong>Wild dragons</strong>
        </button>
        <button className="map-location gym-location" type="button" onClick={() => onTrainerBattle('grassGym')}>
          <span>{save.badges.includes('Bloom') ? 'Badge earned' : 'Grass Gym'}</span>
          <strong>Challenge Moss</strong>
        </button>
        <button className="map-location gang-location" type="button" onClick={() => onTrainerBattle('gang')}>
          <span>Dark Gang</span><strong>Break the ambush</strong>
        </button>
      </div>
    </section>
  )
}
