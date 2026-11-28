import type { GameSave, View } from '../../types'
import { MapLocationCard } from '../MapLocationCard'
import { QuestCard } from '../QuestCard'

interface TownScreenProps {
  save: GameSave
  onTravel: () => void
  onReplayStory: () => void
}

export function TownScreen({ save, onTravel, onReplayStory }: TownScreenProps) {
  return (
    <section className="world-view town-view">
      <div className="world-copy">
        <p className="eyebrow">Home planet · Willowvale</p>
        <h1>Welcome home, {save.playerName}.</h1>
        <p>Your road to Champion Mark begins here. Prepare your team for eight Gym Badges, starting on Emberfall.</p>
        <button className="world-copy-link" type="button" onClick={onReplayStory}>Replay your story</button>
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
  planet: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  onViewChange: (view: View) => void
  onWildBattle: (planet: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => void
  onTrainerBattle: (kind: 'fireGym' | 'grassGym' | 'electricGym' | 'cloudGym' | 'waterGym' | 'iceGym' | 'darkGym' | 'lightGym' | 'gang' | 'jakeBoss') => void
  onHeal: () => void
  onMarket: () => void
  onToast: (message: string) => void
}

export function PlanetScreen({ save, planet, onViewChange, onWildBattle, onTrainerBattle, onHeal, onMarket, onToast }: PlanetScreenProps) {
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
            title="Browse Items"
            onClick={onMarket}
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

  if (planet === 2) {
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
          title="Browse Items"
          onClick={onMarket}
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

  if (planet === 3) {
    return (
    <section className="world-view planet-view voltspire layered-planet">
      <div className="world-copy">
        <p className="eyebrow">Planet 03 · Voltspire</p>
        <h1>The Thunderstep Expanse</h1>
        <p>Cross golden charged dunes and lightning gardens on the way to Volt's Electric Gym.</p>
      </div>
      <div className="planet-map layered-planet-map" aria-label="Voltspire locations">
        <MapLocationCard
          className="planet-location-card wild-location"
          artSrc="/assets/map-locations/voltspire/wild.png"
          artAlt="Voltspire charged wild trail"
          eyebrow="Explore"
          title="Wild dragons"
          onClick={() => onWildBattle(3)}
        />
        <MapLocationCard
          className="planet-location-card gym-location"
          artSrc="/assets/map-locations/voltspire/gym.png"
          artAlt="Voltspire Electric Gym"
          eyebrow={save.badges.includes('Spark') ? 'Badge earned' : `Electric Gym · ${save.gymProgress.electric + 1} / 3`}
          title={save.gymProgress.electric === 2 ? 'Challenge Volt' : `Battle Trainer ${save.gymProgress.electric + 1}`}
          onClick={() => onTrainerBattle('electricGym')}
        />
        <MapLocationCard
          className="planet-location-card healing-location"
          artSrc="/assets/map-locations/voltspire/healing.png"
          artAlt="Voltspire healing center"
          eyebrow="Healing Center"
          title="Rest your team"
          onClick={onHeal}
        />
        <MapLocationCard
          className="planet-location-card market-location"
          artSrc="/assets/map-locations/voltspire/market.png"
          artAlt="Voltspire market"
          eyebrow="Market"
          title="Browse Items"
          onClick={onMarket}
        />
        <MapLocationCard
          className="planet-location-card portal-location"
          artSrc="/assets/map-locations/voltspire/portal.png"
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

  if (planet === 4) {
    return (
    <section className="world-view planet-view cloudrest layered-planet">
      <div className="world-copy">
        <p className="eyebrow">Planet 04 · Cloudrest</p>
        <h1>The Skybridge Gardens</h1>
        <p>Follow pearl-cloud paths through floating gardens toward Cirrus's Cloud Gym.</p>
      </div>
      <div className="planet-map layered-planet-map" aria-label="Cloudrest locations">
        <MapLocationCard
          className="planet-location-card wild-location"
          artSrc="/assets/map-locations/cloudrest/wild.png"
          artAlt="Cloudrest cloud-grove wild trail"
          eyebrow="Explore"
          title="Wild dragons"
          onClick={() => onWildBattle(4)}
        />
        <MapLocationCard
          className="planet-location-card gym-location"
          artSrc="/assets/map-locations/cloudrest/gym.png"
          artAlt="Cloudrest Cloud Gym"
          eyebrow={save.badges.includes('Breeze') ? 'Badge earned' : `Cloud Gym · ${save.gymProgress.cloud + 1} / 3`}
          title={save.gymProgress.cloud === 2 ? 'Challenge Cirrus' : `Battle Trainer ${save.gymProgress.cloud + 1}`}
          onClick={() => onTrainerBattle('cloudGym')}
        />
        <MapLocationCard
          className="planet-location-card healing-location"
          artSrc="/assets/map-locations/cloudrest/healing.png"
          artAlt="Cloudrest healing center"
          eyebrow="Healing Center"
          title="Rest your team"
          onClick={onHeal}
        />
        <MapLocationCard
          className="planet-location-card market-location"
          artSrc="/assets/map-locations/cloudrest/market.png"
          artAlt="Cloudrest market"
          eyebrow="Market"
          title="Browse Items"
          onClick={onMarket}
        />
        <MapLocationCard
          className="planet-location-card portal-location"
          artSrc="/assets/map-locations/cloudrest/portal.png"
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

  if (planet === 5) {
    return (
    <section className="world-view planet-view tidehaven layered-planet">
      <div className="world-copy">
        <p className="eyebrow">Planet 05 · Tidehaven</p>
        <h1>The Luminous Reef Isles</h1>
        <p>Cross pearl shores and turquoise lagoons on the route to Marina's Water Gym.</p>
      </div>
      <div className="planet-map layered-planet-map" aria-label="Tidehaven locations">
        <MapLocationCard className="planet-location-card wild-location" artSrc="/assets/map-locations/tidehaven/wild.png" artAlt="Tidehaven reef wild trail" eyebrow="Explore" title="Wild dragons" onClick={() => onWildBattle(5)} />
        <MapLocationCard className="planet-location-card gym-location" artSrc="/assets/map-locations/tidehaven/gym.png" artAlt="Tidehaven Water Gym" eyebrow={save.badges.includes('Tide') ? 'Badge earned' : `Water Gym · ${save.gymProgress.water + 1} / 3`} title={save.gymProgress.water === 2 ? 'Challenge Marina' : `Battle Trainer ${save.gymProgress.water + 1}`} onClick={() => onTrainerBattle('waterGym')} />
        <MapLocationCard className="planet-location-card healing-location" artSrc="/assets/map-locations/tidehaven/healing.png" artAlt="Tidehaven healing center" eyebrow="Healing Center" title="Rest your team" onClick={onHeal} />
        <MapLocationCard className="planet-location-card market-location" artSrc="/assets/map-locations/tidehaven/market.png" artAlt="Tidehaven market" eyebrow="Market" title="Browse Items" onClick={onMarket} />
        <MapLocationCard className="planet-location-card portal-location" artSrc="/assets/map-locations/tidehaven/portal.png" artAlt="Portal to other planets" eyebrow="Travel" title="Planet Map" onClick={() => onViewChange('map')} />
      </div>
      <QuestCard save={save} />
    </section>
    )
  }

  if (planet === 6) {
    return (
    <section className="world-view planet-view frostveil layered-planet">
      <div className="world-copy">
        <p className="eyebrow">Planet 06 · Frostveil</p>
        <h1>The Aurora Icefields</h1>
        <p>Follow crystal trails beneath glowing auroras toward Glacia's Ice Gym.</p>
      </div>
      <div className="planet-map layered-planet-map" aria-label="Frostveil locations">
        <MapLocationCard className="planet-location-card wild-location" artSrc="/assets/map-locations/frostveil/wild.png" artAlt="Frostveil crystal wild trail" eyebrow="Explore" title="Wild dragons" onClick={() => onWildBattle(6)} />
        <MapLocationCard className="planet-location-card gym-location" artSrc="/assets/map-locations/frostveil/gym.png" artAlt="Frostveil Ice Gym" eyebrow={save.badges.includes('Frost') ? 'Badge earned' : `Ice Gym · ${save.gymProgress.ice + 1} / 3`} title={save.gymProgress.ice === 2 ? 'Challenge Glacia' : `Battle Trainer ${save.gymProgress.ice + 1}`} onClick={() => onTrainerBattle('iceGym')} />
        <MapLocationCard className="planet-location-card healing-location" artSrc="/assets/map-locations/frostveil/healing.png" artAlt="Frostveil healing center" eyebrow="Healing Center" title="Rest your team" onClick={onHeal} />
        <MapLocationCard className="planet-location-card market-location" artSrc="/assets/map-locations/frostveil/market.png" artAlt="Frostveil market" eyebrow="Market" title="Browse Items" onClick={onMarket} />
        <MapLocationCard className="planet-location-card portal-location" artSrc="/assets/map-locations/frostveil/portal.png" artAlt="Portal to other planets" eyebrow="Travel" title="Planet Map" onClick={() => onViewChange('map')} />
      </div>
      <QuestCard save={save} />
    </section>
    )
  }

  if (planet === 7) {
    return (
    <section className="world-view planet-view umbralis layered-planet">
      <div className="world-copy">
        <p className="eyebrow">Planet 07 · Umbralis</p>
        <h1>The Eclipsed Ruins</h1>
        <p>Follow moonlit violet paths toward Nyx's Dark Gym beneath the eclipsed moon.</p>
      </div>
      <div className="planet-map layered-planet-map" aria-label="Umbralis locations">
        <MapLocationCard className="planet-location-card wild-location" artSrc="/assets/map-locations/umbralis/wild.png" artAlt="Umbralis moonlit wild trail" eyebrow="Explore" title="Wild dragons" onClick={() => onWildBattle(7)} />
        <MapLocationCard className="planet-location-card gym-location" artSrc="/assets/map-locations/umbralis/gym.png" artAlt="Umbralis Dark Gym" eyebrow={save.badges.includes('Eclipse') ? 'Badge earned' : `Dark Gym · ${save.gymProgress.dark + 1} / 3`} title={save.gymProgress.dark === 2 ? 'Challenge Nyx' : `Battle Trainer ${save.gymProgress.dark + 1}`} onClick={() => onTrainerBattle('darkGym')} />
        <MapLocationCard
          className={save.badges.includes('Eclipse') ? 'planet-location-card jake-fortress-location' : 'planet-location-card jake-fortress-location locked'}
          artSrc="/assets/map-locations/umbralis/jake-fortress.png"
          artAlt="Jake's Dark Gang fortress"
          eyebrow={save.darkGangDefeated ? 'Gang defeated' : save.badges.includes('Eclipse') ? 'Story objective · Defeat Jake' : 'Locked · Eclipse Badge'}
          title={save.darkGangDefeated ? 'Jake defeated' : 'Challenge Jake'}
          disabled={!save.badges.includes('Eclipse')}
          onClick={() => {
            if (save.darkGangDefeated) {
              onToast('Jake and the Dark Gang have already been defeated.')
              return
            }
            if (!save.badges.includes('Eclipse')) {
              onToast('Jake’s fortress unlocks after you defeat Nyx and earn the Eclipse Badge.')
              return
            }
            onTrainerBattle('jakeBoss')
          }}
        />
        <MapLocationCard className="planet-location-card healing-location" artSrc="/assets/map-locations/umbralis/healing.png" artAlt="Umbralis healing center" eyebrow="Healing Center" title="Rest your team" onClick={onHeal} />
        <MapLocationCard className="planet-location-card market-location" artSrc="/assets/map-locations/umbralis/market.png" artAlt="Umbralis market" eyebrow="Market" title="Browse Items" onClick={onMarket} />
        <MapLocationCard className="planet-location-card portal-location" artSrc="/assets/map-locations/umbralis/portal.png" artAlt="Portal to other planets" eyebrow="Travel" title="Planet Map" onClick={() => onViewChange('map')} />
      </div>
      <QuestCard save={save} />
    </section>
    )
  }

  return (
    <section className="world-view planet-view luminara layered-planet">
      <div className="world-copy">
        <p className="eyebrow">Planet 08 · Luminara</p>
        <h1>The Celestial Sanctuaries</h1>
        <p>Follow radiant paths through sacred light gardens toward Auriel's holy gym.</p>
      </div>
      <div className="planet-map layered-planet-map" aria-label="Luminara locations">
        <MapLocationCard className="planet-location-card wild-location" artSrc="/assets/map-locations/luminara/wild.png" artAlt="Luminara sacred light garden trail" eyebrow="Explore" title="Wild dragons" onClick={() => onWildBattle(8)} />
        <MapLocationCard className="planet-location-card gym-location" artSrc="/assets/map-locations/luminara/gym.png" artAlt="Luminara Light Gym" eyebrow={save.badges.includes('Radiant') ? 'Badge earned' : `Light Gym · ${save.gymProgress.light + 1} / 3`} title={save.gymProgress.light === 2 ? 'Challenge Auriel' : `Battle Trainer ${save.gymProgress.light + 1}`} onClick={() => onTrainerBattle('lightGym')} />
        <MapLocationCard className="planet-location-card healing-location" artSrc="/assets/map-locations/luminara/healing.png" artAlt="Luminara healing center" eyebrow="Healing Center" title="Rest your team" onClick={onHeal} />
        <MapLocationCard className="planet-location-card market-location" artSrc="/assets/map-locations/luminara/market.png" artAlt="Luminara sacred market" eyebrow="Market" title="Browse Items" onClick={onMarket} />
        <MapLocationCard className="planet-location-card portal-location" artSrc="/assets/map-locations/luminara/portal.png" artAlt="Portal to other planets" eyebrow="Travel" title="Planet Map" onClick={() => onViewChange('map')} />
      </div>
      <QuestCard save={save} />
    </section>
  )
}
