import { describe, expect, it } from 'vitest'
import { createDragon, dragonSpecies } from '../data'
import { applyKnockoutExperience, doesWildDragonRunAway, evolveInstance, gainExperience, getOpponentTeam, getWildEncounter, getWildEncounterLevel, isDarkGangAmbush, resolveAttack } from './battle'
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
      { kind: 'electricGym' as const, type: 'electric' },
      { kind: 'cloudGym' as const, type: 'cloud' },
      { kind: 'waterGym' as const, type: 'water' },
      { kind: 'iceGym' as const, type: 'ice' },
      { kind: 'gang' as const, type: 'dark' },
    ]
    for (const testCase of cases) {
      const team = getOpponentTeam(testCase.kind)
      expect(team).toHaveLength(4)
      expect(team.every((dragon) => speciesById[dragon.speciesId].type === testCase.type)).toBe(true)
    }
  })

  it('uses two stage 1/2 trainer battles before an all-stage-3 leader battle', () => {
    for (const [kind, type] of [['fireGym', 'fire'], ['grassGym', 'grass'], ['electricGym', 'electric'], ['cloudGym', 'cloud'], ['waterGym', 'water'], ['iceGym', 'ice']] as const) {
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

  it('keeps low-level Emberfall wild dragons within stage-appropriate levels', () => {
    expect(getWildEncounterLevel(1, () => 0)).toBe(5)
    expect(getWildEncounterLevel(1, () => 0.99)).toBe(7)
    expect(getWildEncounterLevel(2, () => 0)).toBe(9)
    expect(getWildEncounterLevel(2, () => 0.99)).toBe(8)
  })

  it('limits wild pools on every planet to Stage 1 and Stage 2', () => {
    const rolls = [0.99, 0.5, 0.99]
    const encounter = getWildEncounter(() => rolls.shift() ?? 0)
    expect(speciesById[encounter.speciesId].stage).toBe(2)
    expect(encounter.level).toBe(8)
  })

  it('excludes Light dragons from both wild stages while keeping all other eligible species', () => {
    for (const stage of [1, 2] as const) {
      const encountered = new Set<string>()
      for (let index = 0; index < dragonSpecies.length; index += 1) {
        const rolls = [stage === 1 ? 0 : 0.99, index / dragonSpecies.length, 0]
        const encounter = getWildEncounter(() => rolls.shift() ?? 0)
        const species = speciesById[encounter.speciesId]
        expect(species.type).not.toBe('light')
        expect(species.stage).toBe(stage)
        encountered.add(species.id)
      }
      expect(encountered).toEqual(new Set(
        dragonSpecies
          .filter((species) => species.stage === stage && species.type !== 'light')
          .map((species) => species.id),
      ))
    }
  })

  it('triggers a Dark Gang ambush for 15 percent of wild explorations', () => {
    expect(isDarkGangAmbush(() => 0.1499)).toBe(true)
    expect(isDarkGangAmbush(() => 0.15)).toBe(false)
    expect(isDarkGangAmbush(() => 0.99)).toBe(false)
  })

  it('increases wild escape chances after failed capture attempts', () => {
    expect(doesWildDragonRunAway(1, () => 0.19)).toBe(true)
    expect(doesWildDragonRunAway(1, () => 0.2)).toBe(false)
    expect(doesWildDragonRunAway(2, () => 0.59)).toBe(true)
    expect(doesWildDragonRunAway(2, () => 0.6)).toBe(false)
    expect(doesWildDragonRunAway(3, () => 0.99)).toBe(true)
  })
})
