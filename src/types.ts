export type DragonType =
  | 'fire'
  | 'water'
  | 'grass'
  | 'ice'
  | 'electric'
  | 'light'
  | 'cloud'
  | 'dark'

export type View = 'title' | 'town' | 'planet1' | 'planet2' | 'battle' | 'dex' | 'team' | 'map'

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
  weight: string
  description: string
}

export interface Move {
  name: string
  type: DragonType
  power: number
  accuracy: number
}

export interface DragonInstance {
  instanceId: string
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
  trainerPhase?: 0 | 1 | 2
  enemy: DragonInstance
  enemyTeam: DragonInstance[]
  enemyActiveIndex: number
  enemyName: string
  log: BattleLogEntry[]
  finished: boolean
  won: boolean
  caught: boolean
  catchAttempts: number
}

export interface BattleLogEntry {
  side: 'player' | 'opponent' | 'system'
  text: string
}

export type BattleEvent =
  | { kind: 'evolution'; beforeId: string; afterId: string }
  | { kind: 'badge'; badge: 'Ember' | 'Bloom' }
  | { kind: 'catch'; speciesId: string; joinedParty: boolean }
  | { kind: 'escape'; speciesId: string; attempts: number }
  | { kind: 'ambush'; captainName: string }

export interface GameSave {
  saveVersion: number
  playerName: string
  starterId: string
  party: DragonInstance[]
  reserve: DragonInstance[]
  seen: string[]
  caught: string[]
  captureCounts: Partial<Record<string, number>>
  badges: string[]
  gymProgress: {
    fire: 0 | 1 | 2
    grass: 0 | 1 | 2
  }
  storyStep: number
  darkGangDefeated: boolean
  currentPlanet: 0 | 1 | 2
  mossgroveCaptureBaseline: number
}
