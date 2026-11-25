import { dragonSpecies, speciesById } from '../data'
import type { DragonSpecies, DragonType, GameSave } from '../types'

export interface DexFilters {
  type: 'all' | DragonType
  status: 'all' | 'seen' | 'caught'
}

export function filterDexSpecies(save: GameSave | null, filters: DexFilters): DragonSpecies[] {
  return dragonSpecies.filter((species) => {
    const seen = save?.seen.includes(species.id) ?? false
    const caught = save?.caught.includes(species.id) ?? false
    const typeMatch = filters.type === 'all' || species.type === filters.type
    const statusMatch = filters.status === 'all'
      || (filters.status === 'seen' && seen && !caught)
      || (filters.status === 'caught' && caught)
    return seen && typeMatch && statusMatch
  })
}

export function getEvolutionChain(speciesId: string): DragonSpecies[] {
  let root = speciesById[speciesId]
  while (true) {
    const previous = dragonSpecies.find((species) => species.evolvesTo === root.id)
    if (!previous) break
    root = previous
  }

  const chain = [root]
  while (chain[chain.length - 1].evolvesTo) {
    chain.push(speciesById[chain[chain.length - 1].evolvesTo!])
  }
  return chain
}
