import { describe, expect, it } from 'vitest'
import { createDragon } from '../data'
import { applyKnockoutExperience, evolveInstance, gainExperience, getOpponentTeam, resolveAttack } from './battle'
import { speciesById } from '../data'

describe('battle rules', () => {
  it('resolves missed attacks without damage', () => {
    const attacker = createDragon('embbite', 5)
    const defender = createDragon('puddlefin', 5)
    const result = resolveAttack(attacker, defender, { name: 'Test', type: 'fire', power: 20, accuracy: 50 }, () => 0.9)
    expect(result.hit).toBe(false)
    expect(result.damage).toBe(0)
  })

  it('applies elemental effectiveness to successful attacks', () => {
    const attacker = createDragon('embbite', 5)
    const defender = createDragon('spriglet', 5)
    const rolls = [0.1, 0.5]
    const result = resolveAttack(attacker, defender, { name: 'Test', type: 'fire', power: 20, accuracy: 100 }, () => rolls.shift() ?? 0.5)
    expect(result.hit).toBe(true)
    expect(result.effectiveness).toBe(1.5)
    expect(result.damage).toBeGreaterThan(0)
  })

  it('carries excess XP through multiple level thresholds', () => {
    const gained = gainExperience(createDragon('embbite', 5), 120)
    expect(gained.level).toBe(7)
    expect(gained.xp).toBe(10)
  })

  it('preserves identity and nickname when evolving', () => {
    const dragon = { ...createDragon('embbite', 8), nickname: 'Spark' }
    const evolution = evolveInstance(dragon)
    expect(evolution?.instance.speciesId).toBe('flamico')
    expect(evolution?.instance.instanceId).toBe(dragon.instanceId)
    expect(evolution?.instance.nickname).toBe('Spark')
  })

  it('builds four-dragon same-type opponent teams', () => {
    const cases = [
      { kind: 'fireGym' as const, type: 'fire' },
      { kind: 'grassGym' as const, type: 'grass' },
      { kind: 'gang' as const, type: 'dark' },
    ]
    for (const testCase of cases) {
      const team = getOpponentTeam(testCase.kind)
      expect(team).toHaveLength(4)
      expect(team.every((dragon) => speciesById[dragon.speciesId].type === testCase.type)).toBe(true)
    }
  })

  it('uses two stage 1/2 trainer battles before an all-stage-3 leader battle', () => {
    for (const [kind, type] of [['fireGym', 'fire'], ['grassGym', 'grass']] as const) {
      expect(getOpponentTeam(kind, 0).every((dragon) => speciesById[dragon.speciesId].stage < 3 && speciesById[dragon.speciesId].type === type)).toBe(true)
      expect(getOpponentTeam(kind, 1).every((dragon) => speciesById[dragon.speciesId].stage < 3 && speciesById[dragon.speciesId].type === type)).toBe(true)
      expect(getOpponentTeam(kind, 2).every((dragon) => speciesById[dragon.speciesId].stage === 3 && speciesById[dragon.speciesId].type === type)).toBe(true)
    }
  })

  it('awards XP after every knockout in a multi-dragon battle', () => {
    let dragon = createDragon('embbite', 5)
    dragon = applyKnockoutExperience(dragon, 5).instance
    dragon = applyKnockoutExperience(dragon, 8).instance
    expect(dragon.xp).toBe(41)
    expect(dragon.level).toBe(6)
  })
})
