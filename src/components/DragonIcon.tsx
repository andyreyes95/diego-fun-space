import type { DragonSpecies } from '../types'

interface DragonIconProps {
  species: DragonSpecies
  size?: number
  silhouette?: boolean
  battleMode?: boolean
}

export function DragonIcon({
  species,
  size = 180,
  silhouette = false,
  battleMode = false,
}: DragonIconProps) {
  const src = `${import.meta.env.BASE_URL}assets/dragons/dragon-${String(species.dexNo).padStart(3, '0')}.png`

  return (
    <img
      className={[
        'dragon-icon',
        battleMode ? 'dragon-cutout' : '',
        silhouette ? 'dragon-silhouette' : '',
      ].filter(Boolean).join(' ')}
      src={src}
      width={size}
      height={size}
      alt={silhouette ? 'Unknown dragon silhouette' : species.name}
    />
  )
}
