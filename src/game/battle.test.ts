import { describe, expect, it } from 'vitest'
import { createDragon, dragonSpecies } from '../data'
import { applyAttackExperience, doesLightEncounterAppear, doesWildDragonRunAway, evolveInstance, gainExperience, getCaptureChance, getLegendaryEncounter, getLightEncounter, getLightEncounterPlanet, getOpponentTeam, getWildEncounter, getWildEncounterLevel, isDarkGangAmbush, resolveAttack, resolveCaptureAttempt } from './battle'
import { speciesById } from '../data'

describe('battle rules', () => {
  it('scales capture chance from 15% at full HP to 90% at no HP', () => {
    expect(getCaptureChance(100, 100)).toBeCloseTo(0.15)
    expect(getCaptureChance(50, 100)).toBeCloseTo(0.525)
    expect(getCaptureChance(25, 100)).toBeCloseTo(0.7125)
    expect(getCaptureChance(0, 100)).toBeCloseTo(0.9)
  })

  it('reduces catch chance for high-level targets and clamps it to 5-90%', () => {
    expect(getCaptureChance(100, 100, 5)).toBeCloseTo(0.15)
    expect(getCaptureChance(100, 100, 30)).toBeCloseTo(0.05)
    expect(getCaptureChance(10, 100, 30)).toBeCloseTo(0.72)
    expect(getCaptureChance(10, 100, 60)).toBeCloseTo(0.57)
    expect(getCaptureChance(10, 100, 70)).toBeCloseTo(0.525)
    expect(getCaptureChance(100, 100, 999)).toBe(0.05)
    expect(getCaptureChance(0, 0, 999)).toBe(0.05)
  })

  it('resolves catch success, escape, and future item modifiers', () => {
    const rolls = [() => 0.1, () => 0.5]
    expect(resolveCaptureAttempt(100, 100, 1, true, rolls.shift()!)).toMatchObject({ caught: true, escaped: false, chance: 0.15 })
    expect(resolveCaptureAttempt(100, 100, 1, true, rolls.shift()!, 2)).toMatchObject({ caught: false, escaped: false, chance: 0.3 })
    expect(resolveCaptureAttempt(100, 100, 3, true, () => 0.9)).toMatchObject({ caught: false, escaped: true })
    expect(resolveCaptureAttempt(100, 100, 3, true, () => 0.9)).toMatchObject({ caught: false, escaped: true })
  })

  it('maps only story planets to the four rare Light encounters', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8].map(getLightEncounterPlanet)).toEqual([1, null, 3, null, 5, null, 7, null])
    expect(([1, 3, 5, 7] as const).map((planet) => getLightEncounter(planet)).map((entry) => entry.speciesId)).toEqual([
      'lumopod',
      'gleamlet',
      'prismglow',
      'haloflare',
    ])
  })

  it('gives each uncaught Light encounter a 20% appearance chance', () => {
    expect(doesLightEncounterAppear(() => 0.199)).toBe(true)
    expect(doesLightEncounterAppear(() => 0.2)).toBe(false)
  })

  it('gates and rolls legendary encounters after the Radiant Badge', () => {
    const hidden = { badges: [], caught: [] }
    expect(getLegendaryEncounter(1, hidden, () => 0)).toBeNull()

    const revealed = { badges: ['Radiant'], caught: [] }
    expect(getLegendaryEncounter(1, revealed, () => 0.099)).toEqual({ speciesId: 'vihaarion', level: 60 })
    expect(getLegendaryEncounter(1, revealed, () => 0.1)).toBeNull()
    expect(getLegendaryEncounter(2, revealed, () => 0)).toEqual({ speciesId: 'hudsorion', level: 60 })
    expect(getLegendaryEncounter(3, revealed, () => 0)).toEqual({ speciesId: 'phurion', level: 60 })
    expect(getLegendaryEncounter(8, revealed, () => 0)).toBeNull()
    expect(getLegendaryEncounter(8, { ...revealed, caught: ['vihaarion', 'hudsorion', 'phurion'] }, () => 0))
      .toEqual({ speciesId: 'diegorion', level: 70 })
    expect(getLegendaryEncounter(1, { ...revealed, caught: ['vihaarion'] }, () => 0)).toBeNull()
  })

  it('gives each legendary Dragon a unique high-power move set', () => {
    expect(createDragon('vihaarion', 60).moves.map((move) => move.name)).toEqual([
      'Crater Cataclysm', 'Crown of Inferno', 'Ashen Roar',
    ])
    expect(createDragon('hudsorion', 60).moves.map((move) => move.name)).toEqual([
      'Verdant Communion', 'Worldroot Dominion', 'Canopy Rebirth',
    ])
    expect(createDragon('phurion', 60).moves.map((move) => move.name)).toEqual([
      'Crustbreak Rush', 'Quarkflash', 'Thunderblink',
    ])
    expect(createDragon('diegorion', 70).moves.map((move) => move.name)).toEqual([
      'Genesis Radiance', 'Halo of Creation', 'Starlit Judgment',
    ])
  })

  it('excludes legendary dragons from ordinary wild encounters', () => {
    expect(Array.from({ length: 100 }, () => getWildEncounter()).every((entry) =>
      !['vihaarion', 'hudsorion', 'phurion', 'diegorion'].includes(entry.speciesId),
    )).toBe(true)
  })

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
      { kind: 'darkGym' as const, type: 'dark' },
      { kind: 'lightGym' as const, type: 'light' },
      { kind: 'gang' as const, type: 'dark' },
    ]
    for (const testCase of cases) {
        const team = getOpponentTeam(testCase.kind)
        if (testCase.kind !== 'gang') expect(team).toHaveLength(4)
        expect(team.every((dragon) => speciesById[dragon.speciesId].type === testCase.type)).toBe(true)
    }
  })

  it('gives Jake a distinct fortress boss team', () => {
    const team = getOpponentTeam('jakeBoss')
    expect(team).toHaveLength(4)
    expect(team.every((dragon) => speciesById[dragon.speciesId].type === 'dark')).toBe(true)
    expect(team.at(-1)?.speciesId).toBe('umbrawyrm')
    expect(team.at(-1)?.level).toBe(42)
  })

  it('scales Gang ambushes from the highest unlocked planet', () => {
    expect(getOpponentTeam('gang', 2, 1).map((dragon) => dragon.level)).toEqual([7])
    expect(getOpponentTeam('gang', 2, 4).map((dragon) => dragon.level)).toEqual([17, 20, 20])
    expect(getOpponentTeam('gang', 2, 8).map((dragon) => dragon.level)).toEqual([34, 36, 38, 38])
  })

  it('uses two stage 1/2 trainer battles before an all-stage-3 leader battle', () => {
    for (const [kind, type] of [['fireGym', 'fire'], ['grassGym', 'grass'], ['electricGym', 'electric'], ['cloudGym', 'cloud'], ['waterGym', 'water'], ['iceGym', 'ice'], ['darkGym', 'dark'], ['lightGym', 'light']] as const) {
      expect(getOpponentTeam(kind, 0).every((dragon) => speciesById[dragon.speciesId].stage < 3 && speciesById[dragon.speciesId].type === type)).toBe(true)
      expect(getOpponentTeam(kind, 1).every((dragon) => speciesById[dragon.speciesId].stage < 3 && speciesById[dragon.speciesId].type === type)).toBe(true)
      expect(getOpponentTeam(kind, 2).every((dragon) => speciesById[dragon.speciesId].stage === 3 && speciesById[dragon.speciesId].type === type)).toBe(true)
    }
  })

  it('awards XP to the dragon that lands each successful attack', () => {
    let dragon = createDragon('embbite', 5)
    const firstAttack = applyAttackExperience(dragon, 8)
    expect(firstAttack.xpGain).toBe(3)
    dragon = firstAttack.instance
    const switchedDragon = applyAttackExperience(createDragon('spriglet', 5), 14)
    expect(switchedDragon.xpGain).toBe(5)
    expect(switchedDragon.instance.xp).toBe(5)
    expect(switchedDragon.instance.level).toBe(5)
    expect(dragon.xp).toBe(3)
    expect(dragon.level).toBe(5)
    dragon = applyAttackExperience(dragon, 7).instance
    expect(dragon.xp).toBe(6)
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
          .filter((species) =>
            species.stage === stage
            && species.type !== 'light'
            && !['vihaarion', 'hudsorion', 'phurion', 'diegorion'].includes(species.id),
          )
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
