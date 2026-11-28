import type { GameSave, View } from '../../types'
import { getNextSolarNode, isSolarNodeUnlocked, solarNodes } from '../../game/solarMap'

interface SolarMapProps {
  save: GameSave
  onNavigate: (view: View) => void
  onToast: (message: string) => void
}

export function SolarMap({ save, onNavigate, onToast }: SolarMapProps) {
  const nextNode = getNextSolarNode(save)

  return (
    <section className="planet-map-view solar-map-view">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Planet Map</p>
          <h1>Starcrest System</h1>
          <p className="map-subtitle">Choose your next destination across the stars.</p>
        </div>
      </div>
      <div className="solar-map-canvas" aria-label="Solar-system planet map preview">
        <div className="solar-system-sun" aria-hidden="true">
          <span />
        </div>
        {solarNodes.map((node) => {
          const isUnlocked = isSolarNodeUnlocked(node, save)
          const isCurrent = node.routeIndex === save.currentPlanet
          const isNext = node.id === nextNode?.id
          const globePath = `${import.meta.env.BASE_URL}assets/planet-globes/${node.id}.png`
          return (
            <button
              key={node.id}
              type="button"
              className={[
                'solar-planet-node',
                'moon' in node && node.moon ? 'solar-moon-node' : '',
                isUnlocked ? '' : 'locked',
                isCurrent ? 'current' : '',
                isNext ? 'next' : '',
              ].filter(Boolean).join(' ')}
              style={{ left: `${node.x}%`, top: `${node.y}%`, width: `${node.size}%` }}
              onClick={() => {
                if (!isUnlocked) {
                  onToast(node.id === 'luminara' && save.badges.includes('Eclipse')
                    ? 'This path remains sealed for now.'
                    : 'This destination is still hidden. Continue your journey to reveal it.')
                  return
                }
                onNavigate(node.view)
              }}
            >
              <img
                className="solar-globe"
                src={globePath}
                alt={isUnlocked ? node.name : 'Unknown planet silhouette'}
              />
              <span className="solar-planet-label">
                <strong>{isUnlocked ? node.name : 'Unknown planet'}</strong>
                {isUnlocked && <small>{isCurrent ? 'You are here' : isNext ? 'Next destination' : 'Available'}</small>}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
