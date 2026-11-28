import type { GameSave, View } from '../types'

export interface SolarNode {
  id: string
  name: string
  x: number
  y: number
  size: number
  unlockedBy: string | null
  moon?: boolean
  view: View
  routeIndex: number
}

export const solarNodes: SolarNode[] = [
  { id: 'luminara', name: 'Luminara', x: 59.7, y: 56.5, size: 7.36, unlockedBy: 'Eclipse', view: 'planet8', routeIndex: 8 },
  { id: 'voltspire', name: 'Voltspire', x: 32.2, y: 33.3, size: 6.4, unlockedBy: 'Bloom', view: 'planet3', routeIndex: 3 },
  { id: 'emberfall', name: 'Emberfall', x: 45.1, y: 78.1, size: 6.08, unlockedBy: null, view: 'planet1', routeIndex: 1 },
  { id: 'mossgrove', name: 'Mossgrove', x: 28.3, y: 71.4, size: 6.4, unlockedBy: 'Ember', view: 'planet2', routeIndex: 2 },
  { id: 'willowvale', name: 'Willowvale', x: 34.4, y: 80.8, size: 3.2, unlockedBy: null, moon: true, view: 'town', routeIndex: 0 },
  { id: 'tidehaven', name: 'Tidehaven', x: 65.5, y: 12, size: 7.36, unlockedBy: 'Breeze', view: 'planet5', routeIndex: 5 },
  { id: 'cloudrest', name: 'Cloudrest', x: 47.2, y: 7.5, size: 7.04, unlockedBy: 'Spark', view: 'planet4', routeIndex: 4 },
  { id: 'frostveil', name: 'Frostveil', x: 79, y: 41.8, size: 7.36, unlockedBy: 'Tide', view: 'planet6', routeIndex: 6 },
  { id: 'umbralis', name: 'Umbralis', x: 71.7, y: 82.2, size: 6.72, unlockedBy: 'Frost', view: 'planet7', routeIndex: 7 },
]

export function isSolarNodeUnlocked(node: SolarNode, save: GameSave): boolean {
  return node.id === 'luminara'
    ? save.badges.includes('Eclipse') && save.darkGangDefeated
    : !node.unlockedBy || save.badges.includes(node.unlockedBy)
}

export function getHighestUnlockedPlanet(save: GameSave): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 {
  const highest = solarNodes
    .filter((node) => node.routeIndex > 0 && isSolarNodeUnlocked(node, save))
    .reduce((max, node) => Math.max(max, node.routeIndex), 1)
  return highest as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}

export function getNextSolarNode(save: GameSave): SolarNode | undefined {
  return [...solarNodes]
    .sort((a, b) => a.routeIndex - b.routeIndex)
    .find((node) => node.routeIndex > save.currentPlanet && isSolarNodeUnlocked(node, save))
}
