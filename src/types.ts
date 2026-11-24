export type DragonType =
  | 'fire'
  | 'water'
  | 'grass'
  | 'ice'
  | 'electric'
  | 'light'
  | 'cloud'
  | 'dark'

export type View = 'title' | 'town' | 'planet1' | 'planet2' | 'battle' | 'dex' | 'map'

export interface DragonSpecies {
  id: string
  dexNo: number
  name: string
  type: DragonType
  stage: 1 | 2 | 3
  evolvesAt?: number
  evolvesTo?: string
  color: string
  accent: string
  habitat: string
  height: string
  description: string
}

export interface Move {
  name: string
  type: DragonType
  power: number
  accuracy: number
}

export interface DragonInstance {
  speciesId: string
  nickname?: string
  level: number
  xp: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  moves: Move[]
}

export interface BattleState {
  kind: 'wild' | 'fireGym' | 'grassGym' | 'gang'
  enemy: DragonInstance
  enemyName: string
  log: string[]
  finished: boolean
  won: boolean
  caught: boolean
}

export interface GameSave {
  playerName: string
  starterId: string
  party: DragonInstance[]
  bench: DragonInstance[]
  seen: string[]
  caught: string[]
  badges: string[]
  storyStep: number
  darkGangDefeated: boolean
  currentPlanet: 1 | 2
}
