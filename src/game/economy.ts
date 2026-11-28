import type { BattleState, GameSave } from '../types'

export type CaptureOrbId = 'sparkOrb' | 'moonOrb' | 'novaOrb'

export const captureOrbProgression = [
  'Dust',
  'Spark',
  'Ember',
  'Meteor',
  'Comet',
  'Satellite',
  'Moon',
  'Planet',
  'Star',
  'Nebula',
  'Pulsar',
  'Quasar',
  'Nova',
  'Supernova',
  'Galaxy',
  'Black Hole',
  'Infinity',
] as const

export interface CaptureOrb {
  id: CaptureOrbId
  name: string
  description: string
  price: number
  multiplier: number
}

export const captureOrbs: CaptureOrb[] = [
  { id: 'sparkOrb', name: `${captureOrbProgression[0]} Orb`, description: 'A simple, dependable orb made for every new trainer.', price: 20, multiplier: 1 },
  { id: 'moonOrb', name: `${captureOrbProgression[1]} Orb`, description: 'A bright starter orb with a little extra capture pull.', price: 40, multiplier: 1.1 },
  { id: 'novaOrb', name: `${captureOrbProgression[2]} Orb`, description: 'A warm, powerful orb for more stubborn dragons.', price: 80, multiplier: 1.2 },
]

export const orbById = Object.fromEntries(captureOrbs.map((orb) => [orb.id, orb])) as Record<CaptureOrbId, CaptureOrb>

export const HEALING_COST_PER_DRAGON = 10
export const GYM_ENTRY_COST = 20
export const PORTAL_COST = 20

export function getHealingCost(save: Pick<GameSave, 'party'>): number {
  return save.party.length * HEALING_COST_PER_DRAGON
}

export function getSelectedHealingCost(instanceIds: string[]): number {
  return instanceIds.length * HEALING_COST_PER_DRAGON
}

export function getBattleReward(kind: BattleState['kind'], leaderBattle = false): number {
  if (kind === 'wild' || kind === 'lightEncounter') return 0
  if (kind === 'gang') return 30
  if (kind === 'jakeBoss') return 100
  return leaderBattle ? 60 : 30
}

export function getGymEntryCost(kind: BattleState['kind']): number {
  return kind.endsWith('Gym') ? GYM_ENTRY_COST : 0
}

export function normalizeCoins(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.trunc(value)
    }
  }
  return 0
}

export function purchaseOrb(save: GameSave, orbId: CaptureOrbId): { save: GameSave; purchased: boolean } {
  const orb = orbById[orbId]
  const coins = normalizeCoins(save.coins)
  if (coins < 0 || coins < orb.price) return { save, purchased: false }
  return {
    purchased: true,
    save: {
      ...save,
      coins: coins - orb.price,
      inventory: {
        ...save.inventory,
        [orbId]: (save.inventory[orbId] ?? 0) + 1,
      },
    },
  }
}

export function consumeOrb(save: GameSave, orbId: CaptureOrbId): GameSave | null {
  const owned = save.inventory[orbId] ?? 0
  if (owned <= 0) return null
  return {
    ...save,
    inventory: {
      ...save.inventory,
      [orbId]: owned - 1,
    },
  }
}
