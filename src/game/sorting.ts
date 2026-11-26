import type { DragonInstance, DragonSpecies } from '../types'
import { speciesById } from '../data'

export type SortDirection = 'asc' | 'desc'

export type DexSortKey =
  | 'dexNo'
  | 'name'
  | 'type'
  | 'stage'
  | 'habitat'
  | 'height'
  | 'weight'

export type TeamSortKey =
  | 'name'
  | 'nickname'
  | 'level'
  | 'type'
  | 'stage'
  | 'dexNo'
  | 'location'
  | 'hp'
  | 'xp'
  | 'attack'
  | 'defense'

export interface TeamSortCopy {
  dragon: DragonInstance
  location: 'Party' | 'Reserve'
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, undefined, { sensitivity: 'base', numeric: true })
}

function compareNumbers(left: number, right: number): number {
  return left - right
}

function parseMeasurement(value: string): number {
  const match = value.match(/-?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY
}

export function sortDexSpecies(
  speciesList: DragonSpecies[],
  sortKey: DexSortKey,
  direction: SortDirection = 'asc',
): DragonSpecies[] {
  const multiplier = direction === 'asc' ? 1 : -1

  return [...speciesList].sort((left, right) => {
    let comparison = 0
    switch (sortKey) {
      case 'dexNo':
        comparison = compareNumbers(left.dexNo, right.dexNo)
        break
      case 'name':
        comparison = compareText(left.name, right.name)
        break
      case 'type':
        comparison = compareText(left.type, right.type)
        break
      case 'stage':
        comparison = compareNumbers(left.stage, right.stage)
        break
      case 'habitat':
        comparison = compareText(left.habitat, right.habitat)
        break
      case 'height':
        comparison = compareNumbers(parseMeasurement(left.height), parseMeasurement(right.height))
        break
      case 'weight':
        comparison = compareNumbers(parseMeasurement(left.weight), parseMeasurement(right.weight))
        break
    }
    if (comparison === 0) {
      comparison = compareNumbers(left.dexNo, right.dexNo)
      return comparison
    }
    return comparison * multiplier
  })
}

export function sortTeamCopies(
  copies: TeamSortCopy[],
  sortKey: TeamSortKey,
  direction: SortDirection = 'asc',
): TeamSortCopy[] {
  const multiplier = direction === 'asc' ? 1 : -1

  return [...copies].sort((left, right) => {
    const leftSpecies = speciesById[left.dragon.speciesId]
    const rightSpecies = speciesById[right.dragon.speciesId]
    let comparison = 0

    switch (sortKey) {
      case 'name':
        comparison = compareText(leftSpecies.name, rightSpecies.name)
        break
      case 'nickname':
        comparison = compareText(
          left.dragon.nickname?.trim() || leftSpecies.name,
          right.dragon.nickname?.trim() || rightSpecies.name,
        )
        break
      case 'level':
        comparison = compareNumbers(left.dragon.level, right.dragon.level)
        break
      case 'type':
        comparison = compareText(leftSpecies.type, rightSpecies.type)
        break
      case 'stage':
        comparison = compareNumbers(leftSpecies.stage, rightSpecies.stage)
        break
      case 'dexNo':
        comparison = compareNumbers(leftSpecies.dexNo, rightSpecies.dexNo)
        break
      case 'location':
        comparison = compareText(left.location, right.location)
        break
      case 'hp':
        comparison = compareNumbers(left.dragon.hp, right.dragon.hp)
        break
      case 'xp':
        comparison = compareNumbers(left.dragon.xp, right.dragon.xp)
        break
      case 'attack':
        comparison = compareNumbers(left.dragon.attack, right.dragon.attack)
        break
      case 'defense':
        comparison = compareNumbers(left.dragon.defense, right.dragon.defense)
        break
    }

    if (comparison === 0) {
      comparison = compareNumbers(leftSpecies.dexNo, rightSpecies.dexNo)
      if (comparison === 0) {
        comparison = compareText(left.dragon.instanceId, right.dragon.instanceId)
      }
      return comparison
    }
    return comparison * multiplier
  })
}
