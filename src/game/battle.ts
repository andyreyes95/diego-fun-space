import { createDragon, dragonSpecies, getEffectiveness, speciesById } from '../data'
import type { DragonInstance, Move } from '../types'

export interface AttackResult {
  hit: boolean
  damage: number
  effectiveness: number
}

interface AttackOptions {
  accuracyCheck?: boolean
  attackScale?: number
  defenseScale?: number
  variance?: boolean
}

export function resolveAttack(
  attacker: DragonInstance,
  defender: DragonInstance,
  move: Move,
  roll: () => number = Math.random,
  options: AttackOptions = {},
): AttackResult {
  const hit = options.accuracyCheck === false || roll() * 100 <= move.accuracy
  if (!hit) return { hit: false, damage: 0, effectiveness: 1 }

  const defenderSpecies = speciesById[defender.speciesId]
  const effectiveness = getEffectiveness(move.type, defenderSpecies.type)
  const variance = options.variance === false ? 1 : 0.88 + roll() * 0.24
  const attackScale = options.attackScale ?? 0.32
  const defenseScale = options.defenseScale ?? 0.18
  const damage = Math.max(
    1,
    Math.round(
      (move.power + attacker.attack * attackScale - defender.defense * defenseScale)
      * effectiveness
      * variance,
    ),
  )
  return { hit: true, damage, effectiveness }
}

export function gainExperience(dragon: DragonInstance, amount: number): DragonInstance {
  let level = dragon.level
  let xp = dragon.xp + amount
  let maxHp = dragon.maxHp
  let hp = dragon.hp
  let attack = dragon.attack
  let defense = dragon.defense

  while (xp >= level * 10) {
    xp -= level * 10
    level += 1
    maxHp += 5
    hp = Math.min(maxHp, hp + 5)
    attack += 2
    defense += 2
  }

  return { ...dragon, level, xp, hp, maxHp, attack, defense }
}

export function evolveInstance(
  dragon: DragonInstance,
): { instance: DragonInstance; beforeId: string; afterId: string } | null {
  const species = speciesById[dragon.speciesId]
  if (!species.evolvesAt || !species.evolvesTo || dragon.level < species.evolvesAt) return null

  const evolved = createDragon(species.evolvesTo, dragon.level)
  const hpBonus = Math.max(0, evolved.maxHp - dragon.maxHp)
  return {
    beforeId: dragon.speciesId,
    afterId: species.evolvesTo,
    instance: {
      ...evolved,
      instanceId: dragon.instanceId,
      nickname: dragon.nickname,
      xp: dragon.xp,
      hp: Math.min(evolved.maxHp, dragon.hp + hpBonus),
    },
  }
}

export function effectivenessText(effectiveness: number): string {
  if (effectiveness > 1) return ' It was super effective!'
  if (effectiveness < 1) return ' It was not very effective.'
  return ''
}

export function getWildEncounterLevel(stage: 1 | 2, roll: () => number = Math.random): number {
  if (stage === 1) return 5 + Math.floor(roll() * 3)
  return roll() < 0.10 ? 9 : 8
}

export function getWildEncounter(roll: () => number = Math.random): { speciesId: string; level: number } {
  const stage: 1 | 2 = roll() < 0.6 ? 1 : 2
  const pool = dragonSpecies.filter((species) => species.stage === stage && species.type !== 'light')
  const speciesId = pool[Math.floor(roll() * pool.length)].id
  return { speciesId, level: getWildEncounterLevel(stage, roll) }
}

export function isDarkGangAmbush(roll: () => number = Math.random): boolean {
  return roll() < 0.15
}

export function doesWildDragonRunAway(attempt: number, roll: () => number = Math.random): boolean {
  const runChance = attempt >= 3 ? 1 : attempt === 2 ? 0.6 : 0.2
  return roll() < runChance
}

export type TrainerBattleKind = 'fireGym' | 'grassGym' | 'gang'

export function applyKnockoutExperience(dragon: DragonInstance, defeatedLevel: number): {
  instance: DragonInstance
  evolution: ReturnType<typeof evolveInstance>
  xpGain: number
} {
  const xpGain = defeatedLevel * 7
  const instance = gainExperience(dragon, xpGain)
  const evolution = evolveInstance(instance)
  return { instance: evolution?.instance ?? instance, evolution, xpGain }
}

export function getOpponentTeam(kind: TrainerBattleKind, phase: 0 | 1 | 2 = 2): DragonInstance[] {
  if (kind === 'fireGym') {
    const teams = [
      [['sparkfox', 5], ['cindrake', 6], ['glowmoth', 7]],
      [['flamewhisk', 8], ['fluxite', 9], ['pyrocub', 10]],
      [['infernotail', 12], ['infernastra', 14], ['rubyblaze', 14], ['ashrex', 16]],
    ] as const
    return teams[phase].map(([speciesId, level]) => createDragon(speciesId, level))
  }
  if (kind === 'grassGym') {
    const teams = [
      [['budlet', 7], ['sproutkin', 8], ['seedpip', 9]],
      [['florwick', 10], ['leafling', 11], ['thornling', 12]],
      [['bloomstrider', 14], ['canopyshade', 16], ['bramblewhip', 16], ['groveclaw', 18]],
    ] as const
    return teams[phase].map(([speciesId, level]) => createDragon(speciesId, level))
  }
  return [
    createDragon('shadee', 8),
    createDragon('noxibear', 12),
    createDragon('umbrawyrm', 16),
    createDragon('umbrawyrm', 18),
  ]
}
