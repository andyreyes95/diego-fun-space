import type { DragonSpecies } from '../types'

interface DragonNameProps {
  species: DragonSpecies
  nickname?: string
  className?: string
}

export function DragonName({ species, nickname, className }: DragonNameProps) {
  const trimmedNickname = nickname?.trim()
  return (
    <span className={className}>
      {species.name}
      {trimmedNickname ? <span className="nickname-inline"> ({trimmedNickname})</span> : null}
    </span>
  )
}
