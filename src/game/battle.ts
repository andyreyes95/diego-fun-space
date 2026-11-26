import { createDragon, getEffectiveness, speciesById } from '../data'
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

export type TrainerBattleKind = 'fireGym' | 'grassGym' | 'gang'

export function getOpponentTeam(kind: TrainerBattleKind): DragonInstance[] {
  if (kind === 'fireGym') {
    return [
      createDragon('embbite', 5),
      createDragon('flamico', 8),
      createDragon('pyravolt', 12),
      createDragon('pyravolt', 14),
    ]
  }
  if (kind === 'grassGym') {
    return [
      createDragon('spriglet', 7),
      createDragon('vinearo', 10),
      createDragon('thornow', 12),
      createDragon('thornow', 14),
    ]
  }
  return [
    createDragon('shadee', 8),
    createDragon('noxibear', 12),
    createDragon('umbrawyrm', 16),
    createDragon('umbrawyrm', 18),
  ]
}
